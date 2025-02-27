import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Calendar, Dice5, Home} from "@tamagui/lucide-icons";
import {View} from "tamagui"
import {useHomeScrollContext} from "../contexts/HomeScrollContext";

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const [{scrollToTop: scrollHomeToTop}] = useHomeScrollContext()

  return (
    <View style={[
      styles.container,
      { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === 'Decide') {
            navigation.navigate('Home')
            scrollHomeToTop()
            return
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // タブアイコンの選択
        const renderIcon = () => {
          const iconColor = isFocused ? '#4F46E5' : '#9CA3AF';
          const size = 20;

          switch (route.name) {
            case 'Home':
              return <Home stroke={iconColor} width={size} height={size} />;
            case 'Journal':
              return <Calendar stroke={iconColor} width={size} height={size} />;
            case 'Decide':
              return <View
                padding={20}
                marginTop={-40}
                borderRadius={100}
                backgroundColor={"#4F46E5"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Dice5
                  color={"#ffffff"}
                />
              </View>;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={onPress}
            style={styles.tabButton}
          >
            <View style={[
              styles.iconContainer,
              isFocused && styles.activeIconContainer
            ]}>
              {renderIcon()}
            </View>
            <Text style={[
              styles.label,
              isFocused && styles.activeLabel
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// todo: インラインCSSに変更
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 100,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 100
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeLabel: {
    color: '#4F46E5',
  },
});
