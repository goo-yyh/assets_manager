import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="当前角色没有访问该页面的权限。"
      extra={
        <Link to="/dashboard">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  );
}
