import { useState } from 'react';
import { App, Button, Card, Input, Radio, Space, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '@/api/modules/auth';
import { loginAccounts } from '@/mock/accounts';
import { useAuthStore } from '@/stores/authStore';
import type { RoleKey } from '@/types/permission';

export default function LoginPage() {
  const defaultAccount = loginAccounts[0];
  const [roleKey, setRoleKey] = useState<RoleKey>(defaultAccount.roleKey);
  const [username, setUsername] = useState(defaultAccount.username);
  const [password, setPassword] = useState(defaultAccount.password);
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
              资产管理系统 Demo
            </Typography.Title>
            <Typography.Text type="secondary">
              汽配制造集团资产、设备档案、备品备件、MOM 数据和权限管理静态演示。
            </Typography.Text>
          </div>

          <Radio.Group
            value={roleKey}
            onChange={(event) => {
              const nextRoleKey = event.target.value as RoleKey;
              const account = loginAccounts.find((item) => item.roleKey === nextRoleKey) ?? defaultAccount;
              setRoleKey(nextRoleKey);
              setUsername(account.username);
              setPassword(account.password);
            }}
            style={{ width: '100%' }}
          >
            <div className="dashboard-grid">
              {loginAccounts.map((account) => (
                <Radio.Button
                  key={account.roleKey}
                  value={account.roleKey}
                  className="dashboard-span-3"
                  style={{ height: 96, padding: 12, whiteSpace: 'normal', borderRadius: 8, marginBottom: 12 }}
                >
                  <Typography.Text strong>{account.roleName}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {account.username}
                  </Typography.Text>
                </Radio.Button>
              ))}
            </div>
          </Radio.Group>

          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Input
              addonBefore="账号"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
            <Input.Password
              addonBefore="密码"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            <Typography.Text type="secondary">
              点击角色会自动填充演示账号，默认密码均为 Demo@2026。
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
            模拟登录
          </Button>
        </Space>
      </Card>
    </div>
  );
}
