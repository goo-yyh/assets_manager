import type { FaultAlert, MaintenanceRecord, MomRuntimeRecord, OeePoint, RepairRecord } from '@/types/maintenance';

export const momRuntimeRecords: MomRuntimeRecord[] = [
  {
    id: 'rt-001',
    assetCode: 'AST-NB-DC-0001',
    equipmentName: '2800T 铝合金压铸机',
    factoryId: 'fac-nb',
    factoryName: '浙江宁波压铸工厂',
    lineName: '电机壳体压铸线',
    state: 'running',
    oee: 86.4,
    updatedAt: '2026-06-10 09:22',
  },
  {
    id: 'rt-002',
    assetCode: 'AST-SZ-ST-0008',
    equipmentName: '高速冲压生产线',
    factoryId: 'fac-sz',
    factoryName: '浙江台州冲压工厂',
    lineName: '底盘结构件冲压线',
    state: 'fault',
    oee: 42.8,
    updatedAt: '2026-06-10 09:19',
  },
  {
    id: 'rt-003',
    assetCode: 'AST-AH-BT-0012',
    equipmentName: '电池托盘激光焊接工作站',
    factoryId: 'fac-ah',
    factoryName: '浙江湖州新能源零部件工厂',
    lineName: '电池托盘激光焊接线',
    state: 'running',
    oee: 89.8,
    updatedAt: '2026-06-10 09:21',
  },
  {
    id: 'rt-004',
    assetCode: 'AST-CQ-AS-0021',
    equipmentName: '底盘结构件机器人焊接线',
    factoryId: 'fac-cq',
    factoryName: '浙江嘉兴总装配套厂',
    lineName: '机器人焊接线',
    state: 'stopped',
    oee: 68.6,
    updatedAt: '2026-06-10 09:15',
  },
];

export const oeeTrend: OeePoint[] = [
  { month: '1月', oee: 78, faultRate: 4.8, downtimeHours: 66 },
  { month: '2月', oee: 81, faultRate: 4.1, downtimeHours: 58 },
  { month: '3月', oee: 83, faultRate: 3.7, downtimeHours: 49 },
  { month: '4月', oee: 80, faultRate: 4.3, downtimeHours: 63 },
  { month: '5月', oee: 85, faultRate: 3.2, downtimeHours: 42 },
  { month: '6月', oee: 86, faultRate: 2.9, downtimeHours: 36 },
];

export const repairRecords: RepairRecord[] = [
  {
    id: 'repair-001',
    workOrder: 'WX-2026-0608',
    assetCode: 'AST-SZ-ST-0008',
    equipmentName: '高速冲压生产线',
    faultReason: '主传动轴承温升异常',
    solution: '更换高速轴承 6208 并重新校准润滑间隙',
    cost: 18600,
    repairedBy: '陈工',
    closedAt: '2026-06-09 18:30',
    factoryId: 'fac-sz',
  },
  {
    id: 'repair-002',
    workOrder: 'WX-2026-0602',
    assetCode: 'AST-CQ-AS-0021',
    equipmentName: '底盘结构件机器人焊接线',
    faultReason: '第 6 轴减速机异响',
    solution: '更换减速机润滑脂，调整焊接路径参数',
    cost: 9200,
    repairedBy: '陈工',
    closedAt: '2026-06-03 14:20',
    factoryId: 'fac-cq',
  },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    workOrder: 'BY-2026-0528',
    assetCode: 'AST-NB-DC-0001',
    equipmentName: '2800T 铝合金压铸机',
    content: '季度液压站保养、滤芯更换、压射单元点检',
    replacedSpares: '液压滤芯 10μm x 12',
    maintainedBy: '张敏',
    maintainedAt: '2026-05-30 16:18',
    factoryId: 'fac-nb',
  },
  {
    id: 'maint-002',
    workOrder: 'BY-2026-0607',
    assetCode: 'AST-AH-BT-0012',
    equipmentName: '电池托盘激光焊接工作站',
    content: '激光光路清洁、保护镜片更换、冷水机点检',
    replacedSpares: '激光保护镜片 x 8',
    maintainedBy: '王磊',
    maintainedAt: '2026-06-07 11:40',
    factoryId: 'fac-ah',
  },
];

export const faultAlerts: FaultAlert[] = [
  {
    id: 'fault-001',
    assetCode: 'AST-SZ-ST-0008',
    equipmentName: '高速冲压生产线',
    level: 'critical',
    message: '主电机振动值超过阈值，MOM 已触发停机保护。',
    factoryId: 'fac-sz',
    factoryName: '浙江台州冲压工厂',
    createdAt: '2026-06-10 08:58',
  },
  {
    id: 'fault-002',
    assetCode: 'AST-AH-BT-0012',
    equipmentName: '电池托盘激光焊接工作站',
    level: 'warning',
    message: '保护镜片寿命低于 15%，建议排产间隙更换。',
    factoryId: 'fac-ah',
    factoryName: '浙江湖州新能源零部件工厂',
    createdAt: '2026-06-10 08:36',
  },
];
