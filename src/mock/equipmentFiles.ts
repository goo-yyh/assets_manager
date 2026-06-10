import type { AttachmentRow, EquipmentFile } from '@/types/equipment';

export const equipmentFiles: EquipmentFile[] = [
  {
    id: 'eq-001',
    assetId: 'asset-001',
    assetCode: 'AST-NB-DC-0001',
    equipmentName: '2800T 铝合金压铸机',
    model: 'DCC2800',
    manufacturer: '布勒压铸',
    factoryId: 'fac-nb',
    factoryName: '浙江宁波压铸工厂',
    technicalParams: {
      锁模力: '28000kN',
      最大压射速度: '9.5m/s',
      适用产品: '电机壳体、减震塔',
    },
    acceptanceDocs: [
      { id: 'att-001', fileName: '压铸机终验报告.pdf', type: 'acceptance', uploader: '张敏', uploadedAt: '2024-02-01', size: '2.8MB' },
    ],
    contractDocs: [
      { id: 'att-002', fileName: 'DCC2800采购合同.pdf', type: 'contract', uploader: '赵芳', uploadedAt: '2024-01-10', size: '5.4MB' },
    ],
    certificates: [
      { id: 'att-003', fileName: '安全联锁测试记录.pdf', type: 'certificate', uploader: '李强', uploadedAt: '2024-02-02', size: '1.1MB' },
    ],
    images: [
      { id: 'att-004', fileName: '设备铭牌照片.jpg', type: 'image', uploader: '李强', uploadedAt: '2024-02-03', size: '860KB' },
    ],
    completionRate: 96,
    latestChangedAt: '2026-05-20 14:12',
    changeRecords: [
      { id: 'chg-001', changedAt: '2026-05-20', changedBy: '李强', content: '新增压射单元保养基准参数。' },
    ],
  },
  {
    id: 'eq-002',
    assetId: 'asset-002',
    assetCode: 'AST-SZ-ST-0008',
    equipmentName: '高速冲压生产线',
    model: 'HSP-800',
    manufacturer: '济二机床',
    factoryId: 'fac-sz',
    factoryName: '浙江台州冲压工厂',
    technicalParams: {
      公称压力: '8000kN',
      行程次数: '35spm',
      适用产品: '底盘梁、座椅横梁',
    },
    acceptanceDocs: [
      { id: 'att-005', fileName: '冲压线试运行报告.pdf', type: 'acceptance', uploader: '李强', uploadedAt: '2023-05-30', size: '3.3MB' },
    ],
    contractDocs: [
      { id: 'att-006', fileName: '高速冲压线技术协议.pdf', type: 'contract', uploader: '赵芳', uploadedAt: '2023-04-08', size: '4.2MB' },
    ],
    certificates: [
      { id: 'att-007', fileName: '压力机年检证书.pdf', type: 'certificate', uploader: '李强', uploadedAt: '2026-01-16', size: '900KB' },
    ],
    images: [
      { id: 'att-008', fileName: '冲压线安装位置图.png', type: 'image', uploader: '李强', uploadedAt: '2023-06-01', size: '1.4MB' },
    ],
    completionRate: 88,
    latestChangedAt: '2026-06-01 10:08',
    changeRecords: [
      { id: 'chg-002', changedAt: '2026-06-01', changedBy: '李强', content: '更新送料机伺服参数。' },
    ],
  },
  {
    id: 'eq-003',
    assetId: 'asset-003',
    assetCode: 'AST-AH-BT-0012',
    equipmentName: '电池托盘激光焊接工作站',
    model: 'LW-6000',
    manufacturer: '大族激光',
    factoryId: 'fac-ah',
    factoryName: '浙江湖州新能源零部件工厂',
    technicalParams: {
      激光功率: '6000W',
      工作幅面: '3200mm x 1800mm',
      适用产品: '新能源电池托盘',
    },
    acceptanceDocs: [
      { id: 'att-009', fileName: '激光焊工作站验收单.pdf', type: 'acceptance', uploader: '王磊', uploadedAt: '2024-04-10', size: '2.1MB' },
    ],
    contractDocs: [
      { id: 'att-010', fileName: '激光器保修条款.pdf', type: 'contract', uploader: '赵芳', uploadedAt: '2024-03-28', size: '1.8MB' },
    ],
    certificates: [
      { id: 'att-011', fileName: '激光安全防护检测报告.pdf', type: 'certificate', uploader: '王磊', uploadedAt: '2024-04-15', size: '760KB' },
    ],
    images: [
      { id: 'att-012', fileName: '焊接工作站全景.jpg', type: 'image', uploader: '王磊', uploadedAt: '2024-04-16', size: '1.2MB' },
    ],
    completionRate: 94,
    latestChangedAt: '2026-06-06 11:30',
    changeRecords: [
      { id: 'chg-003', changedAt: '2026-06-06', changedBy: '王磊', content: '新增保护镜片更换记录字段。' },
    ],
  },
  {
    id: 'eq-004',
    assetId: 'asset-004',
    assetCode: 'AST-CQ-AS-0021',
    equipmentName: '底盘结构件机器人焊接线',
    model: 'RBW-12',
    manufacturer: '发那科',
    factoryId: 'fac-cq',
    factoryName: '浙江嘉兴总装配套厂',
    technicalParams: {
      机器人数量: '12台',
      焊接方式: 'MIG/MAG',
      适用产品: '底盘结构件总成',
    },
    acceptanceDocs: [
      { id: 'att-013', fileName: '机器人焊接线终验资料.pdf', type: 'acceptance', uploader: '陈工', uploadedAt: '2022-11-08', size: '4.6MB' },
    ],
    contractDocs: [
      { id: 'att-014', fileName: '机器人维护服务合同.pdf', type: 'contract', uploader: '赵芳', uploadedAt: '2022-10-20', size: '2.5MB' },
    ],
    certificates: [
      { id: 'att-015', fileName: '焊接烟尘检测报告.pdf', type: 'certificate', uploader: '陈工', uploadedAt: '2026-03-02', size: '820KB' },
    ],
    images: [
      { id: 'att-016', fileName: '机器人工作站照片.jpg', type: 'image', uploader: '陈工', uploadedAt: '2022-11-10', size: '1.6MB' },
    ],
    completionRate: 91,
    latestChangedAt: '2026-05-11 17:05',
    changeRecords: [
      { id: 'chg-004', changedAt: '2026-05-11', changedBy: '陈工', content: '更新第 6 轴减速机更换记录。' },
    ],
  },
];

export const attachmentRows: AttachmentRow[] = equipmentFiles.flatMap((file) =>
  [...file.acceptanceDocs, ...file.contractDocs, ...file.certificates, ...file.images].map((attachment) => ({
    ...attachment,
    assetCode: file.assetCode,
    equipmentName: file.equipmentName,
    factoryId: file.factoryId,
    factoryName: file.factoryName,
  })),
);
