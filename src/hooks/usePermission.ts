import type { PermissionCode } from '@/types/permission';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/utils/permission';

export function usePermission(permission?: PermissionCode): boolean {
  const user = useAuthStore((state) => state.user);
  return hasPermission(user, permission);
}
