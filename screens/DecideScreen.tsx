import {Text, View, XStack, YStack} from "tamagui";
import {useState} from "react";
import {Dice5} from "@tamagui/lucide-icons";
import {CompositeNavigationProp, useNavigation} from "@react-navigation/native";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {RootStackParamList, RootTabParamList} from "../components/Navigation";
import {StackNavigationProp} from "@react-navigation/stack";
import {TouchableOpacity} from "react-native";

// カラーパレット
const COLORS = {
  background: "#efebd0",
  primary: "#1f454e",
  secondary: "#ebcea6",
  success: "#7ebdac",
  error: "#e07a5f",
  text: {
    primary: "#1f454e",
    secondary: "#4d6a72",
    light: "#778f95",
  },
  surface: {
    light: "#ffffff",
    cream: "#f5f2e3",
  }
};

type DecideScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList>,
  StackNavigationProp<RootStackParamList, 'Decide'>
>;

export default function DecideScreen() {
  const navigation = useNavigation<DecideScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);

  const options = [
    { id: 1, name: 'イタリアンレストラン' },
    { id: 2, name: 'ラーメン屋' },
    { id: 3, name: 'サラダボウル' },
    { id: 4, name: 'お弁当' },
  ];

  const handleProceed = () => {
    navigation.navigate("RollDice", {decisionId: "ID_HERE"})
  };
  return (
    <View flex={1}>
      {/*todo: lottieからいい感じのアニメーションを持ってくる*/}
      {isLoading ? <View flex={1} backgroundColor={COLORS.background}>
          <Text color={COLORS.text.primary}>Loading...</Text>
        </View>:
        <YStack flex={1} backgroundColor={COLORS.background} padding={16}>
          {/* Header */}
          <View style={{
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: `${COLORS.primary}20`,
            alignItems: 'center'
          }}>
            <Text fontSize={18} fontWeight="bold" color={COLORS.primary}>
              運任せにしよう！
            </Text>
          </View>

          {/* Question Card */}
          <View style={{
            backgroundColor: COLORS.surface.light,
            borderRadius: 16,
            padding: 24,
            marginVertical: 16,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
            elevation: 2,
          }}>
            <Text fontSize={16} textAlign="center" color={COLORS.text.primary}>
              今日のランチはどこにしようか？
            </Text>
          </View>

          <Text marginVertical={8} color={COLORS.text.secondary}>選択肢:</Text>

          {/* Options */}
          {options.map((option) => (
            <View
              key={option.id}
              style={{
                backgroundColor: COLORS.surface.cream,
                borderRadius: 16,
                padding: 16,
                marginVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1
              }}
            >
              <Text fontSize={16} marginLeft={10} color={COLORS.text.primary}>{option.name}</Text>
              <Text fontSize={14} color={COLORS.text.light}>#{option.id}</Text>
            </View>
          ))}

          {/* Randomize Button */}
          {/*todo: tamaguiにテーマを適用して、tamaguiのButtonを使う*/}
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 50,
              height: 56,
              marginTop: 'auto',
              marginBottom: 16,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handleProceed}
          >
            <XStack alignItems="center">
              <Dice5 color={COLORS.surface.light} size={20} style={{marginRight: 8}}/>
              <Text style={{color: COLORS.surface.light, fontSize: 16, fontWeight: '600'}}>
                運に任せる
              </Text>
            </XStack>
          </TouchableOpacity>
        </YStack>
      }
    </View>
  )
}
