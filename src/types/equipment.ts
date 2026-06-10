export type AttachmentType = 'acceptance' | 'contract' | 'certificate' | 'image' | 'technical';

export type Attachment = {
  id: string;
  fileName: string;
  type: AttachmentType;
  uploader: string;
  uploadedAt: string;
  size: string;
};

export type EquipmentChangeRecord = {
  id: string;
  changedAt: string;
  changedBy: string;
  content: string;
};

export type EquipmentFile = {
  id: string;
  assetId: string;
  assetCode: string;
  equipmentName: string;
  model: string;
  manufacturer: string;
  factoryId: string;
  factoryName: string;
  technicalParams: Record<string, string>;
  acceptanceDocs: Attachment[];
  contractDocs: Attachment[];
  certificates: Attachment[];
  images: Attachment[];
  completionRate: number;
  latestChangedAt: string;
  changeRecords: EquipmentChangeRecord[];
};

export type AttachmentRow = Attachment & {
  assetCode: string;
  equipmentName: string;
  factoryId: string;
  factoryName: string;
};
