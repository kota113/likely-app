import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {BottomTabBar} from "./BottomBar";
import HomeScreen from "../screens/HomeScreen";
import DecideBtnEmptyScreen from "../screens/DecideBtnEmptyScreen";
import JournalScreen from "../screens/JournalScreen";
import * as React from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import DecideScreen from "../screens/DecideScreen";
import {createStackNavigator} from "@react-navigation/stack";

export type RootTabParamList = {
  Home: undefined;
  DecideBtnEmptyScreen: undefined;
  Journal: undefined;
  History: undefined;
};
export type RootStackParamList = {
  HomeTabs: undefined;
  Decide: { query: string, imageUri: string | null };
  RollDice: { decisionId: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const HomeTabs = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false, title: "ホーム"}}/>
      <Tab.Screen name="DecideBtnEmptyScreen" component={DecideBtnEmptyScreen} options={{
        title: "運に任せる",
        headerShown: false
      }}/>
      <Tab.Screen name="Journal" options={{title: "運日記", headerShown: false}} component={JournalScreen}/>
    </Tab.Navigator>
  )
}
export const Navigation = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="HomeTabs" component={HomeTabs}/>
          <Stack.Screen name="Decide" component={DecideScreen} options={{headerShown: false}}/>
          {/*<Stack.Screen name="RollDice" component={RollDiceAction} options={{headerShown: false}}/>*/}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
