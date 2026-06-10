export type ApiResponse<T> = {
  code: 0;
  message: 'success';
  data: T;
};

export type PageResult<T> = {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
};

export type PageParams = {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  factoryId?: string;
  factoryIds?: string[];
  system?: string;
};

export type MetricItem = {
  title: string;
  value: number;
  unit?: string;
  precision?: number;
  trend?: string;
  status?: 'normal' | 'warning' | 'danger' | 'processing';
};

export type SelectOption = {
  label: string;
  value: string;
};

export type DictionaryRecord = Record<string, string>;
