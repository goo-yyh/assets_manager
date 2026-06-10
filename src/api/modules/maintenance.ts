import { http } from '@/api/http';
import type { ApiResponse, PageParams, PageResult } from '@/types/common';
import type { FaultAlert, MaintenanceRecord, MomRuntimeRecord, OeePoint, RepairRecord } from '@/types/maintenance';

export async function getOeeTrend(): Promise<OeePoint[]> {
  const response = await http.get<ApiResponse<OeePoint[]>>('/maintenance/oee');
  return response.data.data;
}

export async function getRuntimePage(params: PageParams): Promise<PageResult<MomRuntimeRecord>> {
  const response = await http.get<ApiResponse<PageResult<MomRuntimeRecord>>>('/maintenance/runtime', {
    params,
  });
  return response.data.data;
}

export async function getRepairPage(params: PageParams): Promise<PageResult<RepairRecord>> {
  const response = await http.get<ApiResponse<PageResult<RepairRecord>>>('/maintenance/repairs', {
    params,
  });
  return response.data.data;
}

export async function getMaintenancePage(params: PageParams): Promise<PageResult<MaintenanceRecord>> {
  const response = await http.get<ApiResponse<PageResult<MaintenanceRecord>>>('/maintenance/records', {
    params,
  });
  return response.data.data;
}

export async function getFaultAlertPage(params: PageParams): Promise<PageResult<FaultAlert>> {
  const response = await http.get<ApiResponse<PageResult<FaultAlert>>>('/maintenance/alerts', {
    params,
  });
  return response.data.data;
}
