interface StringMap {
  [key: string]: string;
}

export default interface Project {
  id: string;
  endpoint: string;
  measureRequestDetails: boolean;
  measureLighthouseDetails: boolean;
  measureHealth: boolean;
  headers: StringMap;
  timeout: number; // in MS
  method: 'GET' | 'POST';

  stats: {
    uptime: number;
    downtime: number;
    bodySize: number;
    errors: number;
    meanResponse: number;
  };
}
