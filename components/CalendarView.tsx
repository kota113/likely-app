import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {JournalEntry} from '../utils/types';
import {ChevronDown} from "@tamagui/lucide-icons";

// カラーパレット
const COLORS = {
  background: "#efebd0",
  primary: "#1f454e",
  secondary: "#ebcea6",
  success: "#7ebdac",
  error: "#e07a5f",     // 警告/エラー用の色
  text: {
    primary: "#1f454e", // 主要テキスト
    secondary: "#4d6a72", // 二次テキスト
    light: "#778f95",  // 薄いテキスト
  },
  surface: {
    light: "#ffffff",   // 白色の表面
    cream: "#f5f2e3",   // クリーム色の表面
  },
  calendar: {
    sunday: "#c86464",  // 日曜日の色
    saturday: "#4d6a72", // 土曜日の色
  }
};

const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土'];

interface CalendarViewProps {
  year: number;
  month: number;
  entries: JournalEntry[];
  onMonthChange: (year: number, month: number) => void;
  onDayPress?: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
                                                            year,
                                                            month,
                                                            entries,
                                                            onMonthChange,
                                                            onDayPress,
                                                          }) => {
  // 前月に移動
  const goToPreviousMonth = () => {
    let newYear = year;
    let newMonth = month - 1;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    onMonthChange(newYear, newMonth);
  };

  // 翌月に移動
  const goToNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    onMonthChange(newYear, newMonth);
  };

  // 月の最初の日の曜日を取得 (0: 日曜日, 1: 月曜日, ...)
  const getFirstDayOfMonth = () => {
    return new Date(year, month - 1, 1).getDay();
  };

  // 月の日数を取得
  const getDaysInMonth = () => {
    return new Date(year, month, 0).getDate();
  };

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth();
    const daysInMonth = getDaysInMonth();

    const days = [];

    // 最初の日の前の空白セルを追加
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 月の日を追加
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // 日付に対応するエントリーを取得
  const getEntryForDay = (day: number) => {
    if (!day) return null;

    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.find(entry => entry.date === dateString);
  };

  const calendarDays = generateCalendarDays();
  const screenWidth = Dimensions.get('window').width;
  const daySize = (screenWidth - 64) / 7; // padding and borders considered

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={goToPreviousMonth}
        >
          <ChevronDown style={styles.prevIcon} width={20} height={20} stroke={COLORS.text.light} />
        </TouchableOpacity>

        <Text style={styles.monthTitle}>{`${year}年${month}月`}</Text>

        <TouchableOpacity
          style={styles.arrowButton}
          onPress={goToNextMonth}
        >
          <ChevronDown style={styles.nextIcon} width={20} height={20} stroke={COLORS.text.light} />
        </TouchableOpacity>
      </View>

      <View style={styles.daysOfWeek}>
        {DAYS_OF_WEEK.map((day, index) => (
          <View key={`day-${index}`} style={[styles.dayOfWeekCell, { width: daySize }]}>
            <Text style={[
              styles.dayOfWeekText,
              index === 0 ? styles.sundayText : null,
              index === 6 ? styles.saturdayText : null
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          const entry = day ? getEntryForDay(day) : null;

          return (
            <TouchableOpacity
              key={`cell-${index}`}
              style={[
                styles.dayCell,
                { width: daySize, height: daySize }
              ]}
              onPress={() => {
                if (day && onDayPress) {
                  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  onDayPress(dateString);
                }
              }}
              disabled={!day}
            >
              {day && (
                <View style={[
                  styles.dayContent,
                  entry && (
                    entry.evaluation === 'good'
                      ? styles.goodDayIndicator
                      : styles.badDayIndicator
                  )
                ]}>
                  <Text style={[
                    styles.dayText,
                    entry ? styles.dayTextWithEntry : null
                  ]}>
                    {day}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface.light,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 9999,
    backgroundColor: `${COLORS.secondary}30`, // 透明度30%
  },
  prevIcon: {
    transform: [{ rotate: '90deg' }],
  },
  nextIcon: {
    transform: [{ rotate: '-90deg' }],
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  daysOfWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayOfWeekCell: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayOfWeekText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.light,
  },
  sundayText: {
    color: COLORS.calendar.sunday,
  },
  saturdayText: {
    color: COLORS.calendar.saturday,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayContent: {
    width: '80%',
    height: '80%',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  dayTextWithEntry: {
    color: COLORS.surface.light,
  },
  goodDayIndicator: {
    backgroundColor: COLORS.success,
  },
  badDayIndicator: {
    backgroundColor: COLORS.error,
  },
});
