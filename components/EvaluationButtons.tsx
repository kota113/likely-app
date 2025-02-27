import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Check, X} from '@tamagui/lucide-icons';
import {Evaluation} from '../utils/types';

interface EvaluationButtonsProps {
  onEvaluate: (evaluation: Evaluation) => void;
  isLoading?: boolean;
}

export const EvaluationButtons: React.FC<EvaluationButtonsProps> = ({
                                                                      onEvaluate,
                                                                      isLoading = false,
                                                                    }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>この選択は良かった？</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.goodButton]}
          onPress={() => onEvaluate('good')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Check width={20} height={20} stroke="#FFFFFF" />
              <Text style={styles.buttonText}>良かった</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.badButton]}
          onPress={() => onEvaluate('bad')}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <X width={20} height={20} stroke="#FFFFFF" />
              <Text style={styles.buttonText}>悪かった</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goodButton: {
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  badButton: {
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
