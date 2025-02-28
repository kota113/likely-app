// App.tsx
import * as React from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context"
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {createTamagui, TamaguiProvider} from "tamagui";
import {config} from "@tamagui/config/v3";
import {StatusBar} from "react-native";
import {HomeScrollProvider} from "./contexts/HomeScrollContext";
import {Navigation} from "./components/Navigation";

const appConfig = createTamagui(config)

export default function App() {
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={appConfig}>
        <HomeScrollProvider>
        <StatusBar barStyle={"default"} translucent={true}/>
        <GestureHandlerRootView>
          <Navigation/>
        </GestureHandlerRootView>
        </HomeScrollProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
