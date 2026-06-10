import { Card } from 'antd';
import type { EChartsOption } from 'echarts';
import { useECharts } from '@/hooks/useECharts';

type ChartCardProps = {
  title: string;
  option: EChartsOption;
  height?: number;
};

export function ChartCard({ title, option, height = 300 }: ChartCardProps) {
  const chartRef = useECharts(option);

  return (
    <Card title={title} styles={{ body: { padding: 12 } }}>
      <div ref={chartRef} style={{ width: '100%', height }} />
    </Card>
  );
}
