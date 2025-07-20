'use client';

import { useState, useEffect } from 'react';
import { PreferencesManager, UserPreferences } from '@/lib/preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    sortField: 'downloads',
    sortDirection: 'desc',
    viewMode: 'individual',
  });

  // 加载偏好设置
  useEffect(() => {
    const savedPrefs = PreferencesManager.getPreferences();
    setPreferences(savedPrefs);
  }, []);

  // 更新偏好设置
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPrefs = { ...preferences, ...newPreferences };
    setPreferences(updatedPrefs);
    PreferencesManager.savePreferences(updatedPrefs);
  };

  return {
    preferences,
    updatePreferences,
  };
} 