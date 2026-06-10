export type IntegrationState = 'online' | 'warning' | 'offline';

export type IntegrationSystem = 'mom' | 'finance' | 'project';

export type IntegrationStatus = {
  id: string;
  system: IntegrationSystem;
  systemName: string;
  state: IntegrationState;
  endpoint: string;
  syncMode: 'RESTful API' | 'MQ' | 'Excel';
  lastSyncAt: string;
  successRate: number;
  owner: string;
};

export type SyncRecord = {
  id: string;
  system: IntegrationSystem;
  bizCode: string;
  bizType: string;
  direction: 'inbound' | 'outbound';
  status: 'success' | 'fail' | 'pending';
  summary: string;
  createdAt: string;
  factoryId: string;
};

export type FieldMapping = {
  id: string;
  system: IntegrationSystem;
  sourceField: string;
  targetField: string;
  description: string;
  required: boolean;
};
