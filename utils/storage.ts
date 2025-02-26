import AsyncStorage from '@react-native-async-storage/async-storage';
import { Decision } from './types';

// キー定数
const DECISIONS_STORAGE_KEY = '@LuckApp:decisions';

// すべての決断をローカルストレージから取得
export const getStoredDecisions = async (): Promise<Decision[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading decisions from storage', e);
    return [];
  }
};

// 決断をローカルストレージに保存
export const storeDecisions = async (decisions: Decision[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(decisions);
    await AsyncStorage.setItem(DECISIONS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving decisions to storage', e);
  }
};

// 新しい決断をローカルストレージに追加
export const addDecision = async (decision: Decision): Promise<void> => {
  try {
    const decisions = await getStoredDecisions();
    decisions.unshift(decision); // 先頭に追加
    await storeDecisions(decisions);
  } catch (e) {
    console.error('Error adding decision to storage', e);
  }
};

// 決断を更新
export const updateDecision = async (updatedDecision: Decision): Promise<void> => {
  try {
    const decisions = await getStoredDecisions();
    const index = decisions.findIndex(d => d.id === updatedDecision.id);

    if (index !== -1) {
      decisions[index] = updatedDecision;
      await storeDecisions(decisions);
    }
  } catch (e) {
    console.error('Error updating decision in storage', e);
  }
};

// 後でSupabaseとの同期用に未同期の決断を取得する関数
export const getUnsyncedDecisions = async (): Promise<Decision[]> => {
  try {
    const decisions = await getStoredDecisions();
    // ここでは仮に未同期の判定をしていないが、実際の実装では
    // 同期状態を表すフラグなどを使って未同期のものだけを返す
    return decisions;
  } catch (e) {
    console.error('Error getting unsynced decisions', e);
    return [];
  }
};
