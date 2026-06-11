import { useState } from 'react';
import { App, Button, Card, Input, Space, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '@/api/modules/auth';
import { useAuthStore } from '@/stores/authStore';
import styles from './index.module.css';

export default function LoginPage() {
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
    <div className={styles.loginPage}>
      <Card className={styles.loginCard}>
        <Space direction="vertical" size={36} className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <Typography.Title level={2} className={styles.loginTitle}>
              资产管理系统
            </Typography.Title>
          </div>

          <Space direction="vertical" size={16} className={styles.loginForm}>
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
          </Space>

          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            loading={mutation.isPending}
            onClick={() => mutation.mutate({ username, password })}
            className={styles.loginButton}
            block
          >
            登录
          </Button>
        </Space>
      </Card>
    </div>
  );
}
