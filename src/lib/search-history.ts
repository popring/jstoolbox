export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

const STORAGE_KEY = 'jstoolbox-search-history';
const MAX_HISTORY_ITEMS = 20;

// 获取搜索历史
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
}

// 添加搜索历史
export function addToSearchHistory(query: string): void {
  if (typeof window === 'undefined') return;
  if (!query?.trim()) return;

  try {
    const history = getSearchHistory();

    // 移除已有的相同查询
    const filtered = history.filter(item => item.query !== query);

    // 添加到开头
    filtered.unshift({
      query: query.trim(),
      timestamp: Date.now()
    });

    // 限制数量
    const limited = filtered.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

// 清空搜索历史
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}

// 删除特定历史项
export function removeFromSearchHistory(query: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getSearchHistory();
    const filtered = history.filter(item => item.query !== query);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
}