import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, PageResult } from '@/types/common';
import {
  analyticsPages,
  dashboardData,
  loginAccounts,
  oeeTrend,
  users,
} from '@/mock';
import {
  createResource,
  deleteResource,
  hasResource,
  readResource,
  runResourceAction,
  updateResource,
} from '@/mock/store';
import type { AppUser } from '@/types/system';

type QueryValue = string | number | boolean | string[] | undefined;
type QueryParams = Record<string, QueryValue>;
type MockRecord = Record<string, unknown>;

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

function findUserByUsername(username: string): AppUser {
  const storeUser = readResource('/system/users').find((item) => item.username === username);
  if (storeUser) return storeUser as unknown as AppUser;
  const user = users.find((item) => item.username === username);
  return user ?? users[0];
}

function splitResourceAndId(path: string): { resourcePath: string; id: string } | undefined {
  const parts = path.split('/').filter(Boolean);
  if (parts.length < 3) return undefined;
  const id = parts.at(-1);
  const resourcePath = `/${parts.slice(0, -1).join('/')}`;
  return id ? { resourcePath, id } : undefined;
}

function splitActionPath(path: string): { resourcePath: string; id: string; actionKey: string } | undefined {
  const [beforeAction, actionKey] = path.split('/actions/');
  if (!beforeAction || !actionKey) return undefined;
  const resource = splitResourceAndId(beforeAction);
  return resource ? { ...resource, actionKey } : undefined;
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await sleep(220);
  const path = getPath(config.url);
  const params = normalizeParams(config);
  const method = config.method?.toUpperCase() ?? 'GET';

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

  if (path === '/maintenance/oee') {
    return ok(config, oeeTrend);
  }

  if (method === 'GET' && hasResource(path)) {
    const source = readResource(path);
    const filtered = filterByExactFields(filterByKeyword(filterByScope(source, params), params.keyword), params);
    return ok(config, paginate(filtered, params));
  }

  if (method === 'GET' && path.startsWith('/analytics/')) {
    const pageKey = path.split('/').at(-1) ?? 'assets';
    return ok(config, analyticsPages[pageKey] ?? analyticsPages.assets);
  }

  if (method === 'POST') {
    const actionInfo = splitActionPath(path);
    if (actionInfo) {
      return ok(config, runResourceAction(actionInfo.resourcePath, actionInfo.id, actionInfo.actionKey, parseData(config.data)));
    }
    return ok(config, createResource(path, parseData(config.data)));
  }

  if (method === 'PATCH') {
    const resource = splitResourceAndId(path);
    if (resource) return ok(config, updateResource(resource.resourcePath, resource.id, parseData(config.data)));
  }

  if (method === 'DELETE') {
    const resource = splitResourceAndId(path);
    if (resource) return ok(config, deleteResource(resource.resourcePath, resource.id));
  }

  return ok(config, {});
};
