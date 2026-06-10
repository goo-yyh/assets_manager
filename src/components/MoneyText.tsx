import { Typography } from 'antd';
import { formatMoney } from '@/utils/format';

type MoneyTextProps = {
  value?: number;
};

export function MoneyText({ value }: MoneyTextProps) {
  return <Typography.Text strong>{formatMoney(value)}</Typography.Text>;
}
