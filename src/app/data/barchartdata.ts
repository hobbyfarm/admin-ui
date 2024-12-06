import { ChartData } from 'chart.js';

export interface BarChartData extends ChartData<'bar', number[], string> {
  labels: string[];
}
