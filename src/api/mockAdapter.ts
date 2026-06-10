import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, PageResult } from '@/types/common';
import {
  assetDisposalRecords,
  assetIntakeRecords,
  assetInventoryPlans,
  assetTransferRecords,
  assets,
  attachmentRows,
  analyticsPages,
  dashboardData,
  equipmentFiles,
  faultAlerts,
  fieldMappings,
  integrationStatuses,
  loginAccounts,
  maintenanceRecords,
  momRuntimeRecords,
  oeeTrend,
  operationLogs,
  organizationTree,
  repairRecords,
  roleRows,
  spareAlerts,
  spareInboundRecords,
  spareInventoryPlans,
  spareOutboundRecords,
  spareParts,
  syncRecords,
  users,
} from '@/mock';
import type { AppUser, OrgNode } from '@/types/system';
import type { ActionResult } from './types';

type QueryValue = string | number | boolean | string[] | undefined;
type QueryParams = Record<string, QueryValue>;
type MockRecord = Record<string, unknown>;

const listRegistry: Record<string, MockRecord[]> = {
  '/assets/list': assets,
  '/assets/intake': assetIntakeRecords,
  '/assets/transfer': assetTransferRecords,
  '/assets/disposal': assetDisposalRecords,
  '/assets/inventory': assetInventoryPlans,
  '/equipment/files': equipmentFiles,
  '/equipment/attachments': attachmentRows,
  '/spares/catalog': spareParts,
  '/spares/stock': spareParts,
  '/spares/inbound': spareInboundRecords,
  '/spares/outbound': spareOutboundRecords,
  '/spares/inventory': spareInventoryPlans,
  '/spares/alerts': spareAlerts,
  '/maintenance/runtime': momRuntimeRecords,
  '/maintenance/repairs': repairRecords,
  '/maintenance/records': maintenanceRecords,
  '/maintenance/alerts': faultAlerts,
  '/integrations/mom': integrationStatuses.filter((item) => item.system === 'mom'),
  '/integrations/finance': integrationStatuses.filter((item) => item.system === 'finance'),
  '/integrations/project': integrationStatuses.filter((item) => item.system === 'project'),
  '/integrations/sync': syncRecords,
  '/integrations/fields': fieldMappings,
  '/system/users': users,
  '/system/roles': roleRows,
  '/system/logs': operationLogs,
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

function parseData(data: unknown): MockRecord {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      const parsed: unknown = JSON.parse(data);
      return typeof parsed === 'object' && parsed !== null ? (parsed as MockRecord) : {};
    } catch {
      return {};
    }
  }
  return typeof data === 'object' ? (data as MockRecord) : {};
}

function toQueryParams(record: MockRecord): QueryParams {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => {
      if (Array.isArray(value)) return value.every((item) => typeof item === 'string');
      return ['string', 'number', 'boolean', 'undefined'].includes(typeof value);
    }),
  ) as QueryParams;
}

function normalizeParams(config: InternalAxiosRequestConfig): QueryParams {
  const params = (config.params ?? {}) as QueryParams;
  return { ...params, ...toQueryParams(parseData(config.data)) };
}

function getPath(url?: string): string {
  if (!url) return '/';
  const parsed = new URL(url, window.location.origin);
  return parsed.pathname.replace(/^\/mock/, '');
}

function ok<T>(config: InternalAxiosRequestConfig, data: T): AxiosResponse<ApiResponse<T>> {
  return {
    data: { code: 0, message: 'success', data },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
}

function fail(config: InternalAxiosRequestConfig, message: string): AxiosResponse<{ code: 1; message: string; data: null }> {
  return {
    data: { code: 1, message, data: null },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
}

function readString(record: MockRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function normalizeFactoryIds(value: QueryValue): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').filter(Boolean);
  return [];
}

function filterByScope(list: MockRecord[], params: QueryParams): MockRecord[] {
  const factoryIds = normalizeFactoryIds(params.factoryIds);
  if (factoryIds.length === 0) return list;

  // 关键数据权限：带 factoryId 的业务数据按当前用户授权厂区过滤；集团角色传入全部厂区。
  return list.filter((item) => {
    const factoryId = readString(item, 'factoryId');
    return !factoryId || factoryIds.includes(factoryId);
  });
}

function filterByKeyword(list: MockRecord[], keyword?: QueryValue): MockRecord[] {
  if (typeof keyword !== 'string' || keyword.trim() === '') return list;
  const normalized = keyword.trim().toLowerCase();
  return list.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(normalized)),
  );
}

function filterByExactFields(list: MockRecord[], params: QueryParams): MockRecord[] {
  return list.filter((item) => {
    const statusValue = params.status;
    const factoryValue = params.factoryId;
    const systemValue = params.system;
    const statusMatched =
      typeof statusValue !== 'string' ||
      [item.status, item.state, item.alertType].some((value) => value === statusValue);
    const factoryMatched = typeof factoryValue !== 'string' || item.factoryId === factoryValue;
    const systemMatched = typeof systemValue !== 'string' || item.system === systemValue;
    return statusMatched && factoryMatched && systemMatched;
  });
}

function paginate<T>(list: T[], params: QueryParams): PageResult<T> {
  const pageNum = Number(params.pageNum ?? 1);
  const pageSize = Number(params.pageSize ?? 10);
  const start = (pageNum - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    pageNum,
    pageSize,
  };
}

function flattenOrgs(nodes: OrgNode[]): MockRecord[] {
  return nodes.flatMap((node) => [
    node as unknown as MockRecord,
    ...flattenOrgs(node.children ?? []),
  ]);
}

function findUserByUsername(username: string): AppUser {
  const user = users.find((item) => item.username === username);
  return user ?? users[0];
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await sleep(220);
  const path = getPath(config.url);
  const params = normalizeParams(config);

  if (path === '/auth/login') {
    const username = typeof params.username === 'string' ? params.username : '';
    const password = typeof params.password === 'string' ? params.password : '';
    const account = loginAccounts.find((item) => item.username === username && item.password === password);
    if (!account) {
      return fail(config, '账号或密码不正确，请使用 README 中的演示账号。');
    }
    const user = findUserByUsername(account.username);
    return ok(config, { token: `mock-token-${user.roleKey}`, user });
  }

  if (path === '/dashboard') {
    const filteredTodos = filterByScope(dashboardData.todos, params);
    const filteredAlerts = filterByScope(dashboardData.lowStockAlerts, params);
    return ok(config, {
      ...dashboardData,
      todos: filteredTodos,
      lowStockAlerts: filteredAlerts,
    });
  }

  if (path.startsWith('/analytics/')) {
    const pageKey = path.split('/').at(-1) ?? 'assets';
    return ok(config, analyticsPages[pageKey] ?? analyticsPages.assets);
  }

  if (path === '/maintenance/oee') {
    return ok(config, oeeTrend);
  }

  if (path === '/system/orgs') {
    return ok(config, paginate(flattenOrgs(organizationTree), params));
  }

  const source = listRegistry[path];
  if (source) {
    const filtered = filterByExactFields(filterByKeyword(filterByScope(source, params), params.keyword), params);
    return ok(config, paginate(filtered, params));
  }

  if (config.method?.toUpperCase() !== 'GET') {
    // 演示类写操作只返回成功，真实项目应由后端完成状态流转和并发校验。
    const result: ActionResult = {
      id: `${Date.now()}`,
      status: 'success',
      message: '操作已模拟提交',
    };
    return ok(config, result);
  }

  return ok(config, {});
};
