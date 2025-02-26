import { useState, useCallback } from 'react';
// import * as Speech from 'expo-speech-recognition';
import { Alert } from 'react-native';

interface UseVoiceInputResult {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  hasPermission: boolean | null;
  transcript: string;
  resetTranscript: () => void;
}

export const useVoiceInput = (onTranscriptComplete?: (text: string) => void): UseVoiceInputResult => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  // 音声認識の権限を要求
  const requestPermissions = useCallback(async () => {
    try {
      // 実際のアプリでは、expo-speech-recognitionなどのライブラリを使用
      // ここではモック実装
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Error requesting permission:', error);
      setHasPermission(false);
      Alert.alert(
        'マイクのアクセス許可が必要です',
        '音声入力を使用するには、マイクへのアクセスを許可してください。'
      );
      return false;
    }
  }, []);

  // 録音を開始
  const startRecording = useCallback(async () => {
    // すでに録音中なら何もしない
    if (isRecording) return;

    // 権限がなければ要求
    if (hasPermission === null) {
      const granted = await requestPermissions();
      if (!granted) return;
    } else if (!hasPermission) {
      Alert.alert(
        'マイクのアクセス許可が必要です',
        '音声入力を使用するには、マイクへのアクセスを許可してください。'
      );
      return;
    }

    try {
      // 録音開始
      setIsRecording(true);
      setTranscript('');

      // 実際のアプリでは、ここで音声認識APIを使用
      // モック: 2秒後に録音を自動的に停止し、モックの文字起こしを設定
      setTimeout(() => {
        const mockTranscript = '今日のランチはどこにしようか？';
        setTranscript(mockTranscript);
        setIsRecording(false);

        if (onTranscriptComplete) {
          onTranscriptComplete(mockTranscript);
        }
      }, 2000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  }, [isRecording, hasPermission, requestPermissions, onTranscriptComplete]);

  // 録音を停止
  const stopRecording = useCallback(() => {
    if (!isRecording) return;

    // 実際のアプリでは、ここで音声認識を停止
    setIsRecording(false);
  }, [isRecording]);

  // 文字起こしをリセット
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    hasPermission,
    transcript,
    resetTranscript,
  };
};
