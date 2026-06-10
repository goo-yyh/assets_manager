import { useMemo, useState } from 'react';
import { App, Card, Descriptions, Drawer, Space, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, FormOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPage, submitAction } from '@/api/modules/common';
import { AppPageContainer } from '@/components/AppPageContainer';
import { MoneyText } from '@/components/MoneyText';
import { PermissionButton } from '@/components/PermissionButton';
import { StatusTag } from '@/components/StatusTag';
import { statusTextMap } from '@/constants/status';
import { factoryOptions } from '@/mock/factories';
import { useAuthStore } from '@/stores/authStore';
import type { PageParams } from '@/types/common';
import { asNumber, asText, formatPercent } from '@/utils/format';
import { getUserFactoryIds } from '@/utils/permission';
import { queryKeys } from '@/utils/queryKeys';
import { actionFormSchema } from '@/validators/workflow';
import { managementPageConfigs } from './pageConfigs';
import type { ManagementPageKey, PageAction, PageColumn, RowRecord } from './types';

type ManagementPageProps = {
  pageKey: ManagementPageKey;
};

function renderCell(column: PageColumn, value: unknown) {
  if (column.kind === 'status') return <StatusTag status={asText(value)} />;
  if (column.kind === 'money') return <MoneyText value={asNumber(value)} />;
  if (column.kind === 'percent') return asNumber(value) ? formatPercent(asNumber(value)) : '-';
  if (column.kind === 'list') return <Tag color="blue">{asText(value)}</Tag>;
  return asText(value);
}

function buildSearchColumns(statusSearch?: boolean): ProColumns<RowRecord>[] {
  const statusOptions = Object.entries(statusTextMap).map(([value, label]) => ({ value, label }));
  return [
    { title: '关键字', dataIndex: 'keyword', hideInTable: true, valueType: 'text' },
    {
      title: '厂区',
      dataIndex: 'factoryId',
      hideInTable: true,
      valueType: 'select',
      fieldProps: { options: factoryOptions, allowClear: true },
    },
    ...(statusSearch
      ? [
          {
            title: '状态',
            dataIndex: 'status',
            hideInTable: true,
            valueType: 'select' as const,
            fieldProps: { options: statusOptions, allowClear: true, showSearch: true },
          },
        ]
      : []),
  ];
}

function normalizeSearch(
  values: Partial<Record<'keyword' | 'factoryId' | 'status', unknown>>,
): Pick<PageParams, 'keyword' | 'factoryId' | 'status'> {
  return {
    keyword: typeof values.keyword === 'string' ? values.keyword : undefined,
    factoryId: typeof values.factoryId === 'string' ? values.factoryId : undefined,
    status: typeof values.status === 'string' ? values.status : undefined,
  };
}

const syncColumns: ColumnsType<RowRecord> = [
  { title: '业务编码', dataIndex: 'bizCode', width: 170 },
  { title: '业务类型', dataIndex: 'bizType', width: 120 },
  { title: '方向', dataIndex: 'direction', width: 90, render: (value) => <StatusTag status={asText(value)} /> },
  { title: '状态', dataIndex: 'status', width: 90, render: (value) => <StatusTag status={asText(value)} /> },
  { title: '摘要', dataIndex: 'summary', width: 260 },
  { title: '时间', dataIndex: 'createdAt', width: 150 },
];

const mappingColumns: ColumnsType<RowRecord> = [
  { title: '来源字段', dataIndex: 'sourceField', width: 140 },
  { title: '目标字段', dataIndex: 'targetField', width: 140 },
  { title: '说明', dataIndex: 'description', width: 220 },
  { title: '必填', dataIndex: 'required', width: 80, render: (value) => (value ? '是' : '否') },
];

