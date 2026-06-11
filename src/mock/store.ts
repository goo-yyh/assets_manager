import {
  assetDisposalRecords,
  assetIntakeRecords,
  assetInventoryPlans,
  assetTransferRecords,
  assets,
} from './assets';
import { attachmentRows, equipmentFiles } from './equipmentFiles';
import { factories, organizationTree } from './factories';
import { fieldMappings, integrationStatuses, syncRecords } from './integrations';
import { operationLogs } from './logs';
import {
  faultAlerts,
  maintenanceRecords,
  momRuntimeRecords,
  repairRecords,
} from './maintenance';
import {
  spareAlerts,
  spareInboundRecords,
  spareInventoryPlans,
  spareOutboundRecords,
  spareParts,
} from './spares';
import { roleRows, users } from './users';
import { roleDefinitions } from '@/config/permissions';
import type { OrgNode } from '@/types/system';

export type MockRecord = Record<string, unknown> & { id: string };

export type MutationResult = {
  record?: MockRecord;
  affected: Array<{ resource: string; id: string }>;
  message: string;
};

type StoreData = Record<string, MockRecord[]>;

const storageKey = 'assets-manager-store-v9';

const aliasMap: Record<string, string> = {
  '/assets/import': '/assets/intake',
  '/assets/map': '/assets/list',
  '/assets/usage': '/assets/list',
  '/assets/history': '/system/logs',
  '/equipment/params': '/equipment/files',
  '/spares/stock': '/spares/catalog',
  '/spares/applicable-assets': '/spares/catalog',
  '/spares/consumption': '/spares/outbound',
  '/integrations/sync-records': '/integrations/sync',
  '/integrations/fields': '/integrations/fields',
};

const factoryByName = new Map(factories.map((factory) => [factory.name, factory]));
const factoryById = new Map(factories.map((factory) => [factory.id, factory]));
const initialRoleRows = roleRows.map((role) => {
  const definition = roleDefinitions.find((item) => item.key === role.roleKey);
  return { ...role, permissions: definition?.permissions ?? [], factoryIds: definition?.factoryIds ?? [] };
});

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toRecords<T extends Record<string, unknown> & { id: string }>(list: T[]): MockRecord[] {
  return clone(list);
}

function flattenOrgs(nodes: OrgNode[]): MockRecord[] {
  return nodes.flatMap((node) => [
    node as unknown as MockRecord,
    ...flattenOrgs(node.children ?? []),
  ]);
}

function nowText(): string {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function readNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return undefined;
}

function safeText(value: unknown, fallback = ''): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

function getFactoryInfo(record: Record<string, unknown>) {
  const factoryId = readString(record, 'factoryId');
  const factoryName = readString(record, 'factoryName');
  const byId = factoryId ? factoryById.get(factoryId) : undefined;
  const byName = factoryName ? factoryByName.get(factoryName) : undefined;
  return byId ?? byName ?? factories[0];
}

function buildInitialData(): StoreData {
  const equipmentChanges = equipmentFiles.flatMap((file) =>
    file.changeRecords.map((change) => ({
      ...change,
      assetCode: file.assetCode,
      equipmentName: file.equipmentName,
      factoryId: file.factoryId,
      factoryName: file.factoryName,
    })),
  );
  const parameterRows = equipmentFiles.map((file) => ({
    ...file,
    technicalParamsText: Object.entries(file.technicalParams)
      .map(([key, value]) => `${key}: ${value}`)
      .join('；'),
  }));
  const warningRows = [
    ...spareAlerts.map((item) => ({ ...item, warningType: '备件预警', targetName: item.spareName })),
    ...faultAlerts.map((item) => ({ ...item, warningType: '故障告警', targetName: item.equipmentName })),
  ];

  return {
    '/assets/list': toRecords(assets),
    '/assets/intake': toRecords(assetIntakeRecords),
    '/assets/transfer': toRecords(assetTransferRecords),
    '/assets/disposal': toRecords(assetDisposalRecords),
    '/assets/inventory': toRecords(assetInventoryPlans),
    '/equipment/files': toRecords(equipmentFiles),
    '/equipment/attachments': toRecords(attachmentRows),
    '/equipment/params': toRecords(parameterRows),
    '/equipment/changes': toRecords(equipmentChanges),
    '/equipment/acceptance': toRecords(attachmentRows.filter((item) => item.type === 'acceptance')),
    '/equipment/contracts': toRecords(attachmentRows.filter((item) => ['contract', 'certificate'].includes(item.type))),
    '/equipment/images': toRecords(attachmentRows.filter((item) => item.type === 'image')),
    '/spares/catalog': toRecords(spareParts),
    '/spares/inbound': toRecords(spareInboundRecords),
    '/spares/outbound': toRecords(spareOutboundRecords),
    '/spares/returns': toRecords(spareInboundRecords.filter((item) => item.inboundType === 'return')),
    '/spares/inventory': toRecords(spareInventoryPlans),
    '/spares/alerts': toRecords(spareAlerts),
    '/maintenance/runtime': toRecords(momRuntimeRecords),
    '/maintenance/repairs': toRecords(repairRecords),
    '/maintenance/records': toRecords(maintenanceRecords),
    '/maintenance/alerts': toRecords(faultAlerts),
    '/analytics/warnings': toRecords(warningRows),
    '/integrations/mom': toRecords(integrationStatuses.filter((item) => item.system === 'mom')),
    '/integrations/finance': toRecords(integrationStatuses.filter((item) => item.system === 'finance')),
    '/integrations/project': toRecords(integrationStatuses.filter((item) => item.system === 'project')),
    '/integrations/sync': toRecords(syncRecords),
    '/integrations/fields': toRecords(fieldMappings),
    '/system/orgs': flattenOrgs(organizationTree),
    '/system/users': toRecords(users),
    '/system/roles': toRecords(initialRoleRows),
    '/system/logs': toRecords(operationLogs),
  };
}

