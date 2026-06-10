import {
  ApartmentOutlined,
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
      { path: '/assets/list', name: '固定资产台账', permission: 'asset:view', element: <ManagementPage pageKey="assets.list" /> },
      { path: '/assets/intake', name: '资产入账', permission: 'asset:intake', element: <ManagementPage pageKey="assets.intake" /> },
      { path: '/assets/transfer', name: '资产调拨', permission: 'asset:transfer', element: <ManagementPage pageKey="assets.transfer" /> },
      { path: '/assets/disposal', name: '资产处置', permission: 'asset:disposal', element: <ManagementPage pageKey="assets.disposal" /> },
      { path: '/assets/inventory', name: '资产盘点', permission: 'asset:inventory', element: <ManagementPage pageKey="assets.inventory" /> },
    ],
  },
  {
    path: '/equipment',
    name: '设备档案',
    icon: <FileProtectOutlined />,
    children: [
      { path: '/equipment/files', name: '一机一档', permission: 'equipment:view', element: <ManagementPage pageKey="equipment.files" /> },
      { path: '/equipment/attachments', name: '档案附件', permission: 'equipment:attachment', element: <ManagementPage pageKey="equipment.attachments" /> },
    ],
  },
  {
    path: '/spares',
    name: '备品备件',
    icon: <HddOutlined />,
    children: [
      { path: '/spares/catalog', name: '备件台账', permission: 'spare:view', element: <ManagementPage pageKey="spares.catalog" /> },
      { path: '/spares/stock', name: '库存管理', permission: 'spare:stock', element: <ManagementPage pageKey="spares.stock" /> },
      { path: '/spares/inbound', name: '入库管理', permission: 'spare:inbound', element: <ManagementPage pageKey="spares.inbound" /> },
      { path: '/spares/outbound', name: '领用出库', permission: 'spare:outbound', element: <ManagementPage pageKey="spares.outbound" /> },
      { path: '/spares/inventory', name: '备件盘点', permission: 'spare:inventory', element: <ManagementPage pageKey="spares.inventory" /> },
      { path: '/spares/alerts', name: '备件预警', permission: 'spare:alert', element: <ManagementPage pageKey="spares.alerts" /> },
    ],
  },
  {
    path: '/maintenance',
    name: '维修保养',
    icon: <ToolOutlined />,
    children: [
      { path: '/maintenance/mom', name: 'MOM 数据展示', permission: 'mom:view', element: <MomDataPage /> },
    ],
  },
  {
    path: '/analytics',
    name: '数据看板',
    icon: <BarChartOutlined />,
    children: [
      { path: '/analytics/assets', name: '资产分析', permission: 'analytics:asset', element: <AnalyticsPage pageKey="assets" title="资产分析" subTitle="资产总量、价值、状态和分类结构。" /> },
      { path: '/analytics/factory', name: '厂区对比', permission: 'analytics:factory', element: <AnalyticsPage pageKey="factory" title="厂区对比" subTitle="各厂区资产数量、资产价值、利用率和组织维度对比。" /> },
      { path: '/analytics/maintenance', name: '维修分析', permission: 'analytics:maintenance', element: <AnalyticsPage pageKey="maintenance" title="维修分析" subTitle="故障率、停机时长、维修费用和故障原因分析。" /> },
      { path: '/analytics/finance', name: '费用分析', permission: 'analytics:finance', element: <AnalyticsPage pageKey="finance" title="费用分析" subTitle="原值、累计折旧、净值、处置费用和厂区价值结构。" /> },
      { path: '/analytics/spares', name: '备件分析', permission: 'analytics:spare', element: <AnalyticsPage pageKey="spares" title="备件分析" subTitle="备件库存、消耗、低库存和长期未动用分析。" /> },
    ],
  },
  {
    path: '/integrations',
    name: '系统集成',
    icon: <SettingOutlined />,
    children: [
      { path: '/integrations/mom', name: 'MOM 对接', permission: 'integration:mom', element: <ManagementPage pageKey="integrations.mom" /> },
      { path: '/integrations/finance', name: '财务对接', permission: 'integration:finance', element: <ManagementPage pageKey="integrations.finance" /> },
      { path: '/integrations/project', name: '项目管理对接', permission: 'integration:project', element: <ManagementPage pageKey="integrations.project" /> },
    ],
  },
  {
    path: '/system',
    name: '权限管理',
    icon: <SafetyOutlined />,
    children: [
      { path: '/system/orgs', name: '组织架构', permission: 'system:org', element: <OrgPage /> },
      { path: '/system/users', name: '用户管理', permission: 'system:user', element: <ManagementPage pageKey="system.users" /> },
      { path: '/system/roles', name: '角色权限', permission: 'system:role', element: <ManagementPage pageKey="system.roles" /> },
      { path: '/system/logs', name: '操作日志', permission: 'system:log', element: <ManagementPage pageKey="system.logs" /> },
    ],
  },
  {
    path: '/scope',
    name: '多厂区管理',
    icon: <ApartmentOutlined />,
    permission: 'analytics:factory',
    element: <AnalyticsPage pageKey="factory" title="集团多厂区管理" subTitle="集团、厂区、车间、产线维度的数据隔离和资产分布。" />,
  },
];

export function flattenRoutes(routes: AppRouteItem[]): AppRouteItem[] {
  return routes.flatMap((route) => [route, ...(route.children ? flattenRoutes(route.children) : [])]);
}
