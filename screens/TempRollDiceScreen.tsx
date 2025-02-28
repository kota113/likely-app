import {Text, YStack} from "tamagui";
import {useVideoPlayer, VideoView} from "expo-video";
import {useEffect, useState} from "react";
import {Accelerometer} from "expo-sensors";
import {useEventListener} from "expo";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../components/Navigation";

export default function TempRollDiceScreen({navigation, route}: NativeStackScreenProps<RootStackParamList, "RollDice">) {
  const {decisionId} = route.params;
  const player = useVideoPlayer(require('../assets/rollDiceAnimation.mp4'), player => {
    player.loop = false;
  });
  useEventListener(player, 'playToEnd', () => {
    navigation.replace('DecisionResult', {decisionId});
  });

  const [isSensorAvailable, setSensorAvailable] = useState<boolean>(true);

  const accelerationThreshold = 2.0; // 加速度変化の閾値

  // 加速度センサーのセットアップ
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    // 前回の加速度を記録
    let lastAccelData = { x: 0, y: 0, z: 0 };

    const setupSensors = async (): Promise<void> => {
      const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();

      if (isAccelerometerAvailable) {
        Accelerometer.setUpdateInterval(50); // 更新間隔（ミリ秒）

        subscription = Accelerometer.addListener((data) => {
          // 加速度の変化量を計算
          const deltaX = Math.abs(data.x - lastAccelData.x);
          const deltaY = Math.abs(data.y - lastAccelData.y);
          const deltaZ = Math.abs(data.z - lastAccelData.z);

          // 変化量の合計（振動の激しさ）
          const totalDelta = deltaX + deltaY + deltaZ;

          // 現在の加速度を保存
          lastAccelData = { x: data.x, y: data.y, z: data.z };

          // しきい値を超えた場合でクールダウン期間が過ぎていればサイコロを振る
          if (totalDelta > accelerationThreshold) {
            player.play()
          }
        });

        setSensorAvailable(true);
      } else {
        setSensorAvailable(false);
      }
    };

    setupSensors();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);
  return (
    // todo: tamaguiのテーマカラーbackgroundを使う
    <YStack flex={1} backgroundColor={"#efebd0"} padding={16}>
      <YStack paddingVertical={40} alignItems={"center"} gap={5}>
        <Text fontSize={20} fontWeight="bold" color="#1f454e">
          サイコロを振りましょう！
        </Text>
        <Text fontSize={18} fontWeight="bold" color="#1f454e">
          端末を振ってください
        </Text>
      </YStack>
      <VideoView player={player} nativeControls={false} style={{flex: 1}}/>
    </YStack>
  );
}
