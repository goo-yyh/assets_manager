import { z } from 'zod';

export const actionFormSchema = z.object({
  title: z.string().min(2, '请输入至少 2 个字符'),
  reason: z.string().min(4, '请补充业务原因，至少 4 个字符'),
  owner: z.string().min(2, '请选择或输入责任人'),
});

export const approvalSchema = z.object({
  approvalResult: z.enum(['approved', 'rejected']),
  comment: z.string().min(2, '请填写审批意见'),
});

export type ActionFormValues = z.infer<typeof actionFormSchema>;
export type ApprovalValues = z.infer<typeof approvalSchema>;
