import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CalendarView} from '../components/CalendarView';
import {getJournalEntries} from '../utils/api';
import {JournalEntry} from '../utils/types';
import {Calendar, ChevronRight} from "@tamagui/lucide-icons";

// カラーパレット
const COLORS = {
  background: "#efebd0",
  primary: "#1f454e",
  secondary: "#ebcea6",
  success: "#7ebdac",
  error: "#e07a5f",     // 追加: 警告/エラー用の色
  text: {
    primary: "#1f454e", // 主要テキスト
    secondary: "#4d6a72", // 二次テキスト
    light: "#778f95",  // 薄いテキスト
  },
  surface: {
    light: "#ffffff",   // 白色の表面
    cream: "#f5f2e3",   // クリーム色の表面
  }
};

export default function JournalScreen() {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 月が変更されたときに日記エントリを取得
  const handleMonthChange = useCallback((newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  }, []);

  // 日付がタップされたときの処理
  const handleDayPress = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  // 日記エントリを取得
  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getJournalEntries(year, month);
      setEntries(data);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 日記エントリをレンダリング
  const renderJournalEntry = ({ item }: { item: JournalEntry }) => (
    <View
      style={[
        styles.entryItem,
        item.evaluation === 'good' ? styles.goodItem : styles.badItem,
      ]}
    >
      <View style={styles.entryHeader}>
        <View style={styles.dateContainer}>
          <Calendar width={14} height={14} stroke={COLORS.text.light} />
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>
        <View style={[
          styles.evaluationBadge,
          item.evaluation === 'good' ? styles.goodBadge : styles.badBadge,
        ]}>
          <Text style={[
            styles.evaluationText,
            item.evaluation === 'good' ? styles.goodText : styles.badText,
          ]}>
            {item.evaluation === 'good' ? '良い運' : '悪い運'}
          </Text>
        </View>
      </View>

      <Text style={styles.questionText}>{item.question}</Text>

      <View style={styles.choiceContainer}>
        <View style={[
          styles.choiceIndicator,
          item.evaluation === 'good' ? styles.goodIndicator : styles.badIndicator,
        ]} />
        <Text style={styles.choiceText}>{item.choice}</Text>
      </View>
    </View>
  );

  // 選択された日付のエントリをフィルタリング
  const filteredEntries = selectedDate
    ? entries.filter(entry => entry.date === selectedDate)
    : entries;

  return (
    <View
      style={{flex: 1, backgroundColor: COLORS.background}}
    >
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>運日記</Text>
          <Text style={styles.headerSubtitle}>あなたの運の記録をカレンダーで確認</Text>
        </View>

        <CalendarView
          year={year}
          month={month}
          entries={entries}
          onMonthChange={handleMonthChange}
          onDayPress={handleDayPress}
        />

        <View style={styles.entriesContainer}>
          <View style={styles.entriesHeader}>
            <Text style={styles.entriesTitle}>
              {selectedDate
                ? `${formatDate(selectedDate)}の記録`
                : '最近の運の記録'}
            </Text>
            {!selectedDate && (
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>すべて見る</Text>
                <ChevronRight width={14} height={14} stroke={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>

          {filteredEntries.length > 0 ? (
            <FlatList
              data={filteredEntries}
              renderItem={renderJournalEntry}
              keyExtractor={(item) => item.id}
              style={styles.entriesList}
              contentContainerStyle={styles.entriesListContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedDate
                  ? 'この日の記録はありません'
                  : '記録がありません'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 0
  },
  headerCard: {
    backgroundColor: COLORS.surface.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text.light,
  },
  entriesContainer: {
    flex: 1,
    marginTop: 16,
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`, // 透明度15%
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 2,
  },
  entriesList: {
    flex: 1,
  },
  entriesListContent: {
    paddingBottom: 16,
  },
  entryItem: {
    backgroundColor: COLORS.surface.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goodItem: {
    borderLeftColor: COLORS.success,
  },
  badItem: {
    borderLeftColor: COLORS.error,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.text.light,
    marginLeft: 4,
  },
  evaluationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  goodBadge: {
    backgroundColor: `${COLORS.success}15`, // 透明度15%
  },
  badBadge: {
    backgroundColor: `${COLORS.error}15`, // 透明度15%
  },
  evaluationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  goodText: {
    color: COLORS.success,
  },
  badText: {
    color: COLORS.error,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  choiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  goodIndicator: {
    backgroundColor: COLORS.success,
  },
  badIndicator: {
    backgroundColor: COLORS.error,
  },
  choiceText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${COLORS.surface.light}80`, // 透明度80%
    borderRadius: 16,
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.light,
    textAlign: 'center',
  },
});
