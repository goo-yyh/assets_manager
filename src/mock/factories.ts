import type { OrgNode } from '@/types/system';

export const factories = [
  { id: 'fac-nb', name: '浙江宁波压铸工厂' },
  { id: 'fac-sz', name: '浙江台州冲压工厂' },
  { id: 'fac-cq', name: '浙江嘉兴总装配套厂' },
  { id: 'fac-ah', name: '浙江湖州新能源零部件工厂' },
];

export const workshops = [
  { id: 'ws-nb-dc', factoryId: 'fac-nb', name: '铝合金压铸车间' },
  { id: 'ws-nb-cnc', factoryId: 'fac-nb', name: 'CNC 精加工车间' },
  { id: 'ws-sz-st', factoryId: 'fac-sz', name: '冲压成型车间' },
  { id: 'ws-sz-qc', factoryId: 'fac-sz', name: '质量检测中心' },
  { id: 'ws-cq-as', factoryId: 'fac-cq', name: '焊接总成车间' },
  { id: 'ws-ah-bt', factoryId: 'fac-ah', name: '电池托盘产线车间' },
];

export const lines = [
  { id: 'line-nb-dc-01', workshopId: 'ws-nb-dc', name: '电机壳体压铸线' },
  { id: 'line-nb-cnc-02', workshopId: 'ws-nb-cnc', name: '五轴精加工线' },
  { id: 'line-sz-st-01', workshopId: 'ws-sz-st', name: '底盘结构件冲压线' },
  { id: 'line-sz-qc-01', workshopId: 'ws-sz-qc', name: '三坐标检测线' },
  { id: 'line-cq-as-01', workshopId: 'ws-cq-as', name: '机器人焊接线' },
  { id: 'line-ah-bt-01', workshopId: 'ws-ah-bt', name: '电池托盘激光焊接线' },
];

export const organizationTree: OrgNode[] = [
  {
    id: 'group',
    name: '震裕科技集团',
    type: 'group',
    manager: '刘总',
    assetCount: 1682,
    children: factories.map((factory) => ({
      id: factory.id,
      parentId: 'group',
      name: factory.name,
      type: 'factory',
      manager: factory.id === 'fac-nb' ? '沈华' : factory.id === 'fac-sz' ? '周伟' : '许明',
      assetCount: factory.id === 'fac-nb' ? 482 : factory.id === 'fac-sz' ? 426 : 388,
      children: workshops
        .filter((workshop) => workshop.factoryId === factory.id)
        .map((workshop) => ({
          id: workshop.id,
          parentId: factory.id,
          name: workshop.name,
          type: 'workshop',
          manager: '车间主管',
          assetCount: 120,
          children: lines
            .filter((line) => line.workshopId === workshop.id)
            .map((line) => ({
              id: line.id,
              parentId: workshop.id,
              name: line.name,
              type: 'line',
              manager: '产线班长',
              assetCount: 32,
            })),
        })),
    })),
  },
];

export const factoryNameMap = Object.fromEntries(factories.map((factory) => [factory.id, factory.name]));

export const factoryOptions = factories.map((factory) => ({
  label: factory.name,
  value: factory.id,
}));
