import { useMemo } from 'react';
import { Alert, Card, Space, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { EChartsOption } from 'echarts';
import { useQuery } from '@tanstack/react-query';
import {
  getFaultAlertPage,
  getMaintenancePage,
  getOeeTrend,
  getRepairPage,
  getRuntimePage,
} from '@/api/modules/maintenance';
import { AppPageContainer } from '@/components/AppPageContainer';
import { ChartCard } from '@/components/ChartCard';
import { MoneyText } from '@/components/MoneyText';
import { StatusTag } from '@/components/StatusTag';
import { useAuthStore } from '@/stores/authStore';
import type { FaultAlert, MaintenanceRecord, MomRuntimeRecord, RepairRecord } from '@/types/maintenance';
import { getUserFactoryIds } from '@/utils/permission';
import { queryKeys } from '@/utils/queryKeys';

const runtimeColumns: ColumnsType<MomRuntimeRecord> = [
  { title: '资产编码', dataIndex: 'assetCode', width: 150 },
  { title: '设备名称', dataIndex: 'equipmentName', width: 190 },
  { title: '厂区', dataIndex: 'factoryName', width: 150 },
  { title: '产线', dataIndex: 'lineName', width: 160 },
  { title: '状态', dataIndex: 'state', width: 90, render: (state) => <StatusTag status={String(state)} /> },
  { title: 'OEE', dataIndex: 'oee', width: 90, render: (value) => `${Number(value).toFixed(1)}%` },
  { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
];

const repairColumns: ColumnsType<RepairRecord> = [
  { title: '工单', dataIndex: 'workOrder', width: 130 },
  { title: '资产编码', dataIndex: 'assetCode', width: 150 },
  { title: '故障原因', dataIndex: 'faultReason', width: 220 },
  { title: '维修方案', dataIndex: 'solution', width: 260 },
  { title: '费用', dataIndex: 'cost', width: 120, render: (value) => <MoneyText value={Number(value)} /> },
  { title: '维修人', dataIndex: 'repairedBy', width: 90 },
];

const maintenanceColumns: ColumnsType<MaintenanceRecord> = [
  { title: '工单', dataIndex: 'workOrder', width: 130 },
  { title: '资产编码', dataIndex: 'assetCode', width: 150 },
  { title: '保养内容', dataIndex: 'content', width: 260 },
  { title: '更换备件', dataIndex: 'replacedSpares', width: 200 },
  { title: '保养人', dataIndex: 'maintainedBy', width: 90 },
  { title: '保养时间', dataIndex: 'maintainedAt', width: 150 },
];

const alertColumns: ColumnsType<FaultAlert> = [
  { title: '资产编码', dataIndex: 'assetCode', width: 150 },
  { title: '设备名称', dataIndex: 'equipmentName', width: 190 },
  { title: '等级', dataIndex: 'level', width: 90, render: (level) => <StatusTag status={String(level)} /> },
  { title: '告警内容', dataIndex: 'message', width: 320 },
  { title: '时间', dataIndex: 'createdAt', width: 150 },
];

export default function MomDataPage() {
  const user = useAuthStore((state) => state.user);
  const params = { pageNum: 1, pageSize: 10, factoryIds: getUserFactoryIds(user) };
  const runtime = useQuery({ queryKey: queryKeys.maintenance('runtime', params), queryFn: () => getRuntimePage(params) });
  const repairs = useQuery({ queryKey: queryKeys.maintenance('repairs', params), queryFn: () => getRepairPage(params) });
  const maintenances = useQuery({ queryKey: queryKeys.maintenance('records', params), queryFn: () => getMaintenancePage(params) });
  const alerts = useQuery({ queryKey: queryKeys.maintenance('alerts', params), queryFn: () => getFaultAlertPage(params) });
  const oee = useQuery({ queryKey: queryKeys.maintenance('oee'), queryFn: getOeeTrend });

  const oeeOption = useMemo<EChartsOption>(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: { top: 0 },
      grid: { left: 44, right: 24, top: 44, bottom: 36 },
      xAxis: { type: 'category', data: oee.data?.map((item) => item.month) ?? [] },
      yAxis: [
        { type: 'value', name: 'OEE %' },
        { type: 'value', name: '小时' },
      ],
      series: [
        { name: 'OEE', type: 'line', smooth: true, data: oee.data?.map((item) => item.oee) ?? [] },
        { name: '停机时长', type: 'bar', yAxisIndex: 1, data: oee.data?.map((item) => item.downtimeHours) ?? [] },
      ],
    }),
    [oee.data],
  );

  const runtimeList = runtime.data?.list ?? [];
  const runningCount = runtimeList.filter((item) => item.state === 'running').length;
  const faultCount = runtimeList.filter((item) => item.state === 'fault').length;

  return (
    <AppPageContainer title="MOM 数据展示" subTitle="设备运行状态、OEE、维修记录、保养记录和故障告警。">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Alert
          type="info"
          showIcon
          message="数据来自 MOM，本系统仅展示与资产、档案、备件的关联关系，不重复建设维修保养业务操作。"
        />
        <div className="dashboard-grid">
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="运行设备" value={runningCount} suffix="台" />
          </Card>
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="停机/故障" value={(runtime.data?.total ?? 0) - runningCount} suffix="台" />
          </Card>
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="故障告警" value={faultCount + (alerts.data?.total ?? 0)} suffix="条" />
          </Card>
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="维修记录" value={repairs.data?.total ?? 0} suffix="条" />
          </Card>
        </div>
        <ChartCard title="OEE 与停机趋势" option={oeeOption} />
        <Card title="设备运行状态">
          <Table<MomRuntimeRecord> rowKey="id" columns={runtimeColumns} dataSource={runtimeList} loading={runtime.isFetching} scroll={{ x: 980 }} pagination={false} />
        </Card>
        <div className="dashboard-grid">
          <Card title="维修记录" className="dashboard-span-6">
            <Table<RepairRecord> rowKey="id" columns={repairColumns} dataSource={repairs.data?.list ?? []} loading={repairs.isFetching} scroll={{ x: 970 }} pagination={false} />
          </Card>
          <Card title="保养记录" className="dashboard-span-6">
            <Table<MaintenanceRecord> rowKey="id" columns={maintenanceColumns} dataSource={maintenances.data?.list ?? []} loading={maintenances.isFetching} scroll={{ x: 980 }} pagination={false} />
          </Card>
        </div>
        <Card title="故障告警">
          <Table<FaultAlert> rowKey="id" columns={alertColumns} dataSource={alerts.data?.list ?? []} loading={alerts.isFetching} scroll={{ x: 900 }} pagination={false} />
        </Card>
      </Space>
    </AppPageContainer>
  );
}
