import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Calendar, Dices, Home} from "@tamagui/lucide-icons";
import {View} from "tamagui"
import {useHomeScrollContext} from "../contexts/HomeScrollContext";

// カラーパレット
const COLORS = {
  background: "#efebd0",
  primary: "#1f454e",
  secondary: "#ebcea6",
  success: "#7ebdac",
  error: "#e07a5f",
  text: {
    primary: "#1f454e",
    secondary: "#4d6a72",
    light: "#778f95",
  },
  surface: {
    light: "#ffffff",
    cream: "#f5f2e3",
  },
  tabBar: {
    background: "#f5f2e3",  // 少し濃いめのクリーム色（背景と区別できるように）
    border: "#d9d6bd",      // 境界線をはっきりさせる
    active: "#1f454e",      // アクティブなタブの色
    inactive: "#778f95",    // 非アクティブなタブの色
    activeBackground: "rgba(31, 69, 78, 0.15)", // アクティブなアイコンの背景
  }
};

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
          if (route.name === 'DecideBtnEmptyScreen') {
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
          const iconColor = isFocused ? COLORS.tabBar.active : COLORS.tabBar.inactive;
          const size = 20;

          switch (route.name) {
            case 'Home':
              return <Home stroke={iconColor} width={size} height={size} />;
            case 'Journal':
              return <Calendar stroke={iconColor} width={size} height={size} />;
            case 'DecideBtnEmptyScreen':
              return <View
                padding={18}
                marginTop={-40}
                borderRadius={100}
                backgroundColor={COLORS.secondary}
                justifyContent={"center"}
                alignItems={"center"}
                shadowColor={COLORS.primary}
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.25}
                shadowRadius={4}
                style={{elevation: 3}}
              >
                <Dices
                  color={COLORS.primary}
                  size={33}
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
            {route.name !== 'DecideBtnEmptyScreen' ? (
              <Text style={[
                styles.label,
                isFocused && styles.activeLabel
              ]}>
                {label}
              </Text>
            ): (
              <Text style={[
                styles.label
              ]}>
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.tabBar.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.tabBar.border,
    paddingVertical: 8,
    // 影を追加して境界をはっきりさせる
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6
  },
  iconContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeIconContainer: {
    backgroundColor: COLORS.tabBar.activeBackground,
    borderRadius: 10
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    color: COLORS.tabBar.inactive,
  },
  activeLabel: {
    color: COLORS.tabBar.active,
  },
});
