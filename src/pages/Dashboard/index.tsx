import { useMemo } from 'react';
import { Alert, Card, List, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { EChartsOption } from 'echarts';
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/api/modules/dashboard';
import { AppPageContainer } from '@/components/AppPageContainer';
import { ChartCard } from '@/components/ChartCard';
import { StatusTag } from '@/components/StatusTag';
import { useAuthStore } from '@/stores/authStore';
import type { TodoItem } from '@/types/analytics';
import type { SpareAlert } from '@/types/spare';
import { formatMoney, formatWanYuan } from '@/utils/format';
import { getUserFactoryIds } from '@/utils/permission';
import { queryKeys } from '@/utils/queryKeys';

const lowStockColumns: ColumnsType<SpareAlert> = [
  { title: '备件编码', dataIndex: 'spareCode', width: 150 },
  { title: '备件名称', dataIndex: 'spareName', width: 160 },
  { title: '厂区', dataIndex: 'factoryName', width: 150 },
  { title: '当前库存', dataIndex: 'currentQty', width: 90 },
  { title: '安全库存', dataIndex: 'safetyStock', width: 90 },
  { title: '预警', dataIndex: 'alertType', width: 90, render: (status) => <StatusTag status={String(status)} /> },
];

function metricValue(title: string, value: number) {
  if (title.includes('原值') || title.includes('折旧') || title.includes('净值')) {
    return formatMoney(value);
  }
  return value.toLocaleString('zh-CN');
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const factoryIds = getUserFactoryIds(user);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard(factoryIds),
    queryFn: () => getDashboard(factoryIds),
  });

  const statusOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['42%', '68%'],
          center: ['50%', '44%'],
          data: data?.statusDistribution ?? [],
        },
      ],
    }),
    [data?.statusDistribution],
  );

  const factoryValueOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis', formatter: '{b}<br />资产净值：{c} 万元' },
      grid: { left: 48, right: 24, top: 24, bottom: 48 },
      xAxis: { type: 'category', data: data?.factoryValue.map((item) => item.name) ?? [], axisLabel: { rotate: 20 } },
      yAxis: { type: 'value', name: '万元' },
      series: [{ type: 'bar', data: data?.factoryValue.map((item) => item.value) ?? [], itemStyle: { color: '#1677ff' } }],
    }),
    [data?.factoryValue],
  );

  const costTrendOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      grid: { left: 44, right: 24, top: 24, bottom: 36 },
      xAxis: { type: 'category', data: data?.maintenanceCostTrend.map((item) => item.month) ?? [] },
      yAxis: { type: 'value', name: '万元' },
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: { color: 'rgba(22,119,255,0.12)' },
          data: data?.maintenanceCostTrend.map((item) => item.value) ?? [],
        },
      ],
    }),
    [data?.maintenanceCostTrend],
  );

  return (
    <AppPageContainer title="首页看板" subTitle="集团资产、维保、备件和待办事项总览。">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Alert
          showIcon
          type="info"
          message={`当前角色：${user?.roleName ?? '-'}，数据范围：${user?.factoryName ?? '集团'}`}
        />

        <div className="dashboard-grid">
          {(data?.metrics ?? []).map((metric) => (
            <Card key={metric.title} className="dashboard-span-3 metric-card" loading={isLoading}>
              <Statistic
                title={metric.title}
                value={metricValue(metric.title, metric.value)}
                suffix={metric.unit && !metric.title.includes('资产') ? metric.unit : undefined}
              />
              {metric.trend ? <Typography.Text type="secondary">{metric.trend}</Typography.Text> : null}
            </Card>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-span-4">
            <ChartCard title="资产状态分布" option={statusOption} />
          </div>
          <div className="dashboard-span-4">
            <ChartCard title="厂区资产价值对比" option={factoryValueOption} />
          </div>
          <div className="dashboard-span-4">
            <ChartCard title="近 6 个月维修费用趋势" option={costTrendOption} />
          </div>
        </div>

        <div className="dashboard-grid">
          <Card title="待办事项" className="dashboard-span-4">
            <List<TodoItem>
              dataSource={data?.todos ?? []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Typography.Text strong>{item.title}</Typography.Text>}
                    description={
                      <Space size={8}>
                        <Tag color="blue">{item.module}</Tag>
                        <Typography.Text type="secondary">{item.owner}</Typography.Text>
                        <Typography.Text type="secondary">{item.dueAt}</Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="备件低库存预警" className="dashboard-span-8">
            <Table<SpareAlert>
              rowKey="id"
              size="small"
              columns={lowStockColumns}
              dataSource={data?.lowStockAlerts ?? []}
              pagination={false}
              scroll={{ x: 760 }}
            />
            <Typography.Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0 }}>
              库存金额口径：{formatWanYuan(18560000)}，低库存备件优先保障冲压、压铸和新能源焊接产线。
            </Typography.Paragraph>
          </Card>
        </div>
      </Space>
    </AppPageContainer>
  );
}
