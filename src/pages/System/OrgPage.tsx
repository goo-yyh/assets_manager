import { useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { App, Card, Space, Table, Tree } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createRecord, deleteRecord, getPage, updateRecord } from '@/api/modules/common';
import type { MutationResult } from '@/api/types';
import { AppPageContainer } from '@/components/AppPageContainer';
import { PermissionButton } from '@/components/PermissionButton';
import type { OrgNode } from '@/types/system';
import { queryKeys } from '@/utils/queryKeys';

type OrgRow = Record<string, unknown> & OrgNode;

type OrgMutationPayload = {
  mode: 'create' | 'edit' | 'delete';
  id?: string;
  values?: Record<string, unknown>;
};

const orgTypeOptions = [
  { label: '集团', value: 'group' },
  { label: '厂区', value: 'factory' },
  { label: '车间', value: 'workshop' },
  { label: '产线', value: 'line' },
  { label: '部门', value: 'department' },
];

const orgSchema = z.object({
  name: z.string().min(2, '组织名称至少 2 个字符'),
  type: z.enum(['group', 'factory', 'workshop', 'line', 'department']),
  manager: z.string().min(2, '负责人至少 2 个字符'),
  assetCount: z.coerce.number().min(0, '资产数量不能小于 0'),
  parentId: z.string().optional(),
});

function buildTree(rows: OrgRow[]): DataNode[] {
  const nodeMap = new Map<string, DataNode>();
  rows.forEach((row) => {
    nodeMap.set(row.id, { title: `${row.name}（${row.assetCount}）`, key: row.id, children: [] });
  });

  const roots: DataNode[] = [];
  rows.forEach((row) => {
    const node = nodeMap.get(row.id);
    if (!node) return;
    if (row.parentId && nodeMap.has(row.parentId)) {
      const parent = nodeMap.get(row.parentId);
      parent?.children?.push(node);
      return;
    }
    roots.push(node);
  });

  return roots;
}

function parentOptions(rows: OrgRow[], currentId?: string) {
  return rows
    .filter((row) => row.id !== currentId)
    .map((row) => ({ label: row.name, value: row.id }));
}

function initialValues(row?: OrgRow): Record<string, unknown> {
  return {
    name: row?.name ?? '新增组织',
    type: row?.type ?? 'department',
    manager: row?.manager ?? '组织负责人',
    assetCount: row?.assetCount ?? 0,
    parentId: row?.parentId ?? 'group',
  };
}

export default function OrgPage() {
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const [editingRow, setEditingRow] = useState<OrgRow>();
  const [creating, setCreating] = useState(false);
  const params = { pageNum: 1, pageSize: 200 };

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.page('/system/orgs', params),
    queryFn: () => getPage<OrgRow>('/system/orgs', params),
  });

  const rows = useMemo(() => data?.list ?? [], [data?.list]);
  const treeData = useMemo(() => buildTree(rows), [rows]);
  const expandedKeys = useMemo(() => rows.map((row) => row.id), [rows]);

  const mutation = useMutation<MutationResult<OrgRow>, Error, OrgMutationPayload>({
    mutationFn: ({ mode, id, values }) => {
      if (mode === 'delete' && id) return deleteRecord<OrgRow>('/system/orgs', id);
      if (mode === 'edit' && id) return updateRecord<OrgRow>('/system/orgs', id, values ?? {});
      return createRecord<OrgRow>('/system/orgs', values ?? {});
    },
    onSuccess: (result) => {
      void message.success(result.message);
      void queryClient.invalidateQueries({ queryKey: ['page', '/system/orgs'] });
    },
  });

  const columns: ColumnsType<OrgRow> = [
    { title: '组织名称', dataIndex: 'name', width: 220 },
    { title: '组织类型', dataIndex: 'type', width: 110 },
    { title: '负责人', dataIndex: 'manager', width: 120 },
    { title: '资产数量', dataIndex: 'assetCount', width: 100 },
    { title: '上级组织', dataIndex: 'parentId', width: 140, render: (value) => rows.find((row) => row.id === value)?.name ?? '集团根节点' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, row) => (
        <Space size={6} wrap={false}>
          <PermissionButton permission="system:org" size="small" icon={<EditOutlined />} onClick={() => setEditingRow(row)}>
            编辑
          </PermissionButton>
          <PermissionButton
            permission="system:org"
            size="small"
            danger
            icon={<DeleteOutlined />}
            disabled={row.id === 'group'}
            onClick={() => {
              modal.confirm({
                title: '确认删除组织？',
                content: '删除后组织明细和组织树会立即刷新。',
                okText: '删除',
                okButtonProps: { danger: true },
                cancelText: '取消',
                onOk: async () => mutation.mutateAsync({ mode: 'delete', id: row.id }),
              });
            }}
          >
            删除
          </PermissionButton>
        </Space>
      ),
    },
  ];

  return (
    <AppPageContainer
      title="组织架构"
      subTitle="集团、厂区、车间、产线多层级组织与资产数据范围。"
      extra={
        <PermissionButton permission="system:org" type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
          新增
        </PermissionButton>
      }
    >
      <div className="dashboard-grid">
        <Card title="组织树" className="dashboard-span-4">
          <Tree expandedKeys={expandedKeys} autoExpandParent treeData={treeData} />
        </Card>
        <Card title="组织明细" className="dashboard-span-8">
          <Table<OrgRow>
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={isFetching}
            pagination={false}
            scroll={{ x: 840 }}
          />
        </Card>
      </div>

      <ModalForm<Record<string, unknown>>
        key={editingRow?.id ?? (creating ? 'create' : 'closed')}
        title={editingRow ? '编辑组织' : '新增组织'}
        open={creating || Boolean(editingRow)}
        initialValues={initialValues(editingRow)}
        modalProps={{
          destroyOnHidden: true,
          onCancel: () => {
            setCreating(false);
            setEditingRow(undefined);
          },
        }}
        onFinish={async (values) => {
          const validation = orgSchema.safeParse(values);
          if (!validation.success) {
            void message.error(validation.error.issues[0]?.message ?? '表单校验未通过');
            return false;
          }
          await mutation.mutateAsync({
            mode: editingRow ? 'edit' : 'create',
            id: editingRow?.id,
            values: validation.data,
          });
          setCreating(false);
          setEditingRow(undefined);
          return true;
        }}
      >
        <ProFormText name="name" label="组织名称" rules={[{ required: true, message: '请输入组织名称' }]} />
        <ProFormSelect name="type" label="组织类型" options={orgTypeOptions} rules={[{ required: true, message: '请选择组织类型' }]} />
        <ProFormSelect name="parentId" label="上级组织" options={parentOptions(rows, editingRow?.id)} allowClear />
        <ProFormText name="manager" label="负责人" rules={[{ required: true, message: '请输入负责人' }]} />
        <ProFormDigit name="assetCount" label="资产数量" min={0} />
      </ModalForm>
    </AppPageContainer>
  );
}
