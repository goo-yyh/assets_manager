import type { MutationResult } from '@/api/types';
import { http } from '@/api/http';
import type { ApiResponse, PageParams, PageResult } from '@/types/common';

export async function getPage<T>(url: string, params: PageParams): Promise<PageResult<T>> {
  const response = await http.get<ApiResponse<PageResult<T>>>(url, { params });
  return response.data.data;
}

export async function createRecord<T>(url: string, payload: Record<string, unknown>): Promise<MutationResult<T>> {
  const response = await http.post<ApiResponse<MutationResult<T>>>(url, payload);
  return response.data.data;
}

export async function updateRecord<T>(url: string, id: string, payload: Record<string, unknown>): Promise<MutationResult<T>> {
  const response = await http.patch<ApiResponse<MutationResult<T>>>(`${url}/${id}`, payload);
  return response.data.data;
}

export async function deleteRecord<T>(url: string, id: string): Promise<MutationResult<T>> {
  const response = await http.delete<ApiResponse<MutationResult<T>>>(`${url}/${id}`);
  return response.data.data;
}

export async function runRecordAction<T>(
  url: string,
  id: string,
  actionKey: string,
  payload: Record<string, unknown>,
): Promise<MutationResult<T>> {
  const response = await http.post<ApiResponse<MutationResult<T>>>(`${url}/${id}/actions/${actionKey}`, payload);
  return response.data.data;
}
