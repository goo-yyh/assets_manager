import { useCallback, useMemo, useState } from 'react';
import { App, Card, Descriptions, Drawer, Space, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, FormOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  createRecord,
  deleteRecord,
  getPage,
  runRecordAction,
  updateRecord,
} from '@/api/modules/common';
import type { MutationResult } from '@/api/types';
import { AppPageContainer } from '@/components/AppPageContainer';
import { MoneyText } from '@/components/MoneyText';
import { PermissionButton } from '@/components/PermissionButton';
import { StatusTag } from '@/components/StatusTag';
import { allPermissions, permissionNameMap } from '@/config/permissions';
import { statusTextMap } from '@/constants/status';
import { factoryOptions } from '@/mock/factories';
import { useAuthStore } from '@/stores/authStore';
import type { PageParams } from '@/types/common';
import type { PermissionCode } from '@/types/permission';
import { asNumber, asText, formatPercent } from '@/utils/format';
import { getUserFactoryIds } from '@/utils/permission';
import { queryKeys } from '@/utils/queryKeys';
import { managementPageConfigs } from './pageConfigs';
import type { ActionContext, ManagementPageKey, PageAction, PageColumn, RowRecord } from './types';

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

type CurrentUser = {
  name: string;
  factoryName: string;
};

type MutationPayload = {
  context: ActionContext;
  values: Record<string, unknown>;
};

const statusOptions = Object.entries(statusTextMap).map(([value, label]) => ({ value, label }));

const typedOptions: Record<string, Array<{ label: string; value: string | boolean }>> = {
  factoryName: factoryOptions.map((factory) => ({ label: factory.label, value: factory.label })),
  sourceSystem: ['finance', 'project', 'manual', 'excel'].map((value) => ({ value, label: statusTextMap[value] })),
  inboundType: ['purchase', 'return', 'profit'].map((value) => ({ value, label: statusTextMap[value] })),
  outboundType: ['repair', 'maintenance', 'transfer', 'loss'].map((value) => ({ value, label: statusTextMap[value] })),
  disposalType: ['scrap', 'sale'].map((value) => ({ value, label: statusTextMap[value] })),
  financeSyncStatus: ['waiting', 'synced', 'failed'].map((value) => ({ value, label: statusTextMap[value] })),
  financeWriteOffStatus: ['pending', 'done', 'failed'].map((value) => ({ value, label: statusTextMap[value] })),
  state: ['online', 'warning', 'offline', 'running', 'stopped', 'fault'].map((value) => ({ value, label: statusTextMap[value] })),
  alertType: ['low_stock', 'over_stock', 'inactive'].map((value) => ({ value, label: statusTextMap[value] })),
  level: ['warning', 'critical'].map((value) => ({ value, label: statusTextMap[value] })),
  direction: ['inbound', 'outbound'].map((value) => ({ value, label: statusTextMap[value] })),
  required: [
    { label: '是', value: true },
    { label: '否', value: false },
  ],
  dataScope: [
    { label: '集团全部', value: '集团全部' },
    { label: '所属厂区', value: '所属厂区' },
    { label: '所属部门', value: '所属部门' },
    { label: '本人数据', value: '本人数据' },
  ],
};

const permissionOptions = allPermissions.map((permission) => ({
  label: permissionNameMap.get(permission) ?? permission,
  value: permission,
}));

function isPermissionCode(value: unknown): value is PermissionCode {
  return typeof value === 'string' && allPermissions.includes(value as PermissionCode);
}

