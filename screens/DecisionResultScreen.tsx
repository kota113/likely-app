import {Check, Dice5, X} from "@tamagui/lucide-icons";
import {TouchableOpacity} from "react-native";
import {Text, View, XStack, YStack} from "tamagui";

export default function DecisionResultScreen() {
  return (
    <YStack flex={1} backgroundColor="#f6f7fb">
      {/* Header */}
      <View style={{
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e5',
        alignItems: 'center'
      }}>
        <Text fontSize={18} fontWeight="bold" color="#5e5ce6">
          運の結果
        </Text>
      </View>

      {/* Question Card */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        margin: 16,
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

      {/* Result Card */}
      <View style={{
        backgroundColor: '#5e5ce6',
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 4,
      }}>
        <Text fontSize={14} color="white" marginBottom={8}>
          運が選んだのは
        </Text>

        <Text fontSize={24} fontWeight="bold" color="white" marginBottom={16}>
          お弁当
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 50,
            paddingVertical: 6,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Dice5 color="white" size={14} style={{ marginRight: 4 }} />
          <Text fontSize={12} color="white">サイコロの結果</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Section */}
      <Text textAlign="center" marginBottom={8}>
        この選択は良かった？
      </Text>

      <XStack justifyContent="space-between" marginHorizontal={16} marginBottom={32}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2ecc71',
            borderRadius: 12,
            paddingVertical: 16,
            width: '48%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Check color="white" size={20} style={{ marginRight: 8 }} />
          <Text color="white" fontSize={16} fontWeight="500">良かった</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#ff6b6b',
            borderRadius: 12,
            paddingVertical: 16,
            width: '48%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <X color="white" size={20} style={{ marginRight: 8 }} />
          <Text color="white" fontSize={16} fontWeight="500">悪かった</Text>
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
}
