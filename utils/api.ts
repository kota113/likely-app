import { Decision, Evaluation, HistoryItem, JournalEntry } from './types';

// モックデータ
const mockDecisions: Decision[] = [
  {
    id: '1',
    question: 'ランチはどこにする？',
    options: ['イタリアン', 'ラーメン', 'サラダ'],
    choice: 'イタリアン',
    evaluation: 'good',
    createdAt: '2025-02-24T12:00:00Z',
    updatedAt: '2025-02-24T13:00:00Z',
  },
  {
    id: '2',
    question: '今日は何を着る？',
    options: ['青いシャツ', '黒いセーター', 'カジュアルなTシャツ'],
    choice: '青いシャツ',
    evaluation: 'bad',
    createdAt: '2025-02-25T08:00:00Z',
    updatedAt: '2025-02-25T08:30:00Z',
  },
  {
    id: '3',
    question: '週末の予定は？',
    options: ['映画を見に行く', '友達と飲みに行く', '家でリラックス'],
    choice: '映画を見に行く',
    evaluation: 'good',
    createdAt: '2025-02-26T19:00:00Z',
    updatedAt: '2025-02-26T19:30:00Z',
  },
  {
    id: '4',
    question: '新しいスマホを買うべき？',
    options: ['今買う', 'もう少し待つ'],
    choice: 'もう少し待つ',
    evaluation: 'good',
    createdAt: '2025-02-23T15:20:00Z',
    updatedAt: '2025-02-23T16:00:00Z',
  },
  {
    id: '5',
    question: '今日の運動は？',
    options: ['ランニング', 'ヨガ', '休息'],
    choice: 'ヨガ',
    evaluation: 'bad',
    createdAt: '2025-02-22T07:30:00Z',
    updatedAt: '2025-02-22T18:00:00Z',
  },
];

// 選択肢を生成するモック関数
export const generateOptions = async (question: string): Promise<string[]> => {
  // 実際の実装では、LLMのAPIを呼び出して選択肢を生成する
  // ここではランダムな選択肢のセットを返す
  const optionSets = [
    ['映画を見に行く', '友達と飲みに行く', '家でリラックス', '新しい趣味を試す'],
    ['イタリアンレストラン', 'ラーメン屋', 'サラダボウル', 'お弁当'],
    ['青いシャツ', '黒いセーター', 'カジュアルなTシャツ', 'スーツ'],
    ['今買う', 'もう少し待つ', '別の選択肢を探す'],
    ['ランニング', 'ヨガ', '筋トレ', '休息'],
  ];

  // 質問文に基づいて選択肢を選ぶロジックを模倣
  // 実際の実装ではLLMがより適切な選択肢を生成する
  if (question.includes('ランチ') || question.includes('食事')) {
    return optionSets[1];
  } else if (question.includes('着る') || question.includes('服')) {
    return optionSets[2];
  } else if (question.includes('買う') || question.includes('購入')) {
    return optionSets[3];
  } else if (question.includes('運動') || question.includes('トレーニング')) {
    return optionSets[4];
  } else {
    return optionSets[0];
  }
};

// 決断を保存するモック関数
export const saveDecision = async (decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Promise<Decision> => {
  const now = new Date().toISOString();
  const newDecision: Decision = {
    ...decision,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: now,
    updatedAt: now,
  };

  // 実際の実装では、ここでデータベースに保存する
  mockDecisions.unshift(newDecision);
  return newDecision;
};

// 決断を評価するモック関数
export const evaluateDecision = async (id: string, evaluation: Evaluation): Promise<Decision> => {
  const decision = mockDecisions.find(d => d.id === id);
  if (!decision) {
    throw new Error('Decision not found');
  }

  decision.evaluation = evaluation;
  decision.updatedAt = new Date().toISOString();

  // 実際の実装では、ここでデータベースを更新する
  return decision;
};

// 最近の決断を取得するモック関数
export const getRecentDecisions = async (limit: number = 5): Promise<Decision[]> => {
  return mockDecisions
    .filter(d => d.choice !== null)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};

// 運日記エントリーを取得するモック関数
export const getJournalEntries = async (year: number, month: number): Promise<JournalEntry[]> => {
  return mockDecisions
    .filter(d => d.evaluation !== null && d.choice !== null)
    .map(d => {
      const date = new Date(d.updatedAt);
      return {
        id: d.id,
        date: d.updatedAt.split('T')[0],
        question: d.question,
        choice: d.choice as string,
        evaluation: d.evaluation,
      };
    })
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() + 1 === month;
    });
};

// 履歴を取得するモック関数
export const getHistory = async (page: number = 1, limit: number = 10): Promise<HistoryItem[]> => {
  const start = (page - 1) * limit;
  const end = start + limit;

  return mockDecisions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(start, end)
    .map(decision => ({
      ...decision,
      evaluatedAt: decision.evaluation ? decision.updatedAt : null,
    }));
};
