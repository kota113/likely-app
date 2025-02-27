// screens/CalendarScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDailyLuck, evaluateDecision } from '../utils/api';
import { formatDateJP, getLuckColor } from '../utils/helpers';
import {DailyLuck, Decision} from "../utils/types";

const CalendarScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [dailyLuck, setDailyLuck] = useState<DailyLuck[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    loadDailyLuck();
    generateCalendarDays(currentDate);
  }, []);

  // 日々のラックデータを読み込む
  const loadDailyLuck = async () => {
    try {
      const data = await getDailyLuck();
      setDailyLuck(data);
    } catch (error) {
      console.error('Error loading daily luck:', error);
    }
  };

  // カレンダーの日付を生成
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 月の最初の日と最後の日
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 最初の日の曜日（0が日曜、6が土曜）
    const firstDayOfWeek = firstDay.getDay();

    // 前月の残りの日数を追加
    const prevMonthDays: Date[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      prevMonthDays.push(prevDate);
    }

    // 現在の月の日数
    const currentMonthDays: Date[] = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      currentMonthDays.push(currentDate);
    }

    // 翌月の必要な日数を追加（最大42日までのカレンダーで6週間分）
    const nextMonthDays: Date[] = [];
    const totalCurrentDays = prevMonthDays.length + currentMonthDays.length;
    const remainingCells = 42 - totalCurrentDays;

    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      nextMonthDays.push(nextDate);
    }

    setCalendarDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
  };

  // 前の月へ
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    generateCalendarDays(newDate);
  };

  // 次の月へ
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    generateCalendarDays(newDate);
  };

  // 日付が選択されたときの処理
  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
  };

  // 日付の運の色を取得
  const getDayLuckColor = (date: Date): string => {
    const dateString = date.toISOString().split('T')[0];
    const dayLuck = dailyLuck.find(dl => dl.date === dateString);

    if (!dayLuck) return '#FFFFFF'; // デフォルトは白

    return getLuckColor(dayLuck.overallLuck);
  };

  // 選択された日付の決断を取得
  const getDecisionsForSelectedDate = (): Decision[] => {
    if (!selectedDate) return [];

    const dayLuck = dailyLuck.find(dl => dl.date === selectedDate);
    return dayLuck?.decisions || [];
  };

  // 決断の評価を更新
  const handleEvaluateDecision = async (id: string, evaluation: 'good' | 'bad') => {
    try {
      await evaluateDecision(id, evaluation);
      await loadDailyLuck(); // データを再読み込み
      setModalVisible(false);
    } catch (error) {
      console.error('Error evaluating decision:', error);
    }
  };

  // 決断の詳細を表示
  const handleShowDecisionDetail = (decision: Decision) => {
    setSelectedDecision(decision);
    setModalVisible(true);
  };

  // 曜日の配列
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* カレンダーヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* 曜日ヘッダー */}
      <View style={styles.weekdayHeader}>
        {weekdays.map((day, index) => (
          <Text
            key={index}
            style={[
              styles.weekdayText,
              index === 0 ? styles.sundayText : null,
              index === 6 ? styles.saturdayText : null,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* カレンダーグリッド */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const dateString = date.toISOString().split('T')[0];
          const isSelected = selectedDate === dateString;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                !isCurrentMonth && styles.otherMonthDay,
                isToday && styles.todayDay,
                isSelected && styles.selectedDay,
                { backgroundColor: isCurrentMonth ? getDayLuckColor(date) : '#FFFFFF' }
              ]}
              onPress={() => handleDateSelect(date)}
            >
              <Text
                style={[
                  styles.calendarDayText,
                  !isCurrentMonth && styles.otherMonthDayText,
                  isToday && styles.todayDayText,
                  isSelected && styles.selectedDayText,
                  date.getDay() === 0 && styles.sundayText,
                  date.getDay() === 6 && styles.saturdayText,
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 選択された日付の決断リスト */}
      {selectedDate && (
        <View style={styles.decisionListContainer}>
          <Text style={styles.decisionListTitle}>
            {formatDateJP(selectedDate)}の記録
          </Text>

          {getDecisionsForSelectedDate().length === 0 ? (
            <View style={styles.emptyDecisionsContainer}>
              <Text style={styles.emptyDecisionsText}>
                この日の記録はありません
              </Text>
            </View>
          ) : (
            <FlatList
              data={getDecisionsForSelectedDate()}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.decisionItem,
                    item.evaluation && {
                      borderLeftColor: getLuckColor(item.evaluation),
                      borderLeftWidth: 4,
                    }
                  ]}
                  onPress={() => handleShowDecisionDetail(item)}
                >
                  <Text style={styles.decisionQuestion} numberOfLines={2}>
                    {item.question}
                  </Text>
                  <Text style={styles.decisionChoice}>
                    選択: {item.chosenOption}
                  </Text>
                  <View style={styles.decisionFooter}>
                    <Text style={styles.decisionTime}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </Text>
                    {item.evaluation ? (
                      <Text
                        style={[
                          styles.decisionEvaluation,
                          { color: getLuckColor(item.evaluation) }
                        ]}
                      >
                        {item.evaluation === 'good' ? '良い運' : '悪い運'}
                      </Text>
                    ) : (
                      <Text style={styles.decisionEvaluationPending}>
                        未評価
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              style={styles.decisionList}
            />
          )}
        </View>
      )}

      {/* 決断詳細モーダル */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>決断の詳細</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {selectedDecision && (
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalQuestionLabel}>迷いごと:</Text>
                <Text style={styles.modalQuestion}>{selectedDecision.question}</Text>

                <Text style={styles.modalSectionLabel}>選択肢:</Text>
                {selectedDecision.options.map((option, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.modalOption,
                      option === selectedDecision.chosenOption && styles.modalChosenOption
                    ]}
                  >
                    {option}
                    {option === selectedDecision.chosenOption && ' (選択された)'}
                  </Text>
                ))}

                <Text style={styles.modalSectionLabel}>評価:</Text>
                <View style={styles.evaluationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.evaluationButton,
                      styles.goodLuckButton,
                      selectedDecision.evaluation === 'good' && styles.selectedEvaluationButton
                    ]}
                    onPress={() => handleEvaluateDecision(selectedDecision.id, 'good')}
                  >
                    <Ionicons name="thumbs-up" size={20} color="#FFFFFF" />
                    <Text style={styles.evaluationButtonText}>良い運</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.evaluationButton,
                      styles.badLuckButton,
                      selectedDecision.evaluation === 'bad' && styles.selectedEvaluationButton
                    ]}
                    onPress={() => handleEvaluateDecision(selectedDecision.id, 'bad')}
                  >
                    <Ionicons name="thumbs-down" size={20} color="#FFFFFF" />
                    <Text style={styles.evaluationButtonText}>悪い運</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTimestamp}>
                  {new Date(selectedDecision.timestamp).toLocaleDateString()} {new Date(selectedDecision.timestamp).toLocaleTimeString()}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  weekdayHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  sundayText: {
    color: '#FF3B30',
  },
  saturdayText: {
    color: '#007AFF',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  calendarDay: {
    width: '14.28%', // 7日で割る
    aspectRatio: 1, // 正方形
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  calendarDayText: {
    fontSize: 14,
  },
  otherMonthDay: {
    backgroundColor: '#F9F9F9',
  },
  otherMonthDayText: {
    color: '#C7C7CC',
  },
  todayDay: {
    backgroundColor: '#E3F2FD',
  },
  todayDayText: {
    fontWeight: 'bold',
  },
  selectedDay: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  selectedDayText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  decisionListContainer: {
    flex: 1,
    padding: 16,
  },
  decisionListTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  decisionList: {
    flex: 1,
  },
  decisionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    marginBottom: 12,
  },
  decisionQuestion: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  decisionChoice: {
    fontSize: 14,
    marginBottom: 8,
  },
  decisionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  decisionTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  decisionEvaluation: {
    fontSize: 14,
    fontWeight: '500',
  },
  decisionEvaluationPending: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyDecisionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyDecisionsText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40, // Safe area考慮
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    padding: 16,
  },
  modalQuestionLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  modalQuestion: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  modalSectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 8,
  },
  modalChosenOption: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
    fontWeight: '500',
  },
  evaluationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  evaluationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  evaluationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  goodLuckButton: {
    backgroundColor: '#4CAF50',
  },
  badLuckButton: {
    backgroundColor: '#F44336',
  },
  selectedEvaluationButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  modalTimestamp: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 16,
  },
});

export default CalendarScreen;
