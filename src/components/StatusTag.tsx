import { Tag } from 'antd';
import { statusColorMap, statusTextMap } from '@/constants/status';

type StatusTagProps = {
  status?: string;
};

export function StatusTag({ status }: StatusTagProps) {
  const value = status ?? 'default';
  return <Tag color={statusColorMap[value] ?? 'default'}>{statusTextMap[value] ?? value}</Tag>;
}
