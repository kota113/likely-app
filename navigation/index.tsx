import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DecideScreen } from '../screens/DecideScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { BottomTabBar } from '../components/BottomTabBar';

export type RootTabParamList = {
  Decide: undefined;
  Journal: undefined;
  History: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: '運任せアプリ',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Decide"
        component={DecideScreen}
        options={{
          title: '決断する',
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: '運日記',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: '履歴',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