function nowText(): string {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fieldOptions(column: PageColumn) {
  if (typedOptions[column.dataIndex]) return typedOptions[column.dataIndex];
  if (column.kind === 'status' || column.dataIndex === 'status') return statusOptions;
  return undefined;
}

function defaultText(dataIndex: string, title: string, user?: CurrentUser): string {
  const suffix = Date.now().toString().slice(-5);
  const defaults: Record<string, string> = {
    assetCode: `AST-DEMO-${suffix}`,
    assetName: '新增汽配设备',
    name: title.includes('备件') ? '新增汽配备件' : '新增汽配设备',
    equipmentName: '新增设备档案',
    spareCode: `SP-DEMO-${suffix}`,
    spareName: '新增备件',
    billCode: `BILL-${suffix}`,
    bizCode: `BIZ-${suffix}`,
    planCode: `PLAN-${suffix}`,
    planName: '新增盘点计划',
    financeAssetCode: `FA-DEMO-${suffix}`,
    projectName: '汽配产线改造项目',
    applicant: user?.name ?? '张敏',
    operator: user?.name ?? '张敏',
    uploader: user?.name ?? '张敏',
    responsiblePerson: user?.name ?? '张敏',
    owner: user?.name ?? '张敏',
    approver: '厂区负责人',
    factoryName: user?.factoryName && user.factoryName !== '震裕科技集团' ? user.factoryName : '浙江宁波压铸工厂',
    createdAt: nowText(),
    uploadedAt: nowText(),
    latestChangedAt: nowText(),
    deadline: '2026-06-30',
    fileName: '新增演示资料.pdf',
    size: '1.2MB',
    sourceBill: `SRC-${suffix}`,
  };
  return defaults[dataIndex] ?? `${title}演示值`;
}

function initialValues(columns: PageColumn[], row?: RowRecord, user?: CurrentUser): Record<string, unknown> {
  return Object.fromEntries(
    columns.map((column) => {
      const existing = row?.[column.dataIndex];
      if (existing !== undefined && existing !== null && existing !== '') return [column.dataIndex, existing];
      if (column.dataIndex === 'required') return [column.dataIndex, true];
      if (column.kind === 'number' || column.kind === 'money' || column.kind === 'percent') {
        return [column.dataIndex, column.kind === 'percent' ? 90 : 1];
      }
      if (column.dataIndex === 'status') return [column.dataIndex, 'pending'];
      if (typedOptions[column.dataIndex]?.[0]) return [column.dataIndex, typedOptions[column.dataIndex][0].value];
      return [column.dataIndex, defaultText(column.dataIndex, column.title, user)];
    }),
  );
}

function buildFormSchema(columns: PageColumn[]) {
  const shape: z.ZodRawShape = {};
  const schemaText = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.map((item) => asText(item)).join('、');
    if (typeof value === 'object') return JSON.stringify(value);
    return asText(value);
  };
  columns.forEach((column) => {
    if (column.kind === 'number' || column.kind === 'money' || column.kind === 'percent') {
      shape[column.dataIndex] = z.coerce.number().finite(`${column.title}必须是有效数字`);
      return;
    }
    if (column.dataIndex === 'required') {
      shape[column.dataIndex] = z.union([z.boolean(), z.string(), z.number()]);
      return;
    }
    shape[column.dataIndex] = z.preprocess(
      schemaText,
      z.string().min(1, `请填写${column.title}`),
    );
  });
  return z.object(shape).passthrough();
}

function isLongText(column: PageColumn): boolean {
  return ['reason', 'summary', 'suggestion', 'content', 'description', 'purpose', 'technicalParamsText'].includes(column.dataIndex) || (column.width ?? 0) >= 220;
}

function formField(column: PageColumn) {
  const options = fieldOptions(column);
  if (options) {
    return <ProFormSelect key={column.dataIndex} name={column.dataIndex} label={column.title} options={options} />;
  }
  if (column.kind === 'number' || column.kind === 'money' || column.kind === 'percent') {
    return <ProFormDigit key={column.dataIndex} name={column.dataIndex} label={column.title} min={0} />;
  }
  if (isLongText(column)) {
    return <ProFormTextArea key={column.dataIndex} name={column.dataIndex} label={column.title} fieldProps={{ rows: 3 }} />;
  }
  return <ProFormText key={column.dataIndex} name={column.dataIndex} label={column.title} />;
}

function rolePermissionField(pageKey: ManagementPageKey) {
  if (pageKey !== 'system.roles') return null;
  return (
    <ProFormSelect
      name="permissions"
      label="权限明细"
      mode="multiple"
      options={permissionOptions}
      fieldProps={{ maxTagCount: 6, showSearch: true, optionFilterProp: 'label' }}
      rules={[{ required: true, message: '请选择角色权限' }]}
    />
  );
}

