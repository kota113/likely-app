import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Calendar, Star} from '@tamagui/lucide-icons';
import {HistoryItem as HistoryItemType} from '../utils/types';

interface HistoryItemProps {
  item: HistoryItemType;
  index: number;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, index }) => {
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar width={14} height={14} stroke="#6B7280" />
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>

        {item.evaluation && (
          <View style={[
            styles.evaluationBadge,
            item.evaluation === 'good' ? styles.goodBadge : styles.badBadge
          ]}>
            <Text style={styles.evaluationText}>
              {item.evaluation === 'good' ? '良い運' : '悪い運'}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.questionText}>{item.question}</Text>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionsLabel}>選択肢:</Text>
        <View style={styles.optionsList}>
          {item.options.map((option, i) => (
            <View
              key={`option-${i}`}
              style={[
                styles.optionBadge,
                option === item.choice ? styles.selectedOptionBadge : null
              ]}
            >
              <Text style={[
                styles.optionText,
                option === item.choice ? styles.selectedOptionText : null
              ]}>
                {option}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.resultContainer}>
          <Star
            width={14}
            height={14}
            stroke={item.evaluation === 'good' ? '#F59E0B' : '#9CA3AF'}
            fill={item.evaluation === 'good' ? '#F59E0B' : 'transparent'}
          />
          <Text style={styles.resultText}>
            <Text style={styles.resultTextBold}>{item.choice || '未選択'}</Text>
          </Text>
        </View>

        <Text style={styles.indexBadge}>#{index}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  evaluationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  goodBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  badBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  evaluationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  optionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  optionsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -4,
    marginTop: -4,
  },
  optionBadge: {
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
  },
  selectedOptionBadge: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  optionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedOptionText: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  resultTextBold: {
    fontWeight: '500',
    color: '#4B5563',
  },
  indexBadge: {
    fontSize: 12,
    color: '#9CA3AF',
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
});
