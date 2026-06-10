import { z } from 'zod';

export const assetFormSchema = z.object({
  assetName: z.string().min(2, '资产名称至少 2 个字符'),
  factoryId: z.string().min(1, '请选择厂区'),
  reason: z.string().min(4, '请填写业务原因'),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
