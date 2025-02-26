import { useState, useCallback } from 'react';
import { Decision, Evaluation } from '../utils/types';
import { generateOptions, saveDecision, evaluateDecision } from '../utils/api';

interface UseDecisionResult {
  question: string;
  setQuestion: (question: string) => void;
  options: string[];
  isLoadingOptions: boolean;
  selectedOption: string | null;
  evaluation: Evaluation;
  isLoadingEvaluation: boolean;
  submitQuestion: () => Promise<void>;
  chooseRandom: () => void;
  evaluateChoice: (evaluation: Evaluation) => Promise<void>;
  reset: () => void;
  currentDecision: Decision | null;
}

export const useDecision = (): UseDecisionResult => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation>(null);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState<boolean>(false);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);

  // 質問を送信し、選択肢を取得する
  const submitQuestion = useCallback(async () => {
    if (!question.trim()) return;

    setIsLoadingOptions(true);
    try {
      const generatedOptions = await generateOptions(question);
      setOptions(generatedOptions);

      // 新しい決断を作成
      const newDecision = await saveDecision({
        question,
        options: generatedOptions,
        choice: null,
        evaluation: null,
      });

      setCurrentDecision(newDecision);
    } catch (error) {
      console.error('Error generating options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  }, [question]);

  // ランダムに選択肢を選ぶ
  const chooseRandom = useCallback(() => {
    if (options.length === 0 || !currentDecision) return;

    const randomIndex = Math.floor(Math.random() * options.length);
    const choice = options[randomIndex];
    setSelectedOption(choice);

    // 決断を更新
    saveDecision({
      ...currentDecision,
      choice,
      evaluation: null,
    }).then(updatedDecision => {
      setCurrentDecision(updatedDecision);
    }).catch(error => {
      console.error('Error saving choice:', error);
    });
  }, [options, currentDecision]);

  // 選択を評価する
  const evaluateChoice = useCallback(async (eval_: Evaluation) => {
    if (!selectedOption || !currentDecision) return;

    setIsLoadingEvaluation(true);
    try {
      const updatedDecision = await evaluateDecision(currentDecision.id, eval_);
      setEvaluation(eval_);
      setCurrentDecision(updatedDecision);
    } catch (error) {
      console.error('Error evaluating choice:', error);
    } finally {
      setIsLoadingEvaluation(false);
    }
  }, [selectedOption, currentDecision]);

  // 状態をリセットする
  const reset = useCallback(() => {
    setQuestion('');
    setOptions([]);
    setSelectedOption(null);
    setEvaluation(null);
    setCurrentDecision(null);
  }, []);

  return {
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
    currentDecision,
  };
};
