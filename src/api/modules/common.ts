import type { ActionResult } from '@/api/types';
import { http } from '@/api/http';
import type { ApiResponse, PageParams, PageResult } from '@/types/common';

export async function getPage<T>(url: string, params: PageParams): Promise<PageResult<T>> {
  const response = await http.get<ApiResponse<PageResult<T>>>(url, { params });
  return response.data.data;
}

export async function submitAction(url: string, payload: Record<string, unknown>): Promise<ActionResult> {
  const response = await http.post<ApiResponse<ActionResult>>(url, payload);
  return response.data.data;
}
