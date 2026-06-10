import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

export function useECharts(option: EChartsOption) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    // 图表只在容器挂载后初始化，避免 React 首屏渲染时出现空尺寸导致图表不可见。
    const chart = echarts.init(containerRef.current);
    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [option]);

  return containerRef;
}
