import { http } from '@/api/http';
import type { ApiResponse } from '@/types/common';
import type { AppUser } from '@/types/system';

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResult = {
  token: string;
  user: AppUser;
};

type LoginApiResponse = ApiResponse<LoginResult> | { code: 1; message: string; data: null };

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await http.post<LoginApiResponse>('/auth/login', payload);
  if (response.data.code !== 0) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}
