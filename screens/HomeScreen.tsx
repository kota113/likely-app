import * as React from "react";
import {useEffect, useRef} from "react";
import {Animated, Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";
import InputField from "../components/InputField";
import HistoryItems from "../components/HistoryItems";
import {useHomeScrollContext} from "../contexts/HomeScrollContext";
import {List} from "@tamagui/lucide-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// ボトムシートの peek 部分（タブバー上に見せる高さ）
const BOTTOM_SHEET_PEEK = 150;

export default function HomeScreen() {
  const [_, setScrollState] = useHomeScrollContext();
  const scrollViewRef = useRef<React.ElementRef<typeof Animated.ScrollView>>(null);
  const bottomTabBarHeight = useBottomTabBarHeight();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  // 中央コンテンツの下端位置（onLayout で取得）
  const [centralBottom, setCentralBottom] = React.useState(0);

  const scrollToTop = () => {
    (scrollViewRef.current as ScrollView || null)?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    setScrollState({scrollToTop})
  }, []);

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
  // 同じくscale
  const animatedScale = scrollY.interpolate({
    inputRange: [0, fadeRange], // 既存の fade 用の範囲と同じ
    outputRange: [1, 0.9],       // フェードアウトと同時に 0.9 倍まで縮小
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
          ボトムシートのタッチを妨げないように */}
        <View
          style={styles.centerContainer}
          pointerEvents={disableCentral ? 'none' : 'box-none'}
        >
          <Animated.View
            style={[styles.centralContent, {
              opacity: animatedOpacity,
              transform: [{ scale: animatedScale }]
            }]}
            onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              setCentralBottom(y + height);
            }}
          >
            <InputField onInputSubmit={() => {}}/>
          </Animated.View>
        </View>

        {/* ボトムシート */}
        <Animated.ScrollView
          ref={scrollViewRef}
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
          <View style={styles.sheetContent}>
            <Animated.View style={[{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginBottom: 14
            }, {opacity: animatedOpacity}]}>
              <List size={24} color={"black"}/>
              <Text style={{fontWeight: 400, fontSize: 17, marginBottom: 5, marginLeft: 3}}>
                運の履歴
              </Text>
            </Animated.View>
            <HistoryItems/>
          </View>
        </Animated.ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee'
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
    // backgroundColor: "#fff8e7"
  },
  centralContent: {
    alignItems: 'center'
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