export function ManagementPage({ pageKey }: ManagementPageProps) {
  const config = managementPageConfigs[pageKey];
  const user = useAuthStore((state) => state.user);
  const factoryIds = getUserFactoryIds(user);
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [params, setParams] = useState<PageParams>({ pageNum: 1, pageSize: 10 });
  const [detailRecord, setDetailRecord] = useState<RowRecord>();
  const [currentAction, setCurrentAction] = useState<PageAction>();
  const integrationSystem = config.key.startsWith('integrations.') ? config.key.split('.')[1] : undefined;

  const scopedParams = useMemo<PageParams>(
    () => ({ ...params, factoryIds }),
    [params, factoryIds],
  );

  const { data, isFetching, refetch } = useQuery({
    queryKey: queryKeys.page(config.apiPath, scopedParams),
    queryFn: () => getPage<RowRecord>(config.apiPath, scopedParams),
  });

  const integrationParams = useMemo<PageParams>(
    () => ({ pageNum: 1, pageSize: 6, factoryIds, system: integrationSystem }),
    [factoryIds, integrationSystem],
  );

  const syncQuery = useQuery({
    queryKey: queryKeys.page('/integrations/sync', integrationParams),
    queryFn: () => getPage<RowRecord>('/integrations/sync', integrationParams),
    enabled: Boolean(integrationSystem),
  });

  const mappingQuery = useQuery({
    queryKey: queryKeys.page('/integrations/fields', integrationParams),
    queryFn: () => getPage<RowRecord>('/integrations/fields', integrationParams),
    enabled: Boolean(integrationSystem),
  });

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => submitAction(`${config.apiPath}/action`, payload),
    onSuccess: () => {
      void message.success('操作已模拟提交');
      void queryClient.invalidateQueries({ queryKey: ['page', config.apiPath] });
    },
  });

  const columns = useMemo<ProColumns<RowRecord>[]>(() => {
    const tableColumns = config.columns.map<ProColumns<RowRecord>>((column) => ({
      title: column.title,
      dataIndex: column.dataIndex,
      width: column.width,
      ellipsis: true,
      search: false,
      render: (_, record) => renderCell(column, record[column.dataIndex]),
    }));

    return [
      ...buildSearchColumns(config.statusSearch),
      ...tableColumns,
      {
        title: '操作',
        valueType: 'option',
        fixed: 'right',
        width: 220,
        render: (_, record) => (
          <Space size={4} wrap>
            {config.actions.map((action) =>
              action.key === 'view' ? (
                <PermissionButton
                  key={action.key}
                  permission={action.permission}
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => setDetailRecord(record)}
                >
                  {action.label}
                </PermissionButton>
              ) : (
                <PermissionButton
                  key={action.key}
                  permission={action.permission}
                  size="small"
                  type={action.primary ? 'primary' : 'default'}
                  danger={action.danger}
                  icon={<FormOutlined />}
                  onClick={() => setCurrentAction(action)}
                >
                  {action.label}
                </PermissionButton>
              ),
            )}
          </Space>
        ),
      },
    ];
  }, [config]);

  const total = data?.total ?? 0;
  const currentList = data?.list ?? [];
  const pendingCount = currentList.filter((item) => item.status === 'pending').length;
  const warningCount = currentList.filter((item) =>
    ['low_stock', 'difference', 'failed', 'warning'].includes(asText(item.status ?? item.state ?? item.alertType)),
  ).length;

  return (
    <AppPageContainer
      title={config.title}
      subTitle={config.subTitle}
      extra={
        <Space wrap>
          <PermissionButton
            permission={config.editPermission}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCurrentAction({ key: 'create', label: '新增记录', permission: config.editPermission })}
          >
            新增
          </PermissionButton>
          <PermissionButton icon={<ReloadOutlined />} onClick={() => void refetch()}>
            刷新
          </PermissionButton>
        </Space>
      }
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div className="dashboard-grid">
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="当前模块记录" value={total} suffix="条" />
          </Card>
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="当前页待审批" value={pendingCount} suffix="条" />
          </Card>
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="预警/异常" value={warningCount} suffix="条" />
          </Card>
          <Card className="dashboard-span-3 metric-card">
            <Statistic title="需求覆盖" value={config.coverage.length} suffix="项" />
          </Card>
        </div>

        <ProTable<RowRecord>
          rowKey="id"
          cardBordered
          columns={columns}
          dataSource={currentList}
          loading={isFetching}
          search={{ labelWidth: 'auto', defaultCollapsed: false }}
          options={false}
          scroll={{ x: config.columns.reduce((sum, column) => sum + (column.width ?? 120), 260) }}
          pagination={{
            current: params.pageNum,
            pageSize: params.pageSize,
            total,
            showSizeChanger: true,
            onChange: (pageNum, pageSize) => setParams((prev) => ({ ...prev, pageNum, pageSize })),
          }}
          onSubmit={(values) =>
            setParams((prev) => ({
              ...prev,
              ...normalizeSearch(values),
              pageNum: 1,
            }))
          }
          onReset={() => setParams({ pageNum: 1, pageSize: params.pageSize })}
          toolBarRender={() => config.coverage.map((item) => <Tag key={item} color="blue">{item}</Tag>)}
        />

        {integrationSystem ? (
          <div className="dashboard-grid">
            <Card title="同步记录" className="dashboard-span-8">
              <Table<RowRecord>
                rowKey="id"
                size="small"
                columns={syncColumns}
                dataSource={syncQuery.data?.list ?? []}
                loading={syncQuery.isFetching}
                pagination={false}
                scroll={{ x: 890 }}
              />
            </Card>
            <Card title="字段映射" className="dashboard-span-4">
              <Table<RowRecord>
                rowKey="id"
                size="small"
                columns={mappingColumns}
                dataSource={mappingQuery.data?.list ?? []}
                loading={mappingQuery.isFetching}
                pagination={false}
                scroll={{ x: 580 }}
              />
            </Card>
          </div>
        ) : null}
      </Space>

      <Drawer
        title="记录详情"
        open={Boolean(detailRecord)}
        onClose={() => setDetailRecord(undefined)}
        width={720}
        destroyOnClose
      >
        <Descriptions
          bordered
          column={2}
          items={config.columns.map((column) => ({
            key: column.dataIndex,
            label: column.title,
            children: detailRecord ? renderCell(column, detailRecord[column.dataIndex]) : '-',
          }))}
        />
      </Drawer>

      <ModalForm<Record<string, unknown>>
        title={currentAction?.label ?? '模拟操作'}
        open={Boolean(currentAction)}
        modalProps={{ destroyOnHidden: true, onCancel: () => setCurrentAction(undefined) }}
        initialValues={{ title: currentAction?.label, owner: user?.name }}
        onFinish={async (values) => {
          // 表单提交前统一用 Zod 做演示校验，避免静态 Demo 里出现无约束的无效业务数据。
          const validation = actionFormSchema.safeParse(values);
          if (!validation.success) {
            void message.error(validation.error.issues[0]?.message ?? '表单校验未通过');
            return false;
          }
          await mutation.mutateAsync({ ...values, actionKey: currentAction?.key, pageKey: config.key });
          setCurrentAction(undefined);
          return true;
        }}
      >
        <ProFormText name="title" label="业务标题" rules={[{ required: true, message: '请输入业务标题' }]} />
        <ProFormSelect
          name="owner"
          label="责任人"
          options={['张敏', '李强', '王磊', '陈工', '赵芳', '刘总'].map((name) => ({ label: name, value: name }))}
          rules={[{ required: true, message: '请选择责任人' }]}
        />
        <ProFormTextArea
          name="reason"
          label="业务原因"
          fieldProps={{ rows: 4, maxLength: 200, showCount: true }}
          rules={[{ required: true, message: '请填写业务原因' }]}
        />
      </ModalForm>
    </AppPageContainer>
  );
}
