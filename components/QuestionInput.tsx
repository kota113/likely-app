import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {ChevronDown, Mic, Send} from '@tamagui/lucide-icons';
import {InputMode} from '../utils/types';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
                                                              onSubmit,
                                                              isLoading = false,
                                                            }) => {
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [questionText, setQuestionText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // 入力モードを切り替える
  const toggleInputMode = () => {
    setInputMode(inputMode === 'voice' ? 'text' : 'voice');
  };

  // 音声入力を開始する関数
  const startRecording = async () => {
    // 実際の実装では、音声認識APIを使用
    setIsRecording(true);

    // モック: 音声認識の結果を模擬
    setTimeout(() => {
      setIsRecording(false);
      const mockRecognizedText = '今日のランチはどこにしようか？';
      setQuestionText(mockRecognizedText);
      onSubmit(mockRecognizedText);
    }, 2000);
  };

  // テキスト入力を送信する関数
  const submitText = () => {
    if (questionText.trim() === '') return;
    onSubmit(questionText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>迷っていることは？</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleInputMode}
          disabled={isLoading}
        >
          <Text style={styles.toggleButtonText}>
            {inputMode === 'voice' ? '文字入力' : '音声入力'}
          </Text>
          <ChevronDown width={14} height={14} stroke="#4F46E5" />
        </TouchableOpacity>
      </View>

      {inputMode === 'voice' ? (
        <View style={styles.voiceContainer}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && styles.recordingButton,
              isLoading && styles.disabledButton,
            ]}
            onPress={startRecording}
            disabled={isRecording || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <Mic width={36} height={36} stroke="#FFFFFF" />
            )}
          </TouchableOpacity>
          <Text style={styles.voiceHelpText}>
            {isRecording
              ? '聞いています...'
              : isLoading
                ? '処理中...'
                : 'タップして話す'}
          </Text>
        </View>
      ) : (
        <View style={styles.textContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="例: 週末の予定は何にしようか？"
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!questionText.trim() || isLoading) && styles.disabledButton,
              ]}
              onPress={submitText}
              disabled={!questionText.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Send width={18} height={18} stroke="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.textHelpText}>
            迷っていることを入力すると、AIが選択肢を提案します
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4F46E5',
    marginRight: 4,
  },
  voiceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    opacity: 0.5,
  },
  voiceHelpText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  textContainer: {
    marginVertical: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    paddingRight: 48,
    fontSize: 16,
    minHeight: 128,
    textAlignVertical: 'top',
  },
  sendButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#4F46E5',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHelpText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
});
