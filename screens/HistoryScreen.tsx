import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { getHistory } from '../utils/api';
import { HistoryItem as HistoryItemComponent } from '../components/HistoryItem';
import { HistoryItem as HistoryItemType } from '../utils/types';

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 履歴データを取得
  const loadHistory = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (isLoading || (!hasMore && pageNum > 1)) return;

    setIsLoading(true);
    try {
      const data = await getHistory(pageNum);
      if (data.length < 10) {
        setHasMore(false);
      }

      if (append) {
        setHistory(prev => [...prev, ...data]);
      } else {
        setHistory(data);
      }

      setPage(pageNum);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  // 初回読み込み
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 追加データ読み込み
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadHistory(page + 1, true);
    }
  }, [isLoading, hasMore, page, loadHistory]);

  // 再読み込み
  const handleRefresh = useCallback(() => {
    setHasMore(true);
    loadHistory(1);
  }, [loadHistory]);

  // リストフッターをレンダリング
  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#4F46E5" />
      </View>
    );
  };

  // 空の状態をレンダリング
  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>履歴はありません</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>再読み込み</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        // source={require('../assets/background.png')} // モック: 実際のパスに置き換える
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>すべての決断履歴</Text>
            <Text style={styles.headerSubtitle}>過去のすべての決断記録を確認できます</Text>
          </View>

          <FlatList
            data={history}
            renderItem={({ item, index }) => (
              <HistoryItemComponent
                item={item}
                index={index + 1}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            refreshing={isLoading && page === 1}
            onRefresh={handleRefresh}
          />
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
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
