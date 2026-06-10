import type { PermissionCode } from '@/types/permission';
import type { AppUser } from '@/types/system';

export function hasPermission(user: AppUser | undefined, permission?: PermissionCode): boolean {
  if (!permission) return true;
  return Boolean(user?.permissions.includes(permission));
}

export function getUserFactoryIds(user: AppUser | undefined): string[] {
  return user?.factoryIds ?? [];
}

export function canShowRoute(user: AppUser | undefined, permission?: PermissionCode): boolean {
  // 路由权限只做前端体验控制，真实生产环境仍需要后端接口按角色和数据范围二次校验。
  return hasPermission(user, permission);
}