function isStoreData(value: unknown): value is StoreData {
  return typeof value === 'object' && value !== null;
}

function loadStore(): StoreData {
  if (typeof window === 'undefined') return buildInitialData();
  const raw = window.localStorage.getItem(storageKey);
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isStoreData(parsed)) return parsed;
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }
  const initial = buildInitialData();
  window.localStorage.setItem(storageKey, JSON.stringify(initial));
  return initial;
}

function saveStore(data: StoreData) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }
}

function canonicalResource(path: string): string {
  return aliasMap[path] ?? path;
}

function listOf(data: StoreData, path: string): MockRecord[] {
  return data[canonicalResource(path)] ?? [];
}

function setList(data: StoreData, path: string, list: MockRecord[]) {
  data[canonicalResource(path)] = list;
}

function idPrefix(path: string): string {
  const last = canonicalResource(path).split('/').filter(Boolean).at(-1) ?? 'row';
  return `${last}-${Date.now()}`;
}

function appendLog(data: StoreData, action: string, target: string, factoryId?: string) {
  const log: MockRecord = {
    id: `log-${Date.now()}`,
    operator: '系统管理员',
    module: '业务操作',
    action,
    target,
    result: 'success',
    ip: '127.0.0.1',
    createdAt: nowText(),
    factoryId: factoryId ?? 'fac-nb',
  };
  data['/system/logs'] = [log, ...(data['/system/logs'] ?? [])];
}

function recalcSpareStatus(record: MockRecord): MockRecord {
  const stockQty = readNumber(record, 'stockQty') ?? 0;
  const safetyStock = readNumber(record, 'safetyStock') ?? 0;
  const minStock = readNumber(record, 'minStock') ?? 0;
  const nextStatus =
    stockQty < minStock ? 'low_stock' : stockQty > safetyStock * 2 ? 'over_stock' : 'normal';
  return { ...record, stockQty, safetyStock, minStock, status: nextStatus };
}

function updateSpareStock(data: StoreData, spareCode: string | undefined, delta: number) {
  if (!spareCode) return;
  const list = listOf(data, '/spares/catalog').map((item) => {
    if (item.spareCode !== spareCode) return item;
    return recalcSpareStatus({ ...item, stockQty: (readNumber(item, 'stockQty') ?? 0) + delta });
  });
  setList(data, '/spares/catalog', list);
}

