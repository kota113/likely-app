import {Text, View, XStack, YStack} from "tamagui";
import {useState} from "react";
import {Dice5} from "@tamagui/lucide-icons";
import {CompositeNavigationProp, useNavigation} from "@react-navigation/native";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {RootStackParamList, RootTabParamList} from "../components/Navigation";
import {StackNavigationProp} from "@react-navigation/stack";
import {TouchableOpacity} from "react-native";

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
      {isLoading ? <View flex={1}>
        <Text>Loading...</Text>
        </View>:
        <YStack flex={1} backgroundColor="#f6f7fb" padding={16}>
          {/* Header */}
          <View style={{
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e5',
            alignItems: 'center'
          }}>
            <Text fontSize={18} fontWeight="bold" color="#5e5ce6">
              運任せにしよう！
            </Text>
          </View>

          {/* Question Card */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            marginVertical: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
            elevation: 2,
          }}>
            <Text fontSize={16} textAlign="center">
              今日のランチはどこにしようか？
            </Text>
          </View>

          <Text marginVertical={8}>選択肢:</Text>

          {/* Options */}
          {options.map((option) => (
            <View
              key={option.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                marginVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1
              }}
            >
              <Text fontSize={16} marginLeft={10}>{option.name}</Text>
              <Text fontSize={14} color="#aaa">#{option.id}</Text>
            </View>
          ))}

          {/* Randomize Button */}
          {/*todo: tamaguiにテーマを適用して、tamaguiのButtonを使う*/}
          <TouchableOpacity
            style={{
              backgroundColor: '#5e5ce6',
              borderRadius: 50,
              height: 56,
              marginTop: 'auto',
              marginBottom: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleProceed}
          >
            <XStack alignItems="center">
              <Dice5 color="white" size={20} style={{marginRight: 8}}/>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                運に任せる
              </Text>
            </XStack>
          </TouchableOpacity>
        </YStack>
      }
    </View>
  )
}