function isReadOnlyPage(pageKey: ManagementPageKey): boolean {
  return pageKey === 'system.logs' || pageKey.startsWith('maintenance.') || pageKey === 'analytics.warnings' || pageKey === 'assets.map' || pageKey === 'assets.history' || pageKey === 'spares.consumption';
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
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [params, setParams] = useState<PageParams>({ pageNum: 1, pageSize: 10 });
  const [detailRecord, setDetailRecord] = useState<RowRecord>();
  const [currentAction, setCurrentAction] = useState<ActionContext>();
  const integrationKey = config.key.startsWith('integrations.') ? config.key.split('.')[1] : undefined;
  const integrationSystem = ['mom', 'finance', 'project'].includes(integrationKey ?? '') ? integrationKey : undefined;
  const effectiveActions = useMemo<PageAction[]>(() => {
    const actions = [...config.actions];
    if (config.editPermission && !isReadOnlyPage(config.key) && !actions.some((action) => action.key === 'delete')) {
      actions.push({ key: 'delete', label: '删除', permission: config.editPermission, danger: true, immediate: true });
    }
    return actions;
  }, [config]);
  const actionColumnWidth = useMemo(
    () => Math.max(180, effectiveActions.reduce((sum, action) => sum + action.label.length * 18 + 54, 16)),
    [effectiveActions],
  );
  const tableScrollX = useMemo(
    () => config.columns.reduce((sum, column) => sum + (column.width ?? 120), actionColumnWidth),
    [actionColumnWidth, config.columns],
  );

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

  const mutation = useMutation<MutationResult<RowRecord>, Error, MutationPayload>({
    mutationFn: ({ context, values }) => {
      const rowId = context.row?.id;
      if (context.action.key === 'delete' && rowId) return deleteRecord<RowRecord>(config.apiPath, rowId);
      if (context.action.key === 'edit' && rowId) return updateRecord<RowRecord>(config.apiPath, rowId, values);
      if (context.action.key === 'create' || !rowId) return createRecord<RowRecord>(config.apiPath, values);
      return runRecordAction<RowRecord>(config.apiPath, rowId, context.action.key, values);
    },
    onSuccess: (result) => {
      void message.success(result.message);
      void queryClient.invalidateQueries({ queryKey: ['page'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleAction = useCallback((action: PageAction, row: RowRecord) => {
    if (action.key === 'view') {
      setDetailRecord(row);
      return;
    }
    if (action.key === 'delete') {
      modal.confirm({
        title: '确认删除这条记录？',
        content: '删除后当前表格会立即移除该记录，并写入操作日志。',
        okText: '删除',
        okButtonProps: { danger: true },
        cancelText: '取消',
        onOk: async () => {
          await mutation.mutateAsync({ context: { action, row }, values: {} });
        },
      });
      return;
    }
    setCurrentAction({ action, row });
  }, [modal, mutation]);

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
        width: actionColumnWidth,
        className: 'management-action-column',
        render: (_, record) => (
          <div className="management-action-cell">
            {effectiveActions.map((action) =>
              action.key === 'view' ? (
                <PermissionButton
                  key={action.key}
                  permission={action.permission}
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleAction(action, record)}
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
                  onClick={() => handleAction(action, record)}
                >
                  {action.label}
                </PermissionButton>
              ),
            )}
          </div>
        ),
      },
    ];
  }, [actionColumnWidth, config, effectiveActions, handleAction]);

  const total = data?.total ?? 0;
  const currentList = data?.list ?? [];
  const pendingCount = currentList.filter((item) => item.status === 'pending').length;
  const warningCount = currentList.filter((item) =>
    ['low_stock', 'difference', 'failed', 'warning'].includes(asText(item.status ?? item.state ?? item.alertType)),
  ).length;
  const tableScroll = tableScrollX > 1120 ? { x: tableScrollX } : undefined;
  const baseInitialValues = currentAction
    ? initialValues(config.columns, currentAction.row, user ? { name: user.name, factoryName: user.factoryName } : undefined)
    : {};
  const formInitialValues = config.key === 'system.roles'
    ? { ...baseInitialValues, permissions: currentAction?.row?.permissions ?? [] }
    : baseInitialValues;

  return (
    <AppPageContainer
      title={config.title}
      subTitle={config.subTitle}
      extra={
        <Space wrap>
          {config.editPermission ? (
            <PermissionButton
              permission={config.editPermission}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCurrentAction({ action: { key: 'create', label: '新增', permission: config.editPermission } })}
            >
              新增
            </PermissionButton>
          ) : null}
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
          scroll={tableScroll}
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
        key={`${config.key}-${currentAction?.action.key ?? 'none'}-${currentAction?.row?.id ?? 'new'}`}
        title={currentAction?.action.label ?? '业务操作'}
        open={Boolean(currentAction)}
        modalProps={{ destroyOnHidden: true, onCancel: () => setCurrentAction(undefined) }}
        initialValues={formInitialValues}
        onFinish={async (values) => {
          if (!currentAction) return false;
          // 表单字段由当前表格列生成，提交前用 Zod 按列类型做校验。
          const validation = buildFormSchema(config.columns).safeParse(values);
          if (!validation.success) {
            void message.error(validation.error.issues[0]?.message ?? '表单校验未通过');
            return false;
          }
          await mutation.mutateAsync({ context: currentAction, values: validation.data });
          if (config.key === 'system.roles' && user && currentAction.row?.roleKey === user.roleKey && token) {
            const permissions = Array.isArray(validation.data.permissions)
              ? validation.data.permissions.filter(isPermissionCode)
              : user.permissions;
            setAuth(token, { ...user, permissions });
          }
          setCurrentAction(undefined);
          return true;
        }}
      >
        {config.columns.map((column) => formField(column))}
        {rolePermissionField(config.key)}
      </ModalForm>
    </AppPageContainer>
  );
}