function buildRecord(path: string, payload: Record<string, unknown>): MockRecord {
  const resource = canonicalResource(path);
  const factory = getFactoryInfo(payload);
  const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
  const base: MockRecord = {
    ...cleanPayload,
    id: `${idPrefix(resource)}-${Math.floor(Math.random() * 1000)}`,
    createdAt: nowText(),
    factoryId: factory.id,
    factoryName: factory.name,
  };

  if (resource === '/assets/list') {
    return {
      ...base,
      assetCode: readString(base, 'assetCode') ?? `AST-ZJ-${Date.now()}`,
      name: readString(base, 'name') ?? readString(base, 'assetName') ?? '新增汽配设备',
      category: readString(base, 'category') ?? '生产设备',
      status: readString(base, 'status') ?? 'in_use',
      originalValue: readNumber(base, 'originalValue') ?? 1200000,
      accumulatedDepreciation: readNumber(base, 'accumulatedDepreciation') ?? 0,
      netValue: readNumber(base, 'netValue') ?? readNumber(base, 'originalValue') ?? 1200000,
      responsiblePerson: readString(base, 'responsiblePerson') ?? '张敏',
    };
  }
  if (resource === '/spares/catalog') {
    return recalcSpareStatus({
      ...base,
      spareCode: readString(base, 'spareCode') ?? `SP-ZJ-${Date.now()}`,
      name: readString(base, 'name') ?? readString(base, 'spareName') ?? '新增汽配备件',
      stockQty: readNumber(base, 'stockQty') ?? 0,
      safetyStock: readNumber(base, 'safetyStock') ?? 10,
      minStock: readNumber(base, 'minStock') ?? 5,
    });
  }
  if (['/assets/transfer', '/assets/disposal', '/spares/inbound', '/spares/outbound'].includes(resource)) {
    return { ...base, status: readString(base, 'status') ?? 'pending' };
  }
  if (resource === '/assets/intake') return { ...base, status: readString(base, 'status') ?? 'pending' };
  if (resource === '/assets/inventory') return { ...base, status: readString(base, 'status') ?? 'planned' };
  if (resource === '/spares/inventory') return { ...base, status: readString(base, 'status') ?? 'pending' };
  return base;
}

function findRecord(data: StoreData, resource: string, id: string): MockRecord | undefined {
  return listOf(data, resource).find((item) => item.id === id);
}

function pushRecord(data: StoreData, path: string, record: MockRecord) {
  setList(data, path, [record, ...listOf(data, path)]);
}

function updateRecord(data: StoreData, path: string, id: string, patch: Record<string, unknown>): MockRecord | undefined {
  let updated: MockRecord | undefined;
  const next = listOf(data, path).map((item) => {
    if (item.id !== id) return item;
    const merged = { ...item, ...patch };
    updated = canonicalResource(path) === '/spares/catalog' ? recalcSpareStatus(merged) : merged;
    return updated;
  });
  setList(data, path, next);
  return updated;
}

function normalizeRolePatch(record: MockRecord, payload: Record<string, unknown>): Record<string, unknown> {
  const rawPermissions = payload.permissions;
  if (!Array.isArray(rawPermissions)) return payload;
  const permissions = rawPermissions.filter((item): item is string => typeof item === 'string');
  const definition = roleDefinitions.find((item) => item.key === record.roleKey);
  return {
    ...payload,
    permissions,
    roleName: record.roleName ?? definition?.name,
    dataScope: payload.dataScope ?? record.dataScope ?? (definition?.dataScope === 'group' ? '集团全部' : '所属厂区'),
    menuCount: permissions.filter((permission) => !permission.includes(':edit')).length,
    buttonCount: permissions.filter((permission) => permission.includes(':edit') || permission.includes(':approve')).length,
  };
}

function syncUsersByRole(data: StoreData, role: MockRecord) {
  const roleKey = readString(role, 'roleKey') ?? role.id;
  const permissions = Array.isArray(role.permissions)
    ? role.permissions.filter((item): item is string => typeof item === 'string')
    : undefined;
  if (!permissions) return;
  setList(data, '/system/users', listOf(data, '/system/users').map((user) => {
    if (user.roleKey !== roleKey) return user;
    return { ...user, permissions };
  }));
}

function createTransfer(data: StoreData, asset: MockRecord) {
  const toFactory = factories.find((factory) => factory.name !== asset.factoryName) ?? factories[0];
  const transfer: MockRecord = {
    id: `transfer-${Date.now()}`,
    bizCode: `DB-2026-${Date.now().toString().slice(-4)}`,
    assetCode: asset.assetCode,
    assetName: asset.name,
    fromFactory: asset.factoryName,
    toFactory: toFactory.name,
    applicant: asset.responsiblePerson ?? '张敏',
    approver: '厂区负责人',
    financeSyncStatus: 'waiting',
    status: 'pending',
    createdAt: nowText(),
    factoryId: asset.factoryId ?? toFactory.id,
  };
  pushRecord(data, '/assets/transfer', transfer);
  updateRecord(data, '/assets/list', asset.id, { status: 'transferring' });
}

