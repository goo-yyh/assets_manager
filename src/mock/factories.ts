import type { OrgNode } from '@/types/system';

export const factories = [
  { id: 'fac-nb', name: '浙江宁波压铸工厂', manager: '沈华' },
  { id: 'fac-sz', name: '浙江台州冲压工厂', manager: '周伟' },
  { id: 'fac-cq', name: '浙江嘉兴总装配套厂', manager: '许明' },
  { id: 'fac-ah', name: '浙江湖州新能源零部件工厂', manager: '陈远' },
];

export const workshops = [
  { id: 'ws-nb-dc', factoryId: 'fac-nb', name: '铝合金压铸车间', manager: '罗成' },
  { id: 'ws-nb-cnc', factoryId: 'fac-nb', name: 'CNC 精加工车间', manager: '吴刚' },
  { id: 'ws-sz-st', factoryId: 'fac-sz', name: '冲压成型车间', manager: '郑洁' },
  { id: 'ws-sz-qc', factoryId: 'fac-sz', name: '质量检测中心', manager: '胡晓峰' },
  { id: 'ws-cq-as', factoryId: 'fac-cq', name: '焊接总成车间', manager: '马俊' },
  { id: 'ws-ah-bt', factoryId: 'fac-ah', name: '电池托盘产线车间', manager: '高宁' },
];

export const lines = [
  { id: 'line-nb-dc-01', workshopId: 'ws-nb-dc', name: '电机壳体压铸线', manager: '林峰', assetCount: 260 },
  { id: 'line-nb-cnc-02', workshopId: 'ws-nb-cnc', name: '五轴精加工线', manager: '叶斌', assetCount: 222 },
  { id: 'line-sz-st-01', workshopId: 'ws-sz-st', name: '底盘结构件冲压线', manager: '邵强', assetCount: 246 },
  { id: 'line-sz-qc-01', workshopId: 'ws-sz-qc', name: '三坐标检测线', manager: '孙璐', assetCount: 180 },
  { id: 'line-cq-as-01', workshopId: 'ws-cq-as', name: '机器人焊接线', manager: '唐伟', assetCount: 388 },
  { id: 'line-ah-bt-01', workshopId: 'ws-ah-bt', name: '电池托盘激光焊接线', manager: '何杰', assetCount: 386 },
];

function sumAssetCount(nodes: OrgNode[]): number {
  return nodes.reduce((total, node) => total + node.assetCount, 0);
}

const factoryChildren = factories.map((factory) => {
  const workshopChildren = workshops
    .filter((workshop) => workshop.factoryId === factory.id)
    .map((workshop) => {
      const lineChildren = lines
        .filter((line) => line.workshopId === workshop.id)
        .map((line) => ({
          id: line.id,
          parentId: workshop.id,
          name: line.name,
          type: 'line' as const,
          manager: line.manager,
          assetCount: line.assetCount,
        }));
      return {
        id: workshop.id,
        parentId: factory.id,
        name: workshop.name,
        type: 'workshop' as const,
        manager: workshop.manager,
        assetCount: sumAssetCount(lineChildren),
        children: lineChildren,
      };
    });
  return {
    id: factory.id,
    parentId: 'group',
    name: factory.name,
    type: 'factory' as const,
    manager: factory.manager,
    assetCount: sumAssetCount(workshopChildren),
    children: workshopChildren,
  };
});

export const organizationTree: OrgNode[] = [
  {
    id: 'group',
    name: '震裕科技集团',
    type: 'group',
    manager: '刘建华',
    assetCount: sumAssetCount(factoryChildren),
    children: factoryChildren,
  },
];

export const factoryNameMap = Object.fromEntries(factories.map((factory) => [factory.id, factory.name]));

export const factoryOptions = factories.map((factory) => ({
  label: factory.name,
  value: factory.id,
}));
