import type { PageParams } from '@/types/common';

export const queryKeys = {
  dashboard: (factoryIds: string[]) => ['dashboard', factoryIds] as const,
  page: (url: string, params: PageParams) => ['page', url, params] as const,
  analytics: (pageKey: string) => ['analytics', pageKey] as const,
  maintenance: (type: string, params?: PageParams) => ['maintenance', type, params] as const,
};
