import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="404"
      extra={
        <Link to="/dashboard">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  );
}
