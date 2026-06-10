import { Navigate, Route, Routes } from 'react-router-dom';
import { appRoutes, flattenRoutes } from '@/config/routes';
import { BasicLayout } from '@/layouts/BasicLayout';
import ForbiddenPage from '@/pages/Exception/Forbidden';
import NotFoundPage from '@/pages/Exception/NotFound';
import LoginPage from '@/pages/Login';
import { PermissionGuard, RequireAuth } from './guards';

const routeItems = flattenRoutes(appRoutes).filter((route) => route.element);

function relativePath(path: string) {
  return path.replace(/^\//, '');
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <BasicLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        {routeItems.map((route) => (
          <Route
            key={route.path}
            path={relativePath(route.path)}
            element={<PermissionGuard permission={route.permission}>{route.element}</PermissionGuard>}
          />
        ))}
        <Route path="403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
