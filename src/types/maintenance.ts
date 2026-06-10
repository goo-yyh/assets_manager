export type RuntimeState = 'running' | 'stopped' | 'fault';

export type MomRuntimeRecord = {
  id: string;
  assetCode: string;
  equipmentName: string;
  factoryId: string;
  factoryName: string;
  lineName: string;
  state: RuntimeState;
  oee: number;
  updatedAt: string;
};

export type OeePoint = {
  month: string;
  oee: number;
  faultRate: number;
  downtimeHours: number;
};

export type RepairRecord = {
  id: string;
  workOrder: string;
  assetCode: string;
  equipmentName: string;
  faultReason: string;
  solution: string;
  cost: number;
  repairedBy: string;
  closedAt: string;
  factoryId: string;
};

export type MaintenanceRecord = {
  id: string;
  workOrder: string;
  assetCode: string;
  equipmentName: string;
  content: string;
  replacedSpares: string;
  maintainedBy: string;
  maintainedAt: string;
  factoryId: string;
};

export type FaultAlert = {
  id: string;
  assetCode: string;
  equipmentName: string;
  level: 'warning' | 'critical';
  message: string;
  factoryId: string;
  factoryName: string;
  createdAt: string;
};
