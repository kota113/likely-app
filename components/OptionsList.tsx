import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Shuffle} from '@tamagui/lucide-icons';

interface OptionsListProps {
  question: string;
  options: string[];
  onChooseRandom: () => void;
  isLoading?: boolean;
}

export const OptionsList: React.FC<OptionsListProps> = ({
                                                          question,
                                                          options,
                                                          onChooseRandom,
                                                          isLoading = false,
                                                        }) => {
  return (
    <View style={styles.container}>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      <Text style={styles.optionsLabel}>選択肢:</Text>

      <FlatList
        data={options}
        keyExtractor={(item, index) => `option-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.optionCard}>
            <View style={styles.optionContent}>
              <Text style={styles.optionText}>{item}</Text>
              <Text style={styles.optionNumber}>#{index + 1}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.optionsList}
      />

      <TouchableOpacity
        style={styles.randomButton}
        onPress={onChooseRandom}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Shuffle width={20} height={20} stroke="#FFFFFF" />
            <Text style={styles.randomButtonText}>運に任せる</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
  optionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  optionsList: {
    paddingBottom: 8,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    color: '#1F2937',
    flex: 1,
  },
  optionNumber: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  randomButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  randomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
