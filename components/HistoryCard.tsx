import {Text, View} from "tamagui";
import {HistoryItem} from "../utils/types";
import {Feather, MaterialIcons} from "@expo/vector-icons";

// カラーパレット
const COLORS = {
  background: "#efebd0",
  primary: "#1f454e",
  secondary: "#ebcea6",
  success: "#7ebdac",
  error: "#e07a5f",     // 警告/エラー用の色
  text: {
    primary: "#1f454e", // 主要テキスト
    secondary: "#4d6a72", // 二次テキスト
    light: "#778f95",  // 薄いテキスト
  },
  surface: {
    light: "#ffffff",   // 白色の表面
    cream: "#f5f2e3",   // クリーム色の表面
  },
  highlight: "#ebcea6",  // ハイライト用の色
  starActive: "#e3b587", // アクティブな星の色
};

interface Props {
  item: HistoryItem;
  index: number;
}

export default function HistoryCard({item, index}: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <View style={{
      backgroundColor: COLORS.surface.cream,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: COLORS.primary,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <MaterialIcons name={"calendar-month"} size={14} color={COLORS.text.light}/>
          <Text style={{
            fontSize: 12,
            color: COLORS.text.light,
            marginLeft: 4,
          }}>{formatDate(item.createdAt)}</Text>
        </View>

        {item.evaluation && (
          <View style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 9999,
            backgroundColor: item.evaluation === 'good'
              ? `${COLORS.success}15`
              : `${COLORS.error}15`,
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: item.evaluation === 'good' ? COLORS.success : COLORS.error,
            }}>
              {item.evaluation === 'good' ? '良い運' : '悪い運'}
            </Text>
          </View>
        )}
      </View>

      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 12,
      }}>{item.question}</Text>

      <View style={{
        backgroundColor: `${COLORS.surface.light}90`,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
      }}>
        <Text style={{
          fontSize: 12,
          color: COLORS.text.light,
          marginBottom: 8,
        }}>選択肢:</Text>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginLeft: -4,
          marginTop: -4,
        }}>
          {item.options.map((option, i) => (
            <View
              key={`option-${i}`}
              style={{
                backgroundColor: option === item.choice
                  ? `${COLORS.secondary}30`
                  : `${COLORS.surface.light}80`,
                borderRadius: 9999,
                paddingHorizontal: 10,
                paddingVertical: 6,
                margin: 4,
                ...(option === item.choice && {
                  borderWidth: 1,
                  borderColor: `${COLORS.secondary}40`,
                }),
              }}
            >
              <Text style={{
                fontSize: 12,
                color: option === item.choice ? COLORS.primary : COLORS.text.light,
                ...(option === item.choice && {fontWeight: '500'}),
              }}>
                {option}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Feather
            name={"star"}
            size={14}
            color={item.evaluation === 'good' ? COLORS.starActive : COLORS.text.light}
          />
          <Text style={{
            fontSize: 14,
            color: COLORS.text.light,
            marginLeft: 4,
          }}>
            <Text style={{
              fontWeight: '500',
              color: COLORS.text.secondary,
            }}>{item.choice || '未選択'}</Text>
          </Text>
        </View>

        <Text style={{
          fontSize: 12,
          color: COLORS.text.light,
          backgroundColor: `${COLORS.surface.light}80`,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 9999,
        }}>#{index}</Text>
      </View>
    </View>
  );
}
