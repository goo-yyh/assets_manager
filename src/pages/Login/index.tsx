import { useState } from 'react';
import { App, Button, Card, Input, Select, Space, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '@/api/modules/auth';
import { loginAccounts } from '@/mock/accounts';
import { useAuthStore } from '@/stores/authStore';
import type { RoleKey } from '@/types/permission';

export default function LoginPage() {
  const [roleKey, setRoleKey] = useState<RoleKey>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      setAuth(result.token, result.user);
      void message.success(`已登录：${result.user.roleName}`);
      void navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      void message.error(error instanceof Error ? error.message : '登录失败');
    },
  });

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #eef6ff 0%, #f7fafc 46%, #e8f3ff 100%)',
        padding: 24,
      }}
    >
      <Card style={{ width: 760, maxWidth: '100%', boxShadow: '0 20px 60px rgba(22, 119, 255, 0.12)' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={2} style={{ marginBottom: 8 }}>
              资产管理系统
            </Typography.Title>
            <Typography.Text type="secondary">
              汽配制造集团资产、设备档案、备品备件、MOM 数据和权限管理平台。
            </Typography.Text>
          </div>

          <Select<RoleKey>
            value={roleKey}
            placeholder="请选择登录角色"
            options={loginAccounts.map((account) => ({
              label: `${account.roleName}（${account.username}）`,
              value: account.roleKey,
            }))}
            onChange={(nextRoleKey) => {
              setRoleKey(nextRoleKey);
            }}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="label"
          />

          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Input
              addonBefore="账号"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              placeholder="请输入账号"
            />
            <Input.Password
              addonBefore="密码"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="请输入密码"
            />
            <Typography.Text type="secondary">
              请选择角色并输入账号密码，初始密码统一为 123456。
            </Typography.Text>
          </Space>

          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            loading={mutation.isPending}
            onClick={() => mutation.mutate({ username, password })}
            block
          >
            登录
          </Button>
        </Space>
      </Card>
    </div>
  );
}
