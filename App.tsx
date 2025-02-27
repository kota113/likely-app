// App.tsx
import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// ボトムシートの peek 部分（タブバー上に見せる高さ）
const BOTTOM_SHEET_PEEK = 200;

function HomeScreen() {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  // 中央コンテンツの下端位置（onLayout で取得）
  const [centralBottom, setCentralBottom] = React.useState(0);

  // 中央コンテンツの下端が中央コンテンツの onLayout で取得される
  // 例: y + height を centralBottom として保存
  // ※ 中央コンテンツは screen 全体の中央に配置されているため、centralBottom は絶対座標です

  // effectiveFadeThreshold:
  // bottomSheet の初期表示時の上端位置と中央コンテンツの下端の差分が、
  // bottomSheet を上に引いたときに中央コンテンツが完全に隠れる scrollY 値となる
  const effectiveFadeThreshold =
    (SCREEN_HEIGHT - bottomTabBarHeight - BOTTOM_SHEET_PEEK) - centralBottom;

  // effectiveFadeThreshold が 0 以下の場合、デフォルトとして 1 を利用（divide by zero を防ぐ）
  const fadeRange = effectiveFadeThreshold > 0 ? effectiveFadeThreshold : 1;

  // scrollY に応じた中央コンテンツの opacity
  const animatedOpacity = scrollY.interpolate({
    inputRange: [0, fadeRange],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 中央コンテンツのタップを、fade が完了したら無効にする
  const [disableCentral, setDisableCentral] = React.useState(false);
  React.useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      if (value >= fadeRange && !disableCentral) {
        setDisableCentral(true);
      } else if (value < fadeRange && disableCentral) {
        setDisableCentral(false);
      }
    });
    return () => scrollY.removeListener(id);
  }, [fadeRange, disableCentral, scrollY]);

  return (
    <View style={styles.container}>
      {/* 中央コンテンツ用コンテナは flexbox で中央寄せ。
          pointerEvents を "box-none"（または disableCentral で "none"）にして、
          ボトムシートのタッチを妨げないようにします。 */}
      <View
        style={styles.centerContainer}
        pointerEvents={disableCentral ? 'none' : 'box-none'}
      >
        <Animated.View
          style={[styles.centralContent, { opacity: animatedOpacity }]}
          onLayout={(event) => {
            const { y, height } = event.nativeEvent.layout;
            setCentralBottom(y + height);
          }}
        >
          <TouchableOpacity
            style={styles.micButton}
            onPress={() => console.log('マイクボタン押下')}
          >
            <Text style={styles.micText}>🎤</Text>
          </TouchableOpacity>
          <Text style={styles.title}>タイトル</Text>
        </Animated.View>
      </View>

      {/* ボトムシート */}
      <Animated.ScrollView
        style={styles.bottomSheet}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.bottomSheetContentContainer,
          {
            // bottomTabBarHeight を考慮して peek 部分を設定
            paddingTop: SCREEN_HEIGHT - bottomTabBarHeight - BOTTOM_SHEET_PEEK,
          },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.sheetHandle} />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  centralContent: {
    alignItems: 'center',
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
  bottomSheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  bottomSheetContentContainer: {
    backgroundColor: '#fff',
    minHeight: SCREEN_HEIGHT + BOTTOM_SHEET_PEEK,
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
