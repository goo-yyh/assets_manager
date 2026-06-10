import { LogoutOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import type { MenuDataItem } from '@ant-design/pro-components';
import { Button, Space, Typography } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { appRoutes, type AppRouteItem } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { canShowRoute } from '@/utils/permission';

function toMenuData(routes: AppRouteItem[], user = useAuthStore.getState().user): MenuDataItem[] {
  return routes
    .map((route): MenuDataItem | undefined => {
      const children = route.children ? toMenuData(route.children, user) : undefined;
      const allowed = canShowRoute(user, route.permission);
      if (route.children && (!children || children.length === 0)) return undefined;
      if (!route.children && !allowed) return undefined;
      return {
        path: route.path,
        name: route.name,
        icon: route.icon,
        children,
      };
    })
    .filter((item): item is MenuDataItem => Boolean(item));
}

export function BasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const collapsed = useLayoutStore((state) => state.collapsed);
  const setCollapsed = useLayoutStore((state) => state.setCollapsed);
  const menuData = toMenuData(appRoutes, user);

  return (
    <ProLayout
      title="资产管理系统"
      logo={false}
      layout="mix"
      route={{ path: '/', routes: menuData }}
      location={{ pathname: location.pathname }}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      fixedHeader
      fixSiderbar
      menuItemRender={(item, dom) => (item.path ? <Link to={item.path}>{dom}</Link> : dom)}
      rightContentRender={() => (
        <Space size={12}>
          <Typography.Text>{user?.name}</Typography.Text>
          <Typography.Text type="secondary">{user?.roleName}</Typography.Text>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => {
              logout();
              void navigate('/login', { replace: true });
            }}
          >
            退出
          </Button>
        </Space>
      )}
      contentStyle={{ padding: 0 }}
    >
      <main className="app-content-scroll">
        <Outlet />
      </main>
    </ProLayout>
  );
}
