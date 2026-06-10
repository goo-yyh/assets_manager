import type { PermissionCode, RoleKey } from './permission';

export type OrgType = 'group' | 'factory' | 'workshop' | 'line' | 'department';

export type OrgNode = {
  id: string;
  parentId?: string;
  name: string;
  type: OrgType;
  manager: string;
  assetCount: number;
  children?: OrgNode[];
};

export type UserStatus = 'enabled' | 'disabled';

export type AppUser = {
  id: string;
  name: string;
  username: string;
  roleKey: RoleKey;
  roleName: string;
  factoryId: string;
  factoryName: string;
  department: string;
  status: UserStatus;
  permissions: PermissionCode[];
  factoryIds: string[];
};

export type RolePermissionRow = {
  id: string;
  roleKey: RoleKey;
  roleName: string;
  menuCount: number;
  buttonCount: number;
  dataScope: string;
  description: string;
  status: UserStatus;
};

export type OperationLog = {
  id: string;
  operator: string;
  module: string;
  action: string;
  target: string;
  result: 'success' | 'fail';
  ip: string;
  createdAt: string;
  factoryId: string;
};
