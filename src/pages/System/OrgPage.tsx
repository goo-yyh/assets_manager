import { useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { App, Card, Descriptions, Space, Table, Tree, Typography } from 'antd';
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

const orgTypeText: Record<OrgNode['type'], string> = {
  group: '集团',
  factory: '厂区',
  workshop: '车间',
  line: '产线',
  department: '部门',
};

const orgSchema = z.object({
  name: z.string().min(2, '组织名称至少 2 个字符'),
  type: z.enum(['group', 'factory', 'workshop', 'line', 'department']),
  manager: z.string().min(2, '负责人至少 2 个字符'),
  assetCount: z.coerce.number().min(0, '资产数量不能小于 0'),
  parentId: z.string().optional(),
});

function nextOrgType(type?: OrgNode['type']): OrgNode['type'] {
  if (type === 'group') return 'factory';
  if (type === 'factory') return 'workshop';
  if (type === 'workshop') return 'line';
  return 'department';
}

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

function childRows(rows: OrgRow[], parentId?: string): OrgRow[] {
  return rows.filter((row) => row.parentId === parentId);
}

function childCount(rows: OrgRow[], id: string): number {
  return childRows(rows, id).length;
}

function orgPath(rows: OrgRow[], id?: string): string {
  const path: string[] = [];
  const visited = new Set<string>();
  let current = rows.find((row) => row.id === id);
  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    path.unshift(current.name);
    current = rows.find((row) => row.id === current?.parentId);
  }
  return path.join(' / ');
}

function descendantIds(rows: OrgRow[], id: string): Set<string> {
  const ids = new Set<string>();
  const walk = (parentId: string) => {
    childRows(rows, parentId).forEach((child) => {
      ids.add(child.id);
      walk(child.id);
    });
  };
  walk(id);
  return ids;
}

function parentOptions(rows: OrgRow[], currentId?: string) {
  const blockedIds = currentId ? descendantIds(rows, currentId) : new Set<string>();
  return rows
    .filter((row) => row.id !== currentId && !blockedIds.has(row.id))
    .map((row) => ({ label: row.name, value: row.id }));
}

function initialValues(row?: OrgRow, parent?: OrgRow): Record<string, unknown> {
  return {
    name: row?.name ?? '新增组织',
    type: row?.type ?? nextOrgType(parent?.type),
    manager: row?.manager ?? '组织负责人',
    assetCount: row?.assetCount ?? 0,
    parentId: row?.parentId ?? parent?.id ?? 'group',
  };
}

function createButtonText(parent?: OrgRow): string {
  const type = nextOrgType(parent?.type);
  return `新增${orgTypeText[type]}`;
}

export default function OrgPage() {
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const [editingRow, setEditingRow] = useState<OrgRow>();
  const [creating, setCreating] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('group');
  const params = { pageNum: 1, pageSize: 200 };

  const { data, isFetching } = useQuery({
    queryKey: queryKeys.page('/system/orgs', params),
    queryFn: () => getPage<OrgRow>('/system/orgs', params),
  });

  const rows = useMemo(() => data?.list ?? [], [data?.list]);
  const treeData = useMemo(() => buildTree(rows), [rows]);
  const expandedKeys = useMemo(() => rows.map((row) => row.id), [rows]);
  const selectedOrg = useMemo(
    () => rows.find((row) => row.id === selectedOrgId) ?? rows.find((row) => row.id === 'group') ?? rows[0],
    [rows, selectedOrgId],
  );
  const selectedChildren = useMemo(() => childRows(rows, selectedOrg?.id), [rows, selectedOrg?.id]);
  const selectedPath = useMemo(() => orgPath(rows, selectedOrg?.id), [rows, selectedOrg?.id]);

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
    { title: '组织类型', dataIndex: 'type', width: 110, render: (value) => orgTypeText[value as OrgNode['type']] ?? value },
    { title: '负责人', dataIndex: 'manager', width: 120 },
    { title: '直属下级', dataIndex: 'id', width: 100, render: (value) => childCount(rows, String(value)) },
    { title: '资产数量', dataIndex: 'assetCount', width: 100 },
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
            disabled={row.id === 'group' || childCount(rows, row.id) > 0}
            onClick={() => {
              modal.confirm({
                title: '确认删除组织？',
                content: '删除后组织明细和组织树会立即刷新；存在下级组织时请先调整下级归属。',
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
      extra={
        <PermissionButton permission="system:org" type="primary" icon={<PlusOutlined />} onClick={() => setCreating(true)}>
          {createButtonText(selectedOrg)}
        </PermissionButton>
      }
    >
      <div className="dashboard-grid">
        <Card title="组织树" className="dashboard-span-4">
          <Tree
            expandedKeys={expandedKeys}
            selectedKeys={selectedOrg ? [selectedOrg.id] : []}
            autoExpandParent
            blockNode
            treeData={treeData}
            onSelect={(keys) => {
              const nextKey = keys[0];
              if (typeof nextKey === 'string') setSelectedOrgId(nextKey);
            }}
          />
        </Card>
        <Card
          title="组织明细"
          className="dashboard-span-8"
          extra={<Typography.Text type="secondary">{selectedPath}</Typography.Text>}
        >
          <Descriptions
            size="small"
            column={5}
            items={[
              { key: 'name', label: '当前组织', children: selectedOrg?.name ?? '-' },
              { key: 'type', label: '组织类型', children: selectedOrg ? orgTypeText[selectedOrg.type] : '-' },
              { key: 'manager', label: '负责人', children: selectedOrg?.manager ?? '-' },
              { key: 'assetCount', label: '资产数量', children: selectedOrg?.assetCount ?? '-' },
              { key: 'children', label: '直属下级', children: selectedChildren.length },
            ]}
            style={{ marginBottom: 16 }}
          />
          <Table<OrgRow>
            rowKey="id"
            columns={columns}
            dataSource={selectedChildren}
            loading={isFetching}
            pagination={false}
            locale={{ emptyText: '当前组织暂无直属下级' }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>

      <ModalForm<Record<string, unknown>>
        key={editingRow?.id ?? (creating ? 'create' : 'closed')}
        title={editingRow ? '编辑组织' : '新增组织'}
        open={creating || Boolean(editingRow)}
        initialValues={initialValues(editingRow, selectedOrg)}
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
