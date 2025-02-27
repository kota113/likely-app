// App.tsx
import * as React from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context"
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {createTamagui, TamaguiProvider} from "tamagui";
import {config} from "@tamagui/config/v3";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import {StatusBar, TouchableOpacity} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {HomeScrollProvider, useHomeScrollContext} from "./contexts/HomeScrollContext";

const Tab = createBottomTabNavigator();
const appConfig = createTamagui(config)

export default function App() {
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={appConfig}>
        <HomeScrollProvider>
        <StatusBar barStyle={"default"} translucent={true}/>
        <GestureHandlerRootView>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false, tabBarLabel: "ホーム"}}/>
              <Tab.Screen name="decide" component={() => null} options={{
                tabBarLabel: "決断する",
                headerShown: false,
                tabBarButton: () => {
                  const navigation = useNavigation()
                  const [{scrollToTop}, setScrollState] = useHomeScrollContext();
                  return (
                    <TouchableOpacity
                      style={{
                        marginHorizontal: "auto",
                        padding: 20,
                        backgroundColor: "black",
                        borderRadius: 50,
                        height: 70,
                        width: 70,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: -25
                      }}
                      onPress={() => {
                        // @ts-ignore
                        navigation.navigate("Home")
                        scrollToTop()
                      }}
                    >
                      <MaterialCommunityIcons name={"dice-5-outline"} size={32} color={"#FFFFFF"}/>
                    </TouchableOpacity>
                  )
                },
              }}/>
              <Tab.Screen name="カレンダー" component={CalendarScreen}/>
            </Tab.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
        </HomeScrollProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
