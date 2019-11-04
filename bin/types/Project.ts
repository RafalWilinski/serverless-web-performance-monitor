interface StringMap {
  [key: string]: string;
}

export default interface Project {
  id: string;
  endpoint: string;
  name: string;
  measureRequestDetails: boolean;
  measureLighthouseDetails: boolean;
  headers: StringMap;
  timeout: number; // in MS
  method: 'get' | 'post';

  stats: {
    uptime: number;
    downtime: number;
    bodySize: number;
    errors: number;
    meanResponse: number;
  };
}
