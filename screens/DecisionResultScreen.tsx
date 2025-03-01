import {Check, Dice5, X} from "@tamagui/lucide-icons";
import {TouchableOpacity} from "react-native";
import {Text, View, XStack, YStack} from "tamagui";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../components/Navigation";

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

export default function DecisionResultScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'DecisionResult'>) {
  return (
    <YStack flex={1} backgroundColor={COLORS.background} justifyContent={"space-between"}>
      <YStack>
        {/* Header */}
        <View style={{
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: `${COLORS.primary}20`,
          alignItems: 'center'
        }}>
          <Text fontSize={18} fontWeight="bold" color={COLORS.primary}>
            運の結果
          </Text>
        </View>

        {/* Question Card */}
        <View style={{
          backgroundColor: COLORS.surface.light,
          borderRadius: 16,
          padding: 24,
          margin: 16,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          elevation: 2,
        }}>
          <Text fontSize={16} textAlign="center" color={COLORS.text.primary}>
            何のラーメンを食べようか？
          </Text>
        </View>

        {/* Result Card */}
        <View style={{
          backgroundColor: COLORS.primary,
          borderRadius: 16,
          padding: 24,
          marginHorizontal: 16,
          marginBottom: 16,
          alignItems: 'center',
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 4,
        }}>
          <Text fontSize={14} color={COLORS.surface.light} marginBottom={8}>
            運が選んだのは
          </Text>

          <Text fontSize={24} fontWeight="bold" color={COLORS.surface.light} marginBottom={16}>
            味噌ラーメン
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: `${COLORS.secondary}40`,
              borderRadius: 50,
              paddingVertical: 6,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Dice5 color={COLORS.surface.light} size={14} style={{ marginRight: 4 }} />
            <Text fontSize={12} color={COLORS.surface.light}>サイコロの結果</Text>
          </TouchableOpacity>
        </View>

      </YStack>

      <YStack>
        {/* Feedback Section */}
        <Text textAlign="center" marginBottom={25} color={COLORS.text.secondary}>
          この選択は良かった？
        </Text>
        <XStack justifyContent="space-between" marginHorizontal={16} marginBottom={32}>
          <TouchableOpacity
            onPress={() => {navigation.navigate('HomeTabs')}}
            style={{
              backgroundColor: COLORS.success,
              borderRadius: 12,
              paddingVertical: 16,
              width: '48%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Check color={COLORS.surface.light} size={20} style={{ marginRight: 8 }} />
            <Text color={COLORS.surface.light} fontSize={16} fontWeight="500">良かった</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {navigation.navigate('HomeTabs')}}
            style={{
              backgroundColor: COLORS.error,
              borderRadius: 12,
              paddingVertical: 16,
              width: '48%',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <X color={COLORS.surface.light} size={20} style={{ marginRight: 8 }} />
            <Text color={COLORS.surface.light} fontSize={16} fontWeight="500">悪かった</Text>
          </TouchableOpacity>
        </XStack>
      </YStack>
    </YStack>
  );
}
