import { useMemo } from 'react';
import { Card, Space, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { EChartsOption } from 'echarts';
import { useQuery } from '@tanstack/react-query';
import { getAnalyticsPage, type AnalyticsKey } from '@/api/modules/analytics';
import { AppPageContainer } from '@/components/AppPageContainer';
import { ChartCard } from '@/components/ChartCard';
import type { ChartDatum, TrendPoint } from '@/types/analytics';
import { formatMoney } from '@/utils/format';
import { queryKeys } from '@/utils/queryKeys';

type AnalyticsPageProps = {
  pageKey: AnalyticsKey;
  title: string;
};

const tableColumns: ColumnsType<ChartDatum> = [
  { title: '维度', dataIndex: 'name' },
  { title: '数值', dataIndex: 'value', align: 'right' },
];

function isTrend(data: ChartDatum[] | TrendPoint[]): data is TrendPoint[] {
  return data.length > 0 && 'month' in data[0];
}

function makeChartOption(title: string, data: ChartDatum[] | TrendPoint[], color: string): EChartsOption {
  if (isTrend(data)) {
    return {
      tooltip: { trigger: 'axis' },
      grid: { left: 44, right: 24, top: 28, bottom: 36 },
      xAxis: { type: 'category', data: data.map((item) => item.month) },
      yAxis: { type: 'value' },
      series: [{ name: title, type: 'line', smooth: true, areaStyle: {}, data: data.map((item) => item.value), color }],
    };
  }

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 44, right: 24, top: 28, bottom: 48 },
    xAxis: { type: 'category', data: data.map((item) => item.name), axisLabel: { rotate: 20 } },
    yAxis: { type: 'value' },
    series: [{ name: title, type: 'bar', data: data.map((item) => item.value), color }],
  };
}

export function AnalyticsPage({ pageKey, title }: AnalyticsPageProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.analytics(pageKey),
    queryFn: () => getAnalyticsPage(pageKey),
  });

  const primaryOption = useMemo(
    () => makeChartOption('主指标', data?.primaryChart ?? [], '#1677ff'),
    [data?.primaryChart],
  );
  const secondaryOption = useMemo(
    () => makeChartOption('辅助指标', data?.secondaryChart ?? [], '#52c41a'),
    [data?.secondaryChart],
  );

  return (
    <AppPageContainer title={title}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div className="dashboard-grid">
          {(data?.metrics ?? []).map((metric) => (
            <Card key={metric.title} className="dashboard-span-3 metric-card" loading={isLoading}>
              <Statistic
                title={metric.title}
                value={metric.title.includes('金额') || metric.title.includes('原值') || metric.title.includes('净值') ? formatMoney(metric.value) : metric.value}
                suffix={metric.unit && metric.unit !== '元' ? metric.unit : undefined}
                precision={metric.precision}
              />
            </Card>
          ))}
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-span-6">
            <ChartCard title={`${title} - 主指标`} option={primaryOption} />
          </div>
          <div className="dashboard-span-6">
            <ChartCard title={`${title} - 辅助指标`} option={secondaryOption} />
          </div>
        </div>
        <Card title="明细排行">
          <Table<ChartDatum>
            rowKey="name"
            columns={tableColumns}
            dataSource={data?.table ?? []}
            pagination={false}
            loading={isLoading}
          />
        </Card>
      </Space>
    </AppPageContainer>
  );
}
