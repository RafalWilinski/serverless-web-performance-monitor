export default interface MetricsDatapoint {
  id: string;
  date: string;
  region: string;
  value: number;
  metricName: string;
  unit: string;
}
