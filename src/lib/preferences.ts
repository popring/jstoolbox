import { SortField, SortDirection } from '@/components/page/categoriesV2/SortSelector';

export interface UserPreferences {
  sortField: SortField;
  sortDirection: SortDirection;
  viewMode: 'individual' | 'grouped';
}

const STORAGE_KEY = 'jstoolbox_preferences';

// 默认设置
const DEFAULT_PREFERENCES: UserPreferences = {
  sortField: 'downloads',
  sortDirection: 'desc',
  viewMode: 'individual',
};

export class PreferencesManager {
  /**
   * 获取用户偏好设置
   */
  static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;

      const data = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...data };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * 保存用户偏好设置
   */
  static savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }
} 