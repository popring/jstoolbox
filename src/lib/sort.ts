import { PackageInfo, GroupedPackageInfo } from '@/app/types/categories';
import { SortField, SortDirection } from '@/components/page/categoriesV2/SortSelector';

// 排序单个包
export function sortPackages(packages: PackageInfo[], field: SortField, direction: SortDirection): PackageInfo[] {
  return [...packages].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'downloads':
        comparison = (a.npm?.downloads || 0) - (b.npm?.downloads || 0);
        break;
      case 'stars':
        comparison = (a.github?.stars || 0) - (b.github?.stars || 0);
        break;
      case 'age':
        const aAge = a.npm?.firstReleased ? new Date(a.npm.firstReleased).getTime() : 0;
        const bAge = b.npm?.firstReleased ? new Date(b.npm.firstReleased).getTime() : 0;
        comparison = aAge - bAge;
        break;
      case 'lastRelease':
        const aLast = a.npm?.lastReleased ? new Date(a.npm.lastReleased).getTime() : 0;
        const bLast = b.npm?.lastReleased ? new Date(b.npm.lastReleased).getTime() : 0;
        comparison = aLast - bLast;
        break;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
}

// 排序分组包
export function sortGroupedPackages(groups: GroupedPackageInfo[], field: SortField, direction: SortDirection): GroupedPackageInfo[] {
  return [...groups].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'downloads':
        comparison = a.totalDownloads - b.totalDownloads;
        break;
      case 'stars':
        comparison = a.repositoryStars - b.repositoryStars;
        break;
      case 'age':
        const aAge = a.firstReleased ? new Date(a.firstReleased).getTime() : 0;
        const bAge = b.firstReleased ? new Date(b.firstReleased).getTime() : 0;
        comparison = aAge - bAge;
        break;
      case 'lastRelease':
        const aLast = a.lastReleased ? new Date(a.lastReleased).getTime() : 0;
        const bLast = b.lastReleased ? new Date(b.lastReleased).getTime() : 0;
        comparison = aLast - bLast;
        break;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
} 