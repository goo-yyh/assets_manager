import type { MetricItem } from './common';
import type { SpareAlert } from './spare';

export type ChartDatum = {
  name: string;
  value: number;
  extra?: number;
};

export type TrendPoint = {
  month: string;
  value: number;
  cost?: number;
};

export type TodoItem = {
  id: string;
  title: string;
  module: string;
  owner: string;
  dueAt: string;
  factoryId: string;
};

export type DashboardData = {
  metrics: MetricItem[];
  todos: TodoItem[];
  statusDistribution: ChartDatum[];
  factoryValue: ChartDatum[];
  maintenanceCostTrend: TrendPoint[];
  lowStockAlerts: SpareAlert[];
};

export type AnalyticsPageData = {
  metrics: MetricItem[];
  primaryChart: ChartDatum[] | TrendPoint[];
  secondaryChart: ChartDatum[] | TrendPoint[];
  table: ChartDatum[];
};
