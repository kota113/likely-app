// App.tsx
import * as React from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function HomeScreen() {
  // スクロールオフセット
  const scrollY = React.useRef(new Animated.Value(0)).current;
  // 中央要素のレイアウトからフェードアウトの閾値を決定する（初期値は仮の値）
  const [fadeThreshold, setFadeThreshold] = React.useState(0);

  // scrollY に応じた opacity のアニメーション
  const animatedOpacity = scrollY.interpolate({
    inputRange: [0, fadeThreshold],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* 中央に配置するマイクボタンとタイトル */}
      <Animated.View
        style={[styles.centralContent, { opacity: animatedOpacity }]}
        onLayout={(event) => {
          const { y, height } = event.nativeEvent.layout;
          // 中央要素の下端までの位置を閾値とする
          setFadeThreshold(y + height);
        }}
      >
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity style={styles.micButton}>
            <Text style={styles.micText}>🎤</Text>
          </TouchableOpacity>
          <Text style={styles.title}>タイトル</Text>
        </View>
      </Animated.View>

      {/* 画面下から引っ張るスクロール可能な要素 */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.bottomSheet}
        contentContainerStyle={styles.bottomSheetContentContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* ハンドル部分 */}
        <View style={styles.sheetHandle} />
        {/* スクロールコンテンツ */}
        <View style={styles.sheetContent}>
          <Text>ここにスクロール可能なコンテンツを追加</Text>
          <Text style={{ marginTop: 20 }}>コンテンツ1</Text>
          <Text style={{ marginTop: 20 }}>コンテンツ2</Text>
          <Text style={{ marginTop: 20 }}>コンテンツ3</Text>
          <Text style={{ marginTop: 20 }}>コンテンツ4</Text>
          <Text style={{ marginTop: 20 }}>コンテンツ5</Text>
          <Text style={{ marginTop: 20 }}>コンテンツ6</Text>
          <Text style={{ marginTop: 20 }}>コンテンツ7</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.centerText}>カレンダー画面</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="ホーム" component={HomeScreen} />
        <Tab.Screen name="カレンダー" component={CalendarScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  // 中央のコンテンツ（zIndex を 1 以上に設定）
  centralContent: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  micText: {
    fontSize: 36,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // ボトムシートのスタイル
  bottomSheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContentContainer: {
    paddingTop: SCREEN_HEIGHT - 100,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: SCREEN_HEIGHT + 100,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  sheetContent: {
    padding: 16,
  },
  centerText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});
