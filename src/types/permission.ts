export type RoleKey =
  | 'system_admin'
  | 'asset_admin'
  | 'equipment_admin'
  | 'spare_admin'
  | 'factory_manager'
  | 'finance'
  | 'maintenance'
  | 'executive';

export type DataScopeType = 'group' | 'factory' | 'department' | 'self';

export type PermissionCode =
  | 'dashboard:view'
  | 'asset:view'
  | 'asset:create'
  | 'asset:edit'
  | 'asset:intake'
  | 'asset:transfer'
  | 'asset:disposal'
  | 'asset:inventory'
  | 'asset:approve'
  | 'equipment:view'
  | 'equipment:edit'
  | 'equipment:attachment'
  | 'spare:view'
  | 'spare:edit'
  | 'spare:stock'
  | 'spare:inbound'
  | 'spare:outbound'
  | 'spare:inventory'
  | 'spare:alert'
  | 'spare:approve'
  | 'mom:view'
  | 'analytics:asset'
  | 'analytics:factory'
  | 'analytics:maintenance'
  | 'analytics:finance'
  | 'analytics:spare'
  | 'integration:mom'
  | 'integration:finance'
  | 'integration:project'
  | 'system:org'
  | 'system:user'
  | 'system:role'
  | 'system:log';

export type RoleDefinition = {
  key: RoleKey;
  name: string;
  description: string;
  permissions: PermissionCode[];
  dataScope: DataScopeType;
  factoryIds: string[];
};
