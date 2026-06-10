import type { FieldMapping, IntegrationStatus, SyncRecord } from '@/types/integration';

export const integrationStatuses: IntegrationStatus[] = [
  {
    id: 'it-001',
    system: 'mom',
    systemName: 'MOM 制造运营系统',
    state: 'online',
    endpoint: '/api/mom/equipment-runtime',
    syncMode: 'MQ',
    lastSyncAt: '2026-06-10 09:25',
    successRate: 99.2,
    owner: '制造信息化组',
  },
  {
    id: 'it-002',
    system: 'finance',
    systemName: '财务固定资产系统',
    state: 'online',
    endpoint: '/api/fa/assets',
    syncMode: 'RESTful API',
    lastSyncAt: '2026-06-10 08:30',
    successRate: 98.4,
    owner: '集团财务中心',
  },
  {
    id: 'it-003',
    system: 'project',
    systemName: '项目管理系统',
    state: 'warning',
    endpoint: '/api/project/acceptance',
    syncMode: 'RESTful API',
    lastSyncAt: '2026-06-09 21:10',
    successRate: 92.1,
    owner: '项目管理办公室',
  },
];

export const syncRecords: SyncRecord[] = [
  {
    id: 'sync-001',
    system: 'mom',
    bizCode: 'MOM-OEE-20260610-0925',
    bizType: 'OEE 数据',
    direction: 'inbound',
    status: 'success',
    summary: '同步 1288 台设备运行状态和 OEE 数据。',
    createdAt: '2026-06-10 09:25',
    factoryId: 'fac-nb',
  },
  {
    id: 'sync-002',
    system: 'finance',
    bizCode: 'FA-WRITEOFF-20260602',
    bizType: '资产处置核销',
    direction: 'outbound',
    status: 'pending',
    summary: '旧款悬架焊接夹具核销结果等待财务确认。',
    createdAt: '2026-06-02 17:02',
    factoryId: 'fac-cq',
  },
  {
    id: 'sync-003',
    system: 'project',
    bizCode: 'PJ-AH-BT2-ACCEPT',
    bizType: '项目验收转固',
    direction: 'inbound',
    status: 'success',
    summary: '接收湖州二期电池托盘产线竣工验收信息。',
    createdAt: '2026-06-03 09:18',
    factoryId: 'fac-ah',
  },
];

export const fieldMappings: FieldMapping[] = [
  { id: 'map-001', system: 'mom', sourceField: 'equipmentCode', targetField: 'assetCode', description: 'MOM 设备编码对应资产编码', required: true },
  { id: 'map-002', system: 'mom', sourceField: 'oee', targetField: 'oee', description: '设备综合效率', required: true },
  { id: 'map-003', system: 'finance', sourceField: 'faCode', targetField: 'financeAssetCode', description: '财务固定资产编号', required: true },
  { id: 'map-004', system: 'finance', sourceField: 'netValue', targetField: 'netValue', description: '资产净值', required: true },
  { id: 'map-005', system: 'project', sourceField: 'acceptanceNo', targetField: 'billCode', description: '项目竣工验收编号', required: false },
];
