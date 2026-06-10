export function formatMoney(value?: number): string {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatWanYuan(value?: number): string {
  if (typeof value !== 'number') return '-';
  return `${(value / 10000).toLocaleString('zh-CN', { maximumFractionDigits: 1 })} 万`;
}

export function formatPercent(value?: number, precision = 1): string {
  if (typeof value !== 'number') return '-';
  return `${value.toFixed(precision)}%`;
}

export function asText(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.map((item) => asText(item)).join('、');
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return `${value}`;
  if (typeof value === 'symbol') return value.description ?? '-';
  if (typeof value === 'function') return value.name || 'function';
  return '-';
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}
