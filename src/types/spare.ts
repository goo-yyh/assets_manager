import type { ApprovalStatus } from './asset';

export type SpareStatus = 'normal' | 'low_stock' | 'over_stock' | 'inactive';

export type SparePart = {
  id: string;
  spareCode: string;
  name: string;
  category: string;
  spec: string;
  unit: string;
  brand: string;
  factoryId: string;
  factoryName: string;
  warehouseId: string;
  warehouseName: string;
  locationCode: string;
  stockQty: number;
  safetyStock: number;
  minStock: number;
  status: SpareStatus;
  applicableAssetCodes: string[];
  lastUsedAt: string;
};

export type SpareBillStatus = 'draft' | 'pending' | 'approved' | 'completed';
export type InboundType = 'purchase' | 'return' | 'profit';
export type OutboundType = 'repair' | 'maintenance' | 'transfer' | 'loss';

export type SpareInboundRecord = {
  id: string;
  billCode: string;
  inboundType: InboundType;
  spareCode: string;
  spareName: string;
  quantity: number;
  factoryId: string;
  factoryName: string;
  warehouseName: string;
  sourceBill: string;
  operator: string;
  status: SpareBillStatus;
  createdAt: string;
};

export type SpareOutboundRecord = {
  id: string;
  billCode: string;
  outboundType: OutboundType;
  spareCode: string;
  spareName: string;
  quantity: number;
  relatedAssetCode: string;
  purpose: string;
  receiver: string;
  status: ApprovalStatus;
  createdAt: string;
  factoryId: string;
  factoryName: string;
};

export type SpareInventoryPlan = {
  id: string;
  planCode: string;
  planName: string;
  factoryId: string;
  factoryName: string;
  warehouseName: string;
  expectedQty: number;
  actualQty: number;
  diffQty: number;
  status: SpareBillStatus;
  owner: string;
  deadline: string;
};

export type SpareAlert = {
  id: string;
  alertType: SpareStatus;
  spareCode: string;
  spareName: string;
  factoryId: string;
  factoryName: string;
  warehouseName: string;
  currentQty: number;
  safetyStock: number;
  suggestion: string;
  createdAt: string;
};
