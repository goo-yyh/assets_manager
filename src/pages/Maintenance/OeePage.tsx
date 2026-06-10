import { useMemo } from 'react';
import { Card, Space, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { EChartsOption } from 'echarts';
import { useQuery } from '@tanstack/react-query';
import { getOeeTrend } from '@/api/modules/maintenance';
import { AppPageContainer } from '@/components/AppPageContainer';
import { ChartCard } from '@/components/ChartCard';
import type { OeePoint } from '@/types/maintenance';
import { queryKeys } from '@/utils/queryKeys';

const columns: ColumnsType<OeePoint> = [
  { title: '月份', dataIndex: 'month', width: 100 },
  { title: 'OEE', dataIndex: 'oee', width: 100, render: (value) => `${Number(value).toFixed(1)}%` },
  { title: '故障率', dataIndex: 'faultRate', width: 100, render: (value) => `${Number(value).toFixed(1)}%` },
  { title: '停机时长', dataIndex: 'downtimeHours', width: 120, render: (value) => `${Number(value).toFixed(1)} 小时` },
];

export default function OeePage() {
  const { data = [], isFetching } = useQuery({ queryKey: queryKeys.maintenance('oee'), queryFn: getOeeTrend });
  const latest = data.at(-1);
  const averageOee = data.length ? data.reduce((sum, item) => sum + item.oee, 0) / data.length : 0;
  const totalDowntime = data.reduce((sum, item) => sum + item.downtimeHours, 0);

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: { top: 0 },
      grid: { left: 44, right: 24, top: 44, bottom: 36 },
      xAxis: { type: 'category', data: data.map((item) => item.month) },
      yAxis: [
        { type: 'value', name: '百分比' },
        { type: 'value', name: '小时' },
      ],
      series: [
        { name: 'OEE', type: 'line', smooth: true, data: data.map((item) => item.oee) },
        { name: '故障率', type: 'line', smooth: true, data: data.map((item) => item.faultRate) },
        { name: '停机时长', type: 'bar', yAxisIndex: 1, data: data.map((item) => item.downtimeHours) },
      ],
    }),
    [data],
  );

  return (
    <AppPageContainer title="OEE 数据" subTitle="MOM 同步的设备综合效率、故障率和停机趋势。">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div className="dashboard-grid">
          <Card className="dashboard-span-4 metric-card">
            <Statistic title="最新 OEE" value={latest?.oee ?? 0} precision={1} suffix="%" />
          </Card>
          <Card className="dashboard-span-4 metric-card">
            <Statistic title="平均 OEE" value={averageOee} precision={1} suffix="%" />
          </Card>
          <Card className="dashboard-span-4 metric-card">
            <Statistic title="累计停机" value={totalDowntime} precision={1} suffix="小时" />
          </Card>
        </div>
        <ChartCard title="OEE、故障率与停机趋势" option={option} />
        <Card title="月度明细">
          <Table<OeePoint>
            rowKey="month"
            columns={columns}
            dataSource={data}
            loading={isFetching}
            pagination={false}
          />
        </Card>
      </Space>
    </AppPageContainer>
  );
}
