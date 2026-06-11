import {
  BarChartOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileProtectOutlined,
  HddOutlined,
  SafetyOutlined,
  SettingOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import { AnalyticsPage } from '@/pages/Analytics/AnalyticsPage';
import DashboardPage from '@/pages/Dashboard';
import MomDataPage from '@/pages/Maintenance/MomDataPage';
import OeePage from '@/pages/Maintenance/OeePage';
import { ManagementPage } from '@/pages/Management/ManagementPage';
import OrgPage from '@/pages/System/OrgPage';
import type { PermissionCode } from '@/types/permission';

export type AppRouteItem = {
  path: string;
  name: string;
  icon?: ReactNode;
  permission?: PermissionCode;
  element?: ReactNode;
  children?: AppRouteItem[];
};

export const appRoutes: AppRouteItem[] = [
  {
    path: '/dashboard',
    name: '首页看板',
    icon: <DashboardOutlined />,
    permission: 'dashboard:view',
    element: <DashboardPage />,
  },
  {
    path: '/assets',
    name: '资产管理',
    icon: <DatabaseOutlined />,
    children: [
      {
        path: '/assets/register',
        name: '资产台账',
        children: [
          { path: '/assets/list', name: '固定资产台账', permission: 'asset:view', element: <ManagementPage pageKey="assets.list" /> },
          { path: '/assets/intake', name: '资产入账', permission: 'asset:intake', element: <ManagementPage pageKey="assets.intake" /> },
          { path: '/assets/import', name: '批量导入', permission: 'asset:intake', element: <ManagementPage pageKey="assets.import" /> },
          { path: '/assets/map', name: '资产地图', permission: 'asset:view', element: <ManagementPage pageKey="assets.map" /> },
        ],
      },
      {
        path: '/assets/lifecycle',
        name: '生命周期',
        children: [
          { path: '/assets/usage', name: '日常使用', permission: 'asset:view', element: <ManagementPage pageKey="assets.usage" /> },
          { path: '/assets/transfer', name: '资产调拨', permission: 'asset:transfer', element: <ManagementPage pageKey="assets.transfer" /> },
          { path: '/assets/disposal', name: '资产处置', permission: 'asset:disposal', element: <ManagementPage pageKey="assets.disposal" /> },
          { path: '/assets/inventory', name: '资产盘点', permission: 'asset:inventory', element: <ManagementPage pageKey="assets.inventory" /> },
          { path: '/assets/history', name: '历史追溯', permission: 'asset:view', element: <ManagementPage pageKey="assets.history" /> },
        ],
      },
    ],
  },
  {
    path: '/equipment',
    name: '设备档案',
    icon: <FileProtectOutlined />,
    children: [
      {
        path: '/equipment/manage',
        name: '档案管理',
        children: [
          { path: '/equipment/files', name: '一机一档', permission: 'equipment:view', element: <ManagementPage pageKey="equipment.files" /> },
          { path: '/equipment/params', name: '技术参数', permission: 'equipment:view', element: <ManagementPage pageKey="equipment.params" /> },
          { path: '/equipment/changes', name: '变更记录', permission: 'equipment:view', element: <ManagementPage pageKey="equipment.changes" /> },
        ],
      },
      {
        path: '/equipment/docs',
        name: '档案资料',
        children: [
          { path: '/equipment/attachments', name: '档案附件', permission: 'equipment:attachment', element: <ManagementPage pageKey="equipment.attachments" /> },
          { path: '/equipment/acceptance', name: '验收资料', permission: 'equipment:attachment', element: <ManagementPage pageKey="equipment.acceptance" /> },
          { path: '/equipment/contracts', name: '合同证件', permission: 'equipment:attachment', element: <ManagementPage pageKey="equipment.contracts" /> },
          { path: '/equipment/images', name: '图片影像', permission: 'equipment:attachment', element: <ManagementPage pageKey="equipment.images" /> },
        ],
      },
    ],
  },
  {
    path: '/spares',
    name: '备品备件',
    icon: <HddOutlined />,
    children: [
      {
        path: '/spares/basic',
        name: '基础资料',
        children: [
          { path: '/spares/catalog', name: '备件台账', permission: 'spare:view', element: <ManagementPage pageKey="spares.catalog" /> },
          { path: '/spares/applicable-assets', name: '适用设备', permission: 'spare:view', element: <ManagementPage pageKey="spares.applicableAssets" /> },
        ],
      },
      {
        path: '/spares/inventory-business',
        name: '库存业务',
        children: [
          { path: '/spares/stock', name: '库存管理', permission: 'spare:stock', element: <ManagementPage pageKey="spares.stock" /> },
          { path: '/spares/inbound', name: '入库管理', permission: 'spare:inbound', element: <ManagementPage pageKey="spares.inbound" /> },
          { path: '/spares/outbound', name: '领用出库', permission: 'spare:outbound', element: <ManagementPage pageKey="spares.outbound" /> },
          { path: '/spares/returns', name: '未用退库', permission: 'spare:outbound', element: <ManagementPage pageKey="spares.returns" /> },
          { path: '/spares/inventory', name: '备件盘点', permission: 'spare:inventory', element: <ManagementPage pageKey="spares.inventory" /> },
          { path: '/spares/alerts', name: '库存预警', permission: 'spare:alert', element: <ManagementPage pageKey="spares.alerts" /> },
        ],
      },
      {
        path: '/spares/statistics',
        name: '备件统计',
        children: [
          { path: '/spares/consumption', name: '备件消耗', permission: 'spare:stock', element: <ManagementPage pageKey="spares.consumption" /> },
        ],
      },
    ],
  },
  {
    path: '/maintenance',
    name: '维修保养',
    icon: <ToolOutlined />,
    children: [
      {
        path: '/maintenance/mom-data',
        name: 'MOM 数据',
        children: [
          { path: '/maintenance/mom', name: 'MOM 数据总览', permission: 'mom:view', element: <MomDataPage /> },
          { path: '/maintenance/runtime', name: '运行状态', permission: 'mom:view', element: <ManagementPage pageKey="maintenance.runtime" /> },
          { path: '/maintenance/oee', name: 'OEE 数据', permission: 'mom:view', element: <OeePage /> },
          { path: '/maintenance/repairs', name: '维修记录', permission: 'mom:view', element: <ManagementPage pageKey="maintenance.repairs" /> },
          { path: '/maintenance/records', name: '保养记录', permission: 'mom:view', element: <ManagementPage pageKey="maintenance.records" /> },
          { path: '/maintenance/alerts', name: '故障告警', permission: 'mom:view', element: <ManagementPage pageKey="maintenance.alerts" /> },
        ],
      },
    ],
  },
  {
    path: '/analytics',
    name: '数据看板',
    icon: <BarChartOutlined />,
    children: [
      {
        path: '/analytics/assets-board',
        name: '资产看板',
        children: [
          { path: '/analytics/assets', name: '资产总览', permission: 'analytics:asset', element: <AnalyticsPage pageKey="assets" title="资产总览" /> },
          { path: '/analytics/factory', name: '厂区对比', permission: 'analytics:factory', element: <AnalyticsPage pageKey="factory" title="厂区对比" /> },
          { path: '/analytics/asset-map', name: '资产地图', permission: 'analytics:factory', element: <ManagementPage pageKey="assets.map" /> },
        ],
      },
      {
        path: '/analytics/operation',
        name: '运营分析',
        children: [
          { path: '/analytics/maintenance', name: '维修分析', permission: 'analytics:maintenance', element: <AnalyticsPage pageKey="maintenance" title="维修分析" /> },
          { path: '/analytics/finance', name: '费用分析', permission: 'analytics:finance', element: <AnalyticsPage pageKey="finance" title="费用分析" /> },
          { path: '/analytics/spares', name: '备件分析', permission: 'analytics:spare', element: <AnalyticsPage pageKey="spares" title="备件分析" /> },
          { path: '/analytics/warnings', name: '预警看板', permission: 'analytics:spare', element: <ManagementPage pageKey="analytics.warnings" /> },
        ],
      },
    ],
  },
  {
    path: '/integrations',
    name: '系统集成',
    icon: <SettingOutlined />,
    children: [
      {
        path: '/integrations/status',
        name: '对接状态',
        children: [
          { path: '/integrations/mom', name: 'MOM 对接', permission: 'integration:mom', element: <ManagementPage pageKey="integrations.mom" /> },
          { path: '/integrations/finance', name: '财务对接', permission: 'integration:finance', element: <ManagementPage pageKey="integrations.finance" /> },
          { path: '/integrations/project', name: '项目管理对接', permission: 'integration:project', element: <ManagementPage pageKey="integrations.project" /> },
        ],
      },
      {
        path: '/integrations/config',
        name: '同步配置',
        children: [
          { path: '/integrations/sync-records', name: '同步记录', permission: 'integration:mom', element: <ManagementPage pageKey="integrations.syncRecords" /> },
          { path: '/integrations/fields', name: '字段映射', permission: 'integration:mom', element: <ManagementPage pageKey="integrations.fields" /> },
        ],
      },
    ],
  },
  {
    path: '/system',
    name: '权限管理',
    icon: <SafetyOutlined />,
    children: [
      {
        path: '/system/permission',
        name: '组织权限',
        children: [
          { path: '/system/orgs', name: '组织架构', permission: 'system:org', element: <OrgPage /> },
          { path: '/system/users', name: '用户管理', permission: 'system:user', element: <ManagementPage pageKey="system.users" /> },
          { path: '/system/roles', name: '角色权限', permission: 'system:role', element: <ManagementPage pageKey="system.roles" /> },
        ],
      },
      {
        path: '/system/audit',
        name: '审计追踪',
        children: [
          { path: '/system/logs', name: '操作日志', permission: 'system:log', element: <ManagementPage pageKey="system.logs" /> },
        ],
      },
    ],
  },
];

export function flattenRoutes(routes: AppRouteItem[]): AppRouteItem[] {
  return routes.flatMap((route) => [route, ...(route.children ? flattenRoutes(route.children) : [])]);
}
