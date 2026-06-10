import type { PermissionCode } from '@/types/permission';

export type ManagementPageKey =
  | 'assets.list'
  | 'assets.intake'
  | 'assets.transfer'
  | 'assets.disposal'
  | 'assets.inventory'
  | 'equipment.files'
  | 'equipment.attachments'
  | 'spares.catalog'
  | 'spares.stock'
  | 'spares.inbound'
  | 'spares.outbound'
  | 'spares.inventory'
  | 'spares.alerts'
  | 'integrations.mom'
  | 'integrations.finance'
  | 'integrations.project'
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
};

export type ManagementPageConfig = {
  key: ManagementPageKey;
  title: string;
  subTitle: string;
  apiPath: string;
  permission: PermissionCode;
  editPermission?: PermissionCode;
  approvePermission?: PermissionCode;
  columns: PageColumn[];
  actions: PageAction[];
  coverage: string[];
  statusSearch?: boolean;
};
