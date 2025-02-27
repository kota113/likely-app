// utils/helpers.ts

/**
 * 日付を「YYYY年MM月DD日」の形式にフォーマットする
 */
export const formatDateJP = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${year}年${month}月${day}日`;
};

/**
 * 運の色を取得
 */
export const getLuckColor = (luck?: 'good' | 'bad' | 'neutral'): string => {
  switch (luck) {
    case 'good':
      return '#4CAF50'; // 緑色
    case 'bad':
      return '#F44336'; // 赤色
    case 'neutral':
    default:
      return '#9E9E9E'; // グレー
  }
};

/**
 * サイコロを振るアニメーションの時間（ミリ秒）
 */
export const DICE_ANIMATION_DURATION = 2000;

/**
 * 音声認識のモック
 * 実際の実装では音声認識APIを使用する
 */
export const startVoiceRecognition = (): Promise<string> => {
  return new Promise((resolve) => {
    // モックの遅延と結果
    setTimeout(() => {
      resolve('どこに旅行に行くか迷っています');
    }, 1500);
  });
};

/**
 * 画像ピッカーのモック
 * 実際の実装ではExpoの画像ピッカーを使用する
 */
export const pickImage = (): Promise<string | undefined> => {
  return new Promise((resolve) => {
    // モックの遅延と結果
    setTimeout(() => {
      // ダミー画像URL（実際の実装では選択した画像のURIが返る）
      resolve('https://picsum.photos/200');
    }, 1000);
  });
};