function createDisposal(data: StoreData, asset: MockRecord) {
  pushRecord(data, '/assets/disposal', {
    id: `disposal-${Date.now()}`,
    bizCode: `CZ-2026-${Date.now().toString().slice(-4)}`,
    assetCode: asset.assetCode,
    assetName: asset.name,
    disposalType: 'scrap',
    reason: '资产台账发起处置',
    evaluationAmount: readNumber(asset, 'netValue') ?? 0,
    financeWriteOffStatus: 'pending',
    status: 'pending',
    createdAt: nowText(),
    factoryId: asset.factoryId,
  });
}

function bookIntake(data: StoreData, intake: MockRecord) {
  updateRecord(data, '/assets/intake', intake.id, { status: 'booked' });
  const asset = buildRecord('/assets/list', {
    name: intake.assetName,
    assetName: intake.assetName,
    financeAssetCode: intake.financeAssetCode,
    factoryId: intake.factoryId,
    factoryName: getFactoryInfo(intake).name,
    responsiblePerson: intake.applicant,
  });
  pushRecord(data, '/assets/list', asset);
  pushRecord(data, '/equipment/files', {
    id: `eq-${Date.now()}`,
    assetId: asset.id,
    assetCode: asset.assetCode,
    equipmentName: asset.name,
    model: 'ZX-1000',
    manufacturer: '汽配设备供应商',
    factoryId: asset.factoryId,
    factoryName: asset.factoryName,
    technicalParams: {},
    completionRate: 40,
    latestChangedAt: nowText(),
  });
}

function completeTransfer(data: StoreData, transfer: MockRecord) {
  updateRecord(data, '/assets/transfer', transfer.id, { status: 'completed', financeSyncStatus: 'synced' });
  const toFactory = factoryByName.get(String(transfer.toFactory)) ?? factories[0];
  const asset = listOf(data, '/assets/list').find((item) => item.assetCode === transfer.assetCode);
  if (asset) {
    updateRecord(data, '/assets/list', asset.id, { factoryId: toFactory.id, factoryName: toFactory.name, status: 'in_use' });
    const file = listOf(data, '/equipment/files').find((item) => item.assetCode === transfer.assetCode);
    if (file) updateRecord(data, '/equipment/files', file.id, { factoryId: toFactory.id, factoryName: toFactory.name });
  }
}

function completeDisposal(data: StoreData, disposal: MockRecord) {
  updateRecord(data, '/assets/disposal', disposal.id, { status: 'completed', financeWriteOffStatus: 'done' });
  const asset = listOf(data, '/assets/list').find((item) => item.assetCode === disposal.assetCode);
  if (asset) updateRecord(data, '/assets/list', asset.id, { status: 'disposed' });
}

function syncIntegration(data: StoreData, resource: string, record: MockRecord) {
  const system = safeText(record.system, canonicalResource(resource).split('/').at(-1) ?? 'mom');
  updateRecord(data, resource, record.id, { state: 'online', lastSyncAt: nowText(), successRate: 99.6 });
  pushRecord(data, '/integrations/sync', {
    id: `sync-${Date.now()}`,
    system,
    bizCode: `${system.toUpperCase()}-${Date.now()}`,
    bizType: system === 'project' ? '项目验收转固' : '接口同步',
    direction: system === 'finance' ? 'outbound' : 'inbound',
    status: 'success',
    summary: `${safeText(record.systemName, '外部系统')}已完成一次业务同步。`,
    createdAt: nowText(),
    factoryId: 'fac-nb',
  });
  if (system === 'project') {
    pushRecord(data, '/assets/intake', buildRecord('/assets/intake', {
      billCode: `ZG-${Date.now().toString().slice(-6)}`,
      assetName: '项目验收导入自动化检测工位',
      sourceSystem: 'project',
      projectName: '项目管理系统验收导入',
      financeAssetCode: `FA-ZJ-${Date.now().toString().slice(-5)}`,
      status: 'pending',
      factoryId: 'fac-nb',
      applicant: '项目管理系统',
    }));
  }
}

export function hasResource(path: string): boolean {
  const data = loadStore();
  return Boolean(data[canonicalResource(path)]);
}

export function readResource(path: string): MockRecord[] {
  return clone(listOf(loadStore(), path));
}

export function resetMockStore() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(storageKey);
  }
}

export function createResource(path: string, payload: Record<string, unknown>): MutationResult {
  const data = loadStore();
  const record = buildRecord(path, payload);
  pushRecord(data, path, record);
  appendLog(data, '新增', safeText(record.name, safeText(record.assetName, safeText(record.bizCode, record.id))), readString(record, 'factoryId'));
  saveStore(data);
  return { record: clone(record), affected: [{ resource: canonicalResource(path), id: record.id }], message: '新增记录已写入表格' };
}

