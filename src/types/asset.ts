export type AssetStatus = 'in_use' | 'idle' | 'maintenance' | 'transferring' | 'disposed';

export type Asset = {
  id: string;
  assetCode: string;
  name: string;
  category: string;
  model: string;
  manufacturer: string;
  factoryId: string;
  factoryName: string;
  workshopId: string;
  workshopName: string;
  lineId: string;
  lineName: string;
  location: string;
  status: AssetStatus;
  originalValue: number;
  accumulatedDepreciation: number;
  netValue: number;
  financeAssetCode: string;
  purchaseDate: string;
  ownerDepartment: string;
  responsiblePerson: string;
  oee: number;
};

export type SourceSystem = 'finance' | 'project' | 'manual' | 'excel';
export type IntakeStatus = 'pending' | 'supplement' | 'booked';

export type AssetIntakeRecord = {
  id: string;
  billCode: string;
  assetName: string;
  sourceSystem: SourceSystem;
  projectName: string;
  financeAssetCode: string;
  status: IntakeStatus;
  createdAt: string;
  factoryId: string;
  applicant: string;
};

export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';

export type AssetTransferRecord = {
  id: string;
  bizCode: string;
  assetCode: string;
  assetName: string;
  fromFactory: string;
  toFactory: string;
  applicant: string;
  approver: string;
  financeSyncStatus: 'waiting' | 'synced' | 'failed';
  status: ApprovalStatus;
  createdAt: string;
  factoryId: string;
};

export type DisposalType = 'scrap' | 'sale';

export type AssetDisposalRecord = {
  id: string;
  bizCode: string;
  assetCode: string;
  assetName: string;
  disposalType: DisposalType;
  reason: string;
  evaluationAmount: number;
  financeWriteOffStatus: 'pending' | 'done' | 'failed';
  status: ApprovalStatus;
  createdAt: string;
  factoryId: string;
};

export type InventoryStatus = 'planned' | 'running' | 'difference' | 'completed';

export type AssetInventoryPlan = {
  id: string;
  planCode: string;
  planName: string;
  factoryId: string;
  factoryName: string;
  scope: string;
  expectedQty: number;
  checkedQty: number;
  diffQty: number;
  status: InventoryStatus;
  owner: string;
  deadline: string;
};
