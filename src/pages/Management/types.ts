import type { PermissionCode } from '@/types/permission';

export type ManagementPageKey =
  | 'assets.list'
  | 'assets.import'
  | 'assets.map'
  | 'assets.usage'
  | 'assets.intake'
  | 'assets.transfer'
  | 'assets.disposal'
  | 'assets.inventory'
  | 'assets.history'
  | 'equipment.files'
  | 'equipment.attachments'
  | 'equipment.params'
  | 'equipment.changes'
  | 'equipment.acceptance'
  | 'equipment.contracts'
  | 'equipment.images'
  | 'spares.catalog'
  | 'spares.applicableAssets'
  | 'spares.stock'
  | 'spares.inbound'
  | 'spares.outbound'
  | 'spares.returns'
  | 'spares.inventory'
  | 'spares.alerts'
  | 'spares.consumption'
  | 'maintenance.runtime'
  | 'maintenance.repairs'
  | 'maintenance.records'
  | 'maintenance.alerts'
  | 'analytics.warnings'
  | 'integrations.mom'
  | 'integrations.finance'
  | 'integrations.project'
  | 'integrations.syncRecords'
  | 'integrations.fields'
  | 'system.users'
  | 'system.roles'
  | 'system.logs';

export type RowRecord = Record<string, unknown> & {
  id: string;
};

export type ColumnKind = 'text' | 'status' | 'money' | 'number' | 'percent' | 'list';

export type PageColumn = {
  title: string;
  dataIndex: string;
  kind?: ColumnKind;
  width?: number;
  search?: boolean;
};

export type PageAction = {
  key: string;
  label: string;
  permission?: PermissionCode;
  danger?: boolean;
  primary?: boolean;
  immediate?: boolean;
};

export type ActionContext = {
  action: PageAction;
  row?: RowRecord;
};

export type ManagementPageConfig = {
  key: ManagementPageKey;
  title: string;
  apiPath: string;
  permission: PermissionCode;
  editPermission?: PermissionCode;
  approvePermission?: PermissionCode;
  columns: PageColumn[];
  actions: PageAction[];
  statusSearch?: boolean;
};
