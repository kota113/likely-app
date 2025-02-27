import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDecision} from '../hooks/useDecision';
import {useVoiceInput} from '../hooks/useVoiceInput';
import {QuestionInput} from '../components/QuestionInput';
import {OptionsList} from '../components/OptionsList';
import {ResultCard} from '../components/ResultCard';
import {EvaluationButtons} from '../components/EvaluationButtons';
import {getRecentDecisions} from '../utils/api';
import {Decision, Evaluation} from '../utils/types';
import {ChevronRight} from '@tamagui/lucide-icons';

export const DecideScreen: React.FC = () => {
  const {
    question,
    setQuestion,
    options,
    isLoadingOptions,
    selectedOption,
    evaluation,
    isLoadingEvaluation,
    submitQuestion,
    chooseRandom,
    evaluateChoice,
    reset,
  } = useDecision();

  const onTranscriptComplete = useCallback((text: string) => {
    setQuestion(text);
    submitQuestion();
  }, [setQuestion, submitQuestion]);

  const { startRecording, isRecording } = useVoiceInput(onTranscriptComplete);

  const [recentDecisions, setRecentDecisions] = useState<Decision[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState<boolean>(false);

  // 最近の決断を取得
  const loadRecentDecisions = useCallback(async () => {
    setIsLoadingRecent(true);
    try {
      const decisions = await getRecentDecisions(2);
      setRecentDecisions(decisions);
    } catch (error) {
      console.error('Error loading recent decisions:', error);
    } finally {
      setIsLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    loadRecentDecisions();
  }, [loadRecentDecisions]);

  // 質問を送信
  const handleSubmitQuestion = useCallback(() => {
    submitQuestion();
  }, [submitQuestion]);

  // 選択肢から選ぶ
  const handleChooseRandom = useCallback(() => {
    chooseRandom();
  }, [chooseRandom]);

  // 選択を評価
  const handleEvaluate = useCallback((eval_: Evaluation) => {
    evaluateChoice(eval_);

    // 評価後に最近の決断を再読み込み
    setTimeout(() => {
      loadRecentDecisions();
    }, 1000);
  }, [evaluateChoice, loadRecentDecisions]);

  // リセットして新しい質問を始める
  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  // 最近の決断をレンダリング
  const renderRecentDecision = ({ item }: { item: Decision }) => (
    <View
      style={[
        styles.recentItem,
        item.evaluation === 'good' ? styles.goodItem : item.evaluation === 'bad' ? styles.badItem : {},
      ]}
    >
      <View style={styles.recentItemHeader}>
        <Text style={styles.recentItemQuestion} numberOfLines={1}>{item.question}</Text>
        {item.evaluation && (
          <View style={[
            styles.evaluationBadge,
            item.evaluation === 'good' ? styles.goodBadge : styles.badBadge,
          ]}>
            <Text style={[
              styles.evaluationText,
              item.evaluation === 'good' ? styles.goodText : styles.badText,
            ]}>
              {item.evaluation === 'good' ? '良い運' : '悪い運'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.recentItemContent}>
        <Text style={styles.recentItemChoice} numberOfLines={1}>{item.choice}</Text>
        <Text style={styles.recentItemTime}>1日前</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        // source={require('../assets/background.png')} // モック: 実際のパスに置き換える
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {!options.length && !selectedOption ? (
            // 入力画面
            <>
              <QuestionInput
                onSubmit={handleSubmitQuestion}
                isLoading={isLoadingOptions}
              />

              {!isLoadingRecent && recentDecisions.length > 0 && (
                <View style={styles.recentContainer}>
                  <View style={styles.recentHeader}>
                    <Text style={styles.recentTitle}>最近の決断</Text>
                    <TouchableOpacity style={styles.viewAllButton}>
                      <Text style={styles.viewAllText}>すべて見る</Text>
                      <ChevronRight width={14} height={14} stroke="#4F46E5" />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={recentDecisions}
                    renderItem={renderRecentDecision}
                    keyExtractor={(item) => item.id}
                    style={styles.recentList}
                  />
                </View>
              )}
            </>
          ) : selectedOption ? (
            // 結果表示画面
            <View style={styles.resultContainer}>
              <ResultCard
                question={question}
                selectedOption={selectedOption}
                evaluation={evaluation}
              />

              {!evaluation ? (
                <EvaluationButtons
                  onEvaluate={handleEvaluate}
                  isLoading={isLoadingEvaluation}
                />
              ) : (
                <TouchableOpacity
                  style={styles.newQuestionButton}
                  onPress={handleReset}
                >
                  <Text style={styles.newQuestionButtonText}>新しい質問をする</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // 選択肢表示画面
            <OptionsList
              question={question}
              options={options}
              onChooseRandom={handleChooseRandom}
              isLoading={isLoadingOptions}
            />
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  recentContainer: {
    flex: 1,
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: '#4F46E5',
    marginRight: 2,
  },
  recentList: {
    flex: 1,
  },
  recentItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D1D5DB',
  },
  goodItem: {
    borderLeftColor: '#10B981',
  },
  badItem: {
    borderLeftColor: '#EF4444',
  },
  recentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentItemQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  evaluationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginLeft: 8,
  },
  goodBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  badBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  evaluationText: {
    fontSize: 10,
    fontWeight: '500',
  },
  goodText: {
    color: '#059669',
  },
  badText: {
    color: '#DC2626',
  },
  recentItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  recentItemChoice: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  recentItemTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  resultContainer: {
    flex: 1,
  },
  newQuestionButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newQuestionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
