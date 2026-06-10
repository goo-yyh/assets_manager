import { z } from 'zod';

export const spareFormSchema = z.object({
  spareName: z.string().min(2, '备件名称至少 2 个字符'),
  quantity: z.number().min(1, '数量必须大于 0'),
  reason: z.string().min(4, '请填写用途或原因'),
});

export type SpareFormValues = z.infer<typeof spareFormSchema>;
