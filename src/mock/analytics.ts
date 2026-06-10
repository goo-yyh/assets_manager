import type { AnalyticsPageData, DashboardData } from '@/types/analytics';
import { spareAlerts } from './spares';

export const dashboardData: DashboardData = {
  metrics: [
    { title: '资产总数', value: 1682, unit: '台/套', trend: '+4.2%' },
    { title: '资产总原值', value: 328600000, unit: '元', trend: '+6.8%' },
    { title: '累计折旧', value: 84200000, unit: '元' },
    { title: '资产净值', value: 244400000, unit: '元', trend: '+3.1%' },
    { title: '在线设备数', value: 1288, unit: '台', status: 'normal' },
    { title: '低库存备件', value: 18, unit: '项', status: 'warning' },
  ],
  todos: [
    { id: 'todo-001', title: '五轴 CNC 跨厂调拨审批', module: '资产调拨', owner: '沈华', dueAt: '今天 17:00', factoryId: 'fac-nb' },
    { id: 'todo-002', title: '激光保护镜片采购入库审核', module: '备件入库', owner: '王磊', dueAt: '明天 10:00', factoryId: 'fac-ah' },
    { id: 'todo-003', title: '旧款焊接夹具处置核销确认', module: '资产处置', owner: '赵芳', dueAt: '6月12日', factoryId: 'fac-cq' },
    { id: 'todo-004', title: '浙江宁波二季度资产盘点差异处理', module: '资产盘点', owner: '张敏', dueAt: '6月25日', factoryId: 'fac-nb' },
  ],
  statusDistribution: [
    { name: '在用', value: 1240 },
    { name: '闲置', value: 168 },
    { name: '维修中', value: 74 },
    { name: '调拨中', value: 31 },
    { name: '已报废', value: 169 },
  ],
  factoryValue: [
    { name: '浙江宁波压铸工厂', value: 8250 },
    { name: '浙江台州冲压工厂', value: 7160 },
    { name: '浙江嘉兴总装配套厂', value: 6040 },
    { name: '浙江湖州新能源零部件工厂', value: 6990 },
  ],
  maintenanceCostTrend: [
    { month: '1月', value: 42 },
    { month: '2月', value: 38 },
    { month: '3月', value: 51 },
    { month: '4月', value: 46 },
    { month: '5月', value: 59 },
    { month: '6月', value: 33 },
  ],
  lowStockAlerts: spareAlerts.filter((alert) => alert.alertType === 'low_stock'),
};

export const analyticsPages: Record<string, AnalyticsPageData> = {
  assets: {
    metrics: dashboardData.metrics.slice(0, 4),
    primaryChart: dashboardData.statusDistribution,
    secondaryChart: [
      { name: '压铸设备', value: 386 },
      { name: '冲压设备', value: 302 },
      { name: '焊接设备', value: 275 },
      { name: '检测设备', value: 142 },
      { name: '工装夹具', value: 577 },
    ],
    table: dashboardData.factoryValue,
  },
  factory: {
    metrics: [
      { title: '厂区数', value: 4, unit: '个' },
      { title: '平均利用率', value: 81.6, unit: '%', precision: 1 },
      { title: '跨厂调拨中', value: 6, unit: '单' },
      { title: '组织层级', value: 4, unit: '级' },
    ],
    primaryChart: dashboardData.factoryValue,
    secondaryChart: [
      { name: '浙江宁波压铸工厂', value: 86, extra: 482 },
      { name: '浙江台州冲压工厂', value: 76, extra: 426 },
      { name: '浙江嘉兴总装配套厂', value: 80, extra: 386 },
      { name: '浙江湖州新能源零部件工厂', value: 88, extra: 388 },
    ],
    table: dashboardData.factoryValue,
  },
  maintenance: {
    metrics: [
      { title: '本月故障率', value: 2.9, unit: '%', precision: 1 },
      { title: '本月停机时长', value: 36, unit: '小时' },
      { title: '维修费用', value: 330000, unit: '元' },
      { title: '保养完成率', value: 94.5, unit: '%', precision: 1 },
    ],
    primaryChart: dashboardData.maintenanceCostTrend,
    secondaryChart: [
      { name: '轴承故障', value: 18 },
      { name: '液压异常', value: 13 },
      { name: '电气报警', value: 16 },
      { name: '激光耗材', value: 9 },
    ],
    table: [
      { name: '浙江宁波压铸工厂', value: 8 },
      { name: '浙江台州冲压工厂', value: 14 },
      { name: '浙江嘉兴总装配套厂', value: 7 },
      { name: '浙江湖州新能源零部件工厂', value: 5 },
    ],
  },
  finance: {
    metrics: [
      { title: '资产原值', value: 328600000, unit: '元' },
      { title: '累计折旧', value: 84200000, unit: '元' },
      { title: '净值', value: 244400000, unit: '元' },
      { title: '待核销金额', value: 408000, unit: '元' },
    ],
    primaryChart: [
      { month: '1月', value: 23600 },
      { month: '2月', value: 23820 },
      { month: '3月', value: 24050 },
      { month: '4月', value: 24180 },
      { month: '5月', value: 24320 },
      { month: '6月', value: 24440 },
    ],
    secondaryChart: dashboardData.factoryValue,
    table: dashboardData.factoryValue,
  },
  spares: {
    metrics: [
      { title: '备件 SKU', value: 1268, unit: '项' },
      { title: '库存金额', value: 18560000, unit: '元' },
      { title: '低库存项', value: 18, unit: '项', status: 'warning' },
      { title: '长期未动用', value: 42, unit: '项', status: 'danger' },
    ],
    primaryChart: [
      { name: '传动件', value: 320 },
      { name: '液压件', value: 260 },
      { name: '电气件', value: 188 },
      { name: '气动件', value: 210 },
      { name: '耗材', value: 290 },
    ],
    secondaryChart: [
      { month: '1月', value: 88 },
      { month: '2月', value: 72 },
      { month: '3月', value: 105 },
      { month: '4月', value: 96 },
      { month: '5月', value: 118 },
      { month: '6月', value: 74 },
    ],
    table: [
      { name: '低库存', value: 18 },
      { name: '超储', value: 12 },
      { name: '长期未动用', value: 42 },
      { name: '正常', value: 1196 },
    ],
  },
};
