import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化下载次数为 K/M/B 格式
export function formatDownloads(downloads: number): string {
  if (downloads === 0) return '0';
  
  if (downloads >= 1000000000) {
    return `${(downloads / 1000000000).toFixed(1)}B`;
  } else if (downloads >= 1000000) {
    return `${(downloads / 1000000).toFixed(1)}M`;
  } else if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(1)}K`;
  }
  
  return downloads.toString();
}
