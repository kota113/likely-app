export type InputMode = 'voice' | 'text';

export type Evaluation = 'good' | 'bad' | null;

export interface Decision {
  id: string;
  question: string;
  options: string[];
  choice: string | null;
  evaluation: Evaluation;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  question: string;
  choice: string;
  evaluation: Evaluation;
}

export interface HistoryItem extends Decision {
  evaluatedAt: string | null;
}
