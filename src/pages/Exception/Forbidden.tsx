import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <Result
      status="403"
      title="403"
      extra={
        <Link to="/dashboard">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  );
}
