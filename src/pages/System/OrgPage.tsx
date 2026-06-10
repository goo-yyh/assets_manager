import { Card, Space, Table, Tree } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { useQuery } from '@tanstack/react-query';
import { getPage } from '@/api/modules/common';
import { AppPageContainer } from '@/components/AppPageContainer';
import { organizationTree } from '@/mock/factories';
import type { OrgNode } from '@/types/system';
import { queryKeys } from '@/utils/queryKeys';

type OrgRow = Record<string, unknown> & OrgNode;

const columns: ColumnsType<OrgRow> = [
  { title: '组织名称', dataIndex: 'name', width: 220 },
  { title: '组织类型', dataIndex: 'type', width: 120 },
  { title: '负责人', dataIndex: 'manager', width: 120 },
  { title: '资产数量', dataIndex: 'assetCount', width: 100 },
  { title: '上级组织', dataIndex: 'parentId', width: 140, render: (value) => String(value ?? '集团根节点') },
];

function toTreeData(nodes: OrgNode[]): DataNode[] {
  return nodes.map((node) => ({
    title: `${node.name}（${node.assetCount}）`,
    key: node.id,
    children: node.children ? toTreeData(node.children) : undefined,
  }));
}

export default function OrgPage() {
  const { data, isFetching } = useQuery({
    queryKey: queryKeys.page('/system/orgs', { pageNum: 1, pageSize: 50 }),
    queryFn: () => getPage<OrgRow>('/system/orgs', { pageNum: 1, pageSize: 50 }),
  });

  return (
    <AppPageContainer title="组织架构" subTitle="集团、厂区、车间、产线多层级组织与资产数据范围。">
      <div className="dashboard-grid">
        <Card title="组织树" className="dashboard-span-4">
          <Tree defaultExpandAll treeData={toTreeData(organizationTree)} />
        </Card>
        <Card title="组织明细" className="dashboard-span-8">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Table<OrgRow>
              rowKey="id"
              columns={columns}
              dataSource={data?.list ?? []}
              loading={isFetching}
              pagination={false}
              scroll={{ x: 720 }}
            />
          </Space>
        </Card>
      </div>
    </AppPageContainer>
  );
}
