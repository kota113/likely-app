import {Text, View} from "tamagui";
import {HistoryItem} from "../utils/types";
import {Feather, MaterialIcons} from "@expo/vector-icons";

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
      backgroundColor: '#f4ffff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
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
          <MaterialIcons name={"calendar-month"} size={14} color={"#6B7280"}/>
          <Text style={{
            fontSize: 12,
            color: '#6B7280',
            marginLeft: 4,
          }}>{formatDate(item.createdAt)}</Text>
        </View>

        {item.evaluation && (
          <View style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 9999,
            backgroundColor: item.evaluation === 'good'
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
            }}>
              {item.evaluation === 'good' ? '良い運' : '悪い運'}
            </Text>
          </View>
        )}
      </View>

      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
      }}>{item.question}</Text>

      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
      }}>
        <Text style={{
          fontSize: 12,
          color: '#6B7280',
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
                  ? 'rgba(79, 70, 229, 0.1)'
                  : 'rgba(243, 244, 246, 0.8)',
                borderRadius: 9999,
                paddingHorizontal: 10,
                paddingVertical: 6,
                margin: 4,
                ...(option === item.choice && {
                  borderWidth: 1,
                  borderColor: 'rgba(79, 70, 229, 0.2)',
                }),
              }}
            >
              <Text style={{
                fontSize: 12,
                color: option === item.choice ? '#4F46E5' : '#6B7280',
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
          {/*<Star*/}
          {/*  width={14}*/}
          {/*  height={14}*/}
          {/*  stroke={item.evaluation === 'good' ? '#F59E0B' : '#9CA3AF'}*/}
          {/*  fill={item.evaluation === 'good' ? '#F59E0B' : 'transparent'}*/}
          {/*/>*/}
          <Feather name={"star"} size={14} color={item.evaluation === 'good' ? '#F59E0B' : '#9CA3AF'} />
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
            marginLeft: 4,
          }}>
            <Text style={{
              fontWeight: '500',
              color: '#4B5563',
            }}>{item.choice || '未選択'}</Text>
          </Text>
        </View>

        <Text style={{
          fontSize: 12,
          color: '#9CA3AF',
          backgroundColor: 'rgba(243, 244, 246, 0.8)',
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 9999,
        }}>#{index}</Text>
      </View>
    </View>
  );
}