export function updateResource(path: string, id: string, payload: Record<string, unknown>): MutationResult {
  const data = loadStore();
  const resource = canonicalResource(path);
  const current = findRecord(data, resource, id);
  const patch = resource === '/system/roles' && current ? normalizeRolePatch(current, payload) : payload;
  const record = updateRecord(data, path, id, patch);
  if (resource === '/system/roles' && record) syncUsersByRole(data, record);
  appendLog(data, '编辑', id, readString(record ?? {}, 'factoryId'));
  saveStore(data);
  return { record: record ? clone(record) : undefined, affected: [{ resource, id }], message: '记录已更新' };
}

export function deleteResource(path: string, id: string): MutationResult {
  const data = loadStore();
  const resource = canonicalResource(path);
  setList(data, resource, listOf(data, resource).filter((item) => item.id !== id));
  appendLog(data, '删除', id);
  saveStore(data);
  return { affected: [{ resource, id }], message: '记录已从表格删除' };
}

export function runResourceAction(path: string, id: string, actionKey: string, payload: Record<string, unknown>): MutationResult {
  const data = loadStore();
  const resource = canonicalResource(path);
  const record = findRecord(data, resource, id);
  if (!record) return { affected: [], message: '未找到记录' };

  if (resource === '/assets/list' && actionKey === 'transfer') createTransfer(data, record);
  else if (resource === '/assets/list' && actionKey === 'disposal') createDisposal(data, record);
  else if (resource === '/assets/intake' && actionKey === 'book') bookIntake(data, record);
  else if (resource === '/assets/transfer' && actionKey === 'approve') completeTransfer(data, record);
  else if (resource === '/assets/disposal' && actionKey === 'approve') completeDisposal(data, record);
  else if (resource === '/assets/inventory' && actionKey === 'scan') {
    const expectedQty = readNumber(record, 'expectedQty') ?? 0;
    updateRecord(data, resource, id, { checkedQty: Math.max(expectedQty - 1, 0), diffQty: expectedQty > 0 ? -1 : 0, status: 'difference' });
  } else if (resource === '/assets/inventory' && actionKey === 'diff') updateRecord(data, resource, id, { diffQty: 0, status: 'completed' });
  else if (resource === '/spares/catalog' && actionKey === 'adjust') updateRecord(data, resource, id, payload);
  else if (resource === '/spares/inbound' && actionKey === 'approve') {
    updateRecord(data, resource, id, { status: 'completed' });
    updateSpareStock(data, readString(record, 'spareCode'), readNumber(record, 'quantity') ?? 0);
  } else if (resource === '/spares/outbound' && actionKey === 'approve') {
    updateRecord(data, resource, id, { status: 'completed' });
    updateSpareStock(data, readString(record, 'spareCode'), -(readNumber(record, 'quantity') ?? 0));
  } else if (resource === '/spares/outbound' && actionKey === 'return') {
    const quantity = readNumber(record, 'quantity') ?? 1;
    pushRecord(data, '/spares/returns', buildRecord('/spares/returns', { ...record, id: undefined, inboundType: 'return', quantity, sourceBill: record.billCode, status: 'completed' }));
    updateSpareStock(data, readString(record, 'spareCode'), quantity);
  } else if (resource === '/spares/inventory' && actionKey === 'diff') updateRecord(data, resource, id, { diffQty: 0, status: 'completed' });
  else if (resource === '/spares/alerts' && actionKey === 'replenish') {
    pushRecord(data, '/spares/inbound', buildRecord('/spares/inbound', {
      inboundType: 'purchase',
      spareCode: record.spareCode,
      spareName: record.spareName,
      quantity: Math.max((readNumber(record, 'safetyStock') ?? 0) - (readNumber(record, 'currentQty') ?? 0), 1),
      sourceBill: '补货建议',
      status: 'pending',
      factoryId: record.factoryId,
      factoryName: record.factoryName,
    }));
  } else if (resource.startsWith('/integrations/')) syncIntegration(data, resource, record);
  else updateRecord(data, resource, id, payload);

  appendLog(data, `执行${actionKey}`, safeText(record.bizCode, safeText(record.assetCode, safeText(record.spareCode, id))), readString(record, 'factoryId'));
  saveStore(data);
  return { record: clone(record), affected: [{ resource, id }], message: '业务操作已同步到相关表格' };
}
