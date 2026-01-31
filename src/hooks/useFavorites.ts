'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getFavorites,
  isFavorite as checkFavorite,
  toggleFavorite as toggleFavoriteApi,
  type FavoritePackage,
} from '@/lib/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePackage[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setMounted(true);
  }, []);

  const toggleFavorite = useCallback((name: string) => {
    const isNowFavorite = toggleFavoriteApi(name);
    setFavorites(getFavorites());
    return isNowFavorite;
  }, []);

  const isFavorite = useCallback((name: string) => {
    if (!mounted) return false;
    return checkFavorite(name);
  }, [mounted]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    mounted,
  };
}
