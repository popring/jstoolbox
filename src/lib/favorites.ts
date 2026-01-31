import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatAge(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const years = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365));

  if (years === 0) {
    const months = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months <= 0 ? 'Recently' : `${months}mo ago`;
  }
  if (years === 1) return '1yr ago';
  return `${years}yrs ago`;
}

export function formatLastRelease(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

const FAVORITES_KEY = 'jstoolbox_favorites';

export interface FavoritePackage {
  name: string;
  addedAt: number;
}

export function getFavorites(): FavoritePackage[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isFavorite(name: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.name === name);
}

export function toggleFavorite(name: string): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex(f => f.name === name);

  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false;
  } else {
    favorites.push({ name, addedAt: Date.now() });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  }
}

export function addFavorite(name: string): void {
  if (isFavorite(name)) return;
  const favorites = getFavorites();
  favorites.push({ name, addedAt: Date.now() });
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function removeFavorite(name: string): void {
  const favorites = getFavorites();
  const index = favorites.findIndex(f => f.name === name);
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}
