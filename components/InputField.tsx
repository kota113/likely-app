// components/InputField.tsx
import React, {useState} from 'react';
import {Keyboard, TouchableOpacity, View,} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {startVoiceRecognition} from '../utils/helpers';
import {Button, Text, XStack} from "tamagui";
import LottieView from 'lottie-react-native';

interface InputFieldProps {
  onInputSubmit: (text: string) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                 onInputSubmit,
                                                 placeholder = '何に迷ってますか？'
                                               }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');

  // 音声認識のシミュレーション
  const handleVoiceRecognition = async () => {
    setIsRecording(true);
    try {
      const recognizedText = await startVoiceRecognition();
      setText(recognizedText);
      // 認識結果が空でなければ自動的に送信
      if (recognizedText.trim()) {
        onInputSubmit(recognizedText);
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
    } finally {
      setIsRecording(false);
    }
  };

  // テキスト入力モードの切り替え
  const toggleInputMode = () => {
    setInputMode(inputMode === 'voice' ? 'text' : 'voice');
  };

  // テキスト送信処理
  const handleSubmit = () => {
    if (text.trim()) {
      onInputSubmit(text);
      setText('');
      Keyboard.dismiss();
    }
  };

  return (
    <>
      <Text textAlign={"center"} fontWeight={"bold"} fontSize={30} marginBottom={25}>なにで迷ってますか？</Text>
      <TouchableOpacity onPress={handleVoiceRecognition}>
        <View style={{
          height: 115,
          backgroundColor: '#3f785c',
          width: 115,
          borderRadius: 100,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {isRecording ? (
            <LottieView
              source={require('../assets/animations/voice-recognizing.json')}
              autoPlay
              loop
              style={{width: '100%', height: '100%'}}
            />
          ) : (
            <MaterialIcons name={'mic'} size={80} color={'white'}/>
          )}
        </View>
      </TouchableOpacity>
      <Button
        icon={
          <XStack justifyContent={"center"} alignItems={"center"}>
            <MaterialIcons name={'camera-alt'} size={24} color={'black'}/>
          </XStack>
        }
        justifyContent={"center"}
        marginTop={"$4"}
        size={"$5"}
        paddingHorizontal={"$8"}
        paddingVertical={0}
      >
        カメラ・画像
      </Button>
    </>
  );
};

export default InputField;
