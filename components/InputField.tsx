// components/InputField.tsx
import React, {useState} from 'react';
import {Alert, Keyboard, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {startVoiceRecognition} from '../utils/helpers';
import {Button, Text, View, XStack} from "tamagui";
import LottieView from 'lottie-react-native';
import {useHomeScrollContext} from "../contexts/HomeScrollContext";
import * as ImagePicker from 'expo-image-picker';
import {Check, X} from "@tamagui/lucide-icons";
import {CompositeNavigationProp, useNavigation} from "@react-navigation/native";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {RootStackParamList, RootTabParamList} from "./Navigation";
import {StackNavigationProp} from "@react-navigation/stack";

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

interface InputFieldProps {
  onInputSubmit: (text: string) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                 onInputSubmit,
                                                 placeholder = '何に迷ってますか？'
                                               }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [{scrollToTop}] = useHomeScrollContext();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (result.canceled) return;
      const assets = result.assets?.[0]
      if (assets) {
        setSelectedImage(assets.uri);
      }
    } catch (error) {
      Alert.alert('エラーが発生しました');
    }
  };

  // 音声認識のシミュレーション
  const handleVoiceRecognition = async () => {
    scrollToTop()
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
      navigation.navigate('Decide', {
        query: "test",
        imageUri: null
      });
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
      <Text textAlign={"center"} fontWeight={"bold"} fontSize={27} marginBottom={25}>{placeholder}</Text>
      <TouchableOpacity onPress={handleVoiceRecognition}>
        <View
          height={115}
          // todo: use background of tamagui theme
          backgroundColor={'#7ebdac'}
          width={115}
          borderRadius={100}
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
        >
          {isRecording ? (
            <LottieView
              source={require('../assets/animations/voice-recognizing.json')}
              autoPlay
              loop
              style={{width: '100%', height: '100%'}}
            />
          ) : (
            <MaterialIcons name={'mic'} size={73} color={'white'}/>
          )}
        </View>
      </TouchableOpacity>
      <XStack alignItems={"center"} paddingTop={"$4"}>
        <Button
          icon={
            <XStack justifyContent={"center"} alignItems={"center"}>
              {selectedImage ? (<Check size={"$1"}/>)
                : (<MaterialIcons name={'camera-alt'} size={24} color={'black'}/>)}
            </XStack>
          }
          justifyContent={"center"}
          size={"$5"}
          paddingHorizontal={"$8"}
          paddingVertical={0}
          onPress={handleTakePhoto}
          themeInverse={!!selectedImage}
          borderBottomRightRadius={selectedImage ? 0 : undefined}
          borderTopRightRadius={selectedImage ? 0 : undefined}
        >
          {selectedImage ? "撮影済み" : "写真を撮影"}
        </Button>
        {selectedImage && (
          <Button
            justifyContent={"center"}
            size={"$5"}
            paddingHorizontal={"$3"}
            paddingVertical={0} icon={<X size={"$1"}/>}
            borderBottomLeftRadius={0}
            borderTopLeftRadius={0}
            onPress={() => setSelectedImage(null)}
          />
        )}
      </XStack>
    </>
  );
};

export default InputField;
