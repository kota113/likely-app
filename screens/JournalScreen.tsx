import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CalendarView} from '../components/CalendarView';
import {getJournalEntries} from '../utils/api';
import {JournalEntry} from '../utils/types';
import {Calendar, ChevronRight} from "@tamagui/lucide-icons";

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
          <Calendar width={14} height={14} stroke="#6B7280" />
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
    <SafeAreaView style={styles.container}>
      <ImageBackground
        // source={require('../assets/background.png')} // モック: 実際のパスに置き換える
        style={styles.background}
        resizeMode="cover"
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
                  <ChevronRight width={14} height={14} stroke="#4F46E5" />
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
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#1F2937',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: '#4F46E5',
    marginRight: 2,
  },
  entriesList: {
    flex: 1,
  },
  entriesListContent: {
    paddingBottom: 16,
  },
  entryItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goodItem: {
    borderLeftColor: '#10B981',
  },
  badItem: {
    borderLeftColor: '#EF4444',
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
    color: '#6B7280',
    marginLeft: 4,
  },
  evaluationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  goodBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  badBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  evaluationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  goodText: {
    color: '#059669',
  },
  badText: {
    color: '#DC2626',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
    backgroundColor: '#10B981',
  },
  badIndicator: {
    backgroundColor: '#EF4444',
  },
  choiceText: {
    fontSize: 14,
    color: '#4B5563',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
