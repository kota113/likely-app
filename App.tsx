// App.tsx
import * as React from 'react';
import {SafeAreaProvider, useSafeAreaInsets} from "react-native-safe-area-context"
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {createTamagui, TamaguiProvider} from "tamagui";
import {config} from "@tamagui/config/v3";
import HomeScreen from "./screens/HomeScreen";
import JournalScreen from "./screens/JournalScreen";
import {StatusBar, View} from "react-native";
import {HomeScrollProvider} from "./contexts/HomeScrollContext";
import DecideScreen from "./screens/DecideScreen";
import {BottomTabBar} from "./components/BottomBar";

export type RootTabParamList = {
  Home: undefined;
  Decide: undefined;
  Journal: undefined;
  History: undefined;
};
const Tab = createBottomTabNavigator<RootTabParamList>();
const appConfig = createTamagui(config)

const Navigation = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <NavigationContainer>
        <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
          <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false, title: "ホーム"}}/>
          <Tab.Screen name="Decide" component={DecideScreen} options={{
            title: "運に任せる",
            headerShown: false
          }}/>
          <Tab.Screen name="Journal" options={{title: "運日記", headerShown: false}} component={JournalScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

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
