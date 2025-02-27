// components/BottomBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabPress('Home')}
        accessibilityLabel="ホーム画面"
      >
        <Ionicons
          name={activeTab === 'Home' ? 'home' : 'home-outline'}
          size={24}
          color={activeTab === 'Home' ? '#007AFF' : '#8E8E93'}
        />
        <Text style={[
          styles.tabLabel,
          { color: activeTab === 'Home' ? '#007AFF' : '#8E8E93' }
        ]}>
          ホーム
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.diceButton}
        onPress={() => onTabPress('Decision')}
        accessibilityLabel="運任せボタン"
      >
        <View style={styles.diceCircle}>
          <Ionicons name="dice" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.diceLabel}>運任せ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onTabPress('Calendar')}
        accessibilityLabel="カレンダー画面"
      >
        <Ionicons
          name={activeTab === 'Calendar' ? 'calendar' : 'calendar-outline'}
          size={24}
          color={activeTab === 'Calendar' ? '#007AFF' : '#8E8E93'}
        />
        <Text style={[
          styles.tabLabel,
          { color: activeTab === 'Calendar' ? '#007AFF' : '#8E8E93' }
        ]}>
          カレンダー
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20, // iPhoneの場合はSafe Areaの考慮が必要
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  diceButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  diceLabel: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  }
});

export default BottomBar;
