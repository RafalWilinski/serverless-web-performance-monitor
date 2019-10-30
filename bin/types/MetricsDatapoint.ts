export default interface MetricsDatapoint {
    id: string;
    date: string;
    value: number;
    metricName: string;
    unit: string;
}