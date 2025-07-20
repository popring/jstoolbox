export interface PackageInfo {
  id: number;
  name: string;
  description: string;
  npm: Npm;
  github: Github;
  website: string;
}

export interface Github {
  url: string;
  stars: number;
  issusTotal: number;
  issusResolved: number;
}

export interface Npm {
  name: string;
  url: string;
  downloads: number;
  firstReleased: string;
  lastReleased: string;
}

// 新增：分组后的包信息
export interface GroupedPackageInfo {
  repositoryName: string;
  repositoryUrl: string;
  repositoryStars: number;
  repositoryIssuesTotal: number;
  repositoryIssuesResolved: number;
  website: string;
  packages: PackageInfo[];
  totalDownloads: number;
  firstReleased: string;
  lastReleased: string;
}