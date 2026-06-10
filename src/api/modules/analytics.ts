import { http } from '@/api/http';
import type { ApiResponse } from '@/types/common';
import type { AnalyticsPageData } from '@/types/analytics';

export type AnalyticsKey = 'assets' | 'factory' | 'maintenance' | 'finance' | 'spares';

export async function getAnalyticsPage(pageKey: AnalyticsKey): Promise<AnalyticsPageData> {
  const response = await http.get<ApiResponse<AnalyticsPageData>>(`/analytics/${pageKey}`);
  return response.data.data;
}
