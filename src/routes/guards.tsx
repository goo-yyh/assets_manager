import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { PermissionCode } from '@/types/permission';
import { canShowRoute } from '@/utils/permission';

type GuardProps = {
  children: ReactNode;
};

type PermissionGuardProps = GuardProps & {
  permission?: PermissionCode;
};

export function RequireAuth({ children }: GuardProps) {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const user = useAuthStore((state) => state.user);

  // 页面级守卫：菜单隐藏之外仍要拦截手动输入 URL 的访问。
  if (!canShowRoute(user, permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
