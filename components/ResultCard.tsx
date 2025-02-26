import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coffee } from 'react-native-feather';
import { Evaluation } from '../utils/types';

interface ResultCardProps {
  question: string;
  selectedOption: string;
  evaluation?: Evaluation;
}

export const ResultCard: React.FC<ResultCardProps> = ({
                                                        question,
                                                        selectedOption,
                                                        evaluation,
                                                      }) => {
  return (
    <View style={styles.container}>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>運が選んだのは</Text>
        <Text style={styles.resultText}>{selectedOption}</Text>

        <View style={styles.resultBadge}>
          <Coffee width={12} height={12} stroke="#FFFFFF" />
          <Text style={styles.resultBadgeText}>サイコロの結果</Text>
        </View>

        {evaluation && (
          <View style={[
            styles.evaluationBadge,
            evaluation === 'good' ? styles.goodEvaluation : styles.badEvaluation
          ]}>
            <Text style={styles.evaluationText}>
              {evaluation === 'good' ? '良い運でした！' : '運が悪かった...'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  resultCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    fontWeight: '500',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resultBadgeText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  evaluationBadge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'stretch',
  },
  goodEvaluation: {
    backgroundColor: '#10B981',
  },
  badEvaluation: {
    backgroundColor: '#EF4444',
  },
  evaluationText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
