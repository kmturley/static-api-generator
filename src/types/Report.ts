export interface ReportResult {
  id: string;
  type: 'zod' | 'custom';
  passed: boolean;
  message?: string;
  details?: any;
}

export interface ReportSummary {
  startTime: number;
  endTime?: number;
  duration?: number;
  totalTasks: number;
  passed: number;
  failed: number;
  results: ReportResult[];
}
