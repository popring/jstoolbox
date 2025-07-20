import { SortField } from '@/components/page/categoriesV2/SortSelector';
import { PackageInfo, GroupedPackageInfo } from '@/app/types/categories';
import { formatDownloads } from '@/lib/utils';

// 根据排序字段获取对应的数值
export function getValueBySortField(item: PackageInfo | GroupedPackageInfo, sortField: SortField): number {
  switch (sortField) {
    case 'downloads':
      return 'totalDownloads' in item ? item.totalDownloads : (item.npm?.downloads || 0);
    case 'stars':
      return 'repositoryStars' in item ? item.repositoryStars : (item.github?.stars || 0);
    case 'age':
      const releaseDate = 'firstReleased' in item ? item.firstReleased : item.npm?.firstReleased;
      if (!releaseDate) return 0;
      const age = new Date().getFullYear() - new Date(releaseDate).getFullYear();
      return Math.max(0, age);
    case 'lastRelease':
      const lastRelease = 'lastReleased' in item ? item.lastReleased : item.npm?.lastReleased;
      if (!lastRelease) return 0;
      const daysSince = Math.floor((Date.now() - new Date(lastRelease).getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, daysSince);
    default:
      return 0;
  }
}

// 根据排序字段获取图表标题
export function getChartTitle(sortField: SortField, categorySlug?: string): string {
  const category = categorySlug || 'Libraries';
  
  switch (sortField) {
    case 'downloads':
      return `Top ${category} by Downloads`;
    case 'stars':
      return `Top ${category} by GitHub Stars`;
    case 'age':
      return `Top ${category} by Age`;
    case 'lastRelease':
      return `Top ${category} by Last Release`;
    default:
      return `Top ${category}`;
  }
}

// 根据排序字段获取Y轴标签
export function getYAxisLabel(sortField: SortField): string {
  switch (sortField) {
    case 'downloads':
      return 'Downloads';
    case 'stars':
      return 'Stars';
    case 'age':
      return 'Age (years)';
    case 'lastRelease':
      return 'Days Since Last Release';
    default:
      return 'Value';
  }
}

// 根据排序字段格式化数值
export function formatValueBySortField(value: number, sortField: SortField): string {
  switch (sortField) {
    case 'downloads':
      return formatDownloads(value);
    case 'stars':
      return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
    case 'age':
      return `${value} years`;
    case 'lastRelease':
      return `${value} days`;
    default:
      return value.toString();
  }
}

// 根据排序字段获取数据键名
export function getDataKeyBySortField(sortField: SortField): string {
  switch (sortField) {
    case 'downloads':
      return 'value';
    case 'stars':
      return 'value';
    case 'age':
      return 'value';
    case 'lastRelease':
      return 'value';
    default:
      return 'value';
  }
} 