import { http } from '@/api/http';
import type { ApiResponse } from '@/types/common';
import type { DashboardData } from '@/types/analytics';

export async function getDashboard(factoryIds: string[]): Promise<DashboardData> {
  const response = await http.get<ApiResponse<DashboardData>>('/dashboard', {
    params: { factoryIds },
  });
  return response.data.data;
}
