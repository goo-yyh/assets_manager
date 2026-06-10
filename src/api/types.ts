export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ActionResult = {
  id: string;
  status: 'success';
  message: string;
};

export type MutationResult<T = Record<string, unknown>> = {
  record?: T;
  affected: Array<{ resource: string; id: string }>;
  message: string;
};
