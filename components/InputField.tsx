// components/InputField.tsx
import React, {useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {Button, Text, XStack} from "tamagui";
import LottieView from 'lottie-react-native';
import {useHomeScrollContext} from "../contexts/HomeScrollContext";
import * as ImagePicker from 'expo-image-picker';
import {Check, X} from "@tamagui/lucide-icons";
import {CompositeNavigationProp, useNavigation} from "@react-navigation/native";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {RootStackParamList, RootTabParamList} from "./Navigation";
import {StackNavigationProp} from "@react-navigation/stack";
import {ExpoSpeechRecognitionModule, useSpeechRecognitionEvent} from "expo-speech-recognition";

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
  // const [text, setText] = useState('');
  // const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    navigation.navigate('Decide', {query: event.results[0]?.transcript, imageUri: selectedImage})
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

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
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "ja-JP",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      // contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
    });
  };


  // todo: テキストモードも実装する
  // テキスト入力モードの切り替え
  // const toggleInputMode = () => {
  //   setInputMode(inputMode === 'voice' ? 'text' : 'voice');
  // };

  // テキスト送信処理
  // const handleSubmit = () => {
  //   if (text.trim()) {
  //     onInputSubmit(text);
  //     setText('');
  //     Keyboard.dismiss();
  //   }
  // };

  return (
    <>
      <Text textAlign={"center"} fontWeight={"bold"} fontSize={27} marginBottom={25}>{placeholder}</Text>
      <TouchableOpacity
        onPress={handleVoiceRecognition}
        style={{
          height: 115,
          backgroundColor: '#7ebdac',
          width: 115,
          borderRadius: 100,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        {recognizing ? (
          <LottieView
            source={require('../assets/animations/voice-recognizing.json')}
            autoPlay
            loop
            style={{width: '100%', height: '100%'}}
          />
        ) : (
          <MaterialIcons name={'mic'} size={73} color={'white'}/>
        )}
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
          style={{
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 1,
          }}
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
            style={{
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 1,
            }}
          />
        )}
      </XStack>
    </>
  );
};

export default InputField;
