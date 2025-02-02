export interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map';
  title: string;
  description?: string;
  config: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  metric?: CustomMetric;
  visualization?: VisualizationConfig;
  filters?: Filter[];
  dateRange?: DateRange;
  comparison?: ComparisonConfig;
}

export interface CustomMetric {
  id: string;
  name: string;
  formula: string;
  sources: string[];
  filters?: Filter[];
  segments?: Segment[];
}

export interface VisualizationConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'table' | 'map';
  options: Record<string, any>;
}

export interface Filter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
  value: any;
}

export interface DateRange {
  start: Date;
  end: Date;
  comparison?: 'previous_period' | 'previous_year' | 'custom';
}

export interface ComparisonConfig {
  type: 'absolute' | 'percentage';
  baseline: DateRange;
}

export interface Segment {
  id: string;
  name: string;
  rules: Filter[];
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  widgets: Widget[];
  schedule?: ReportSchedule;
  format: 'pdf' | 'csv' | 'excel';
  recipients: string[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  timezone: string;
  active: boolean;
}

export interface Alert {
  id: string;
  metric: CustomMetric;
  condition: {
    operator: 'gt' | 'lt' | 'equals';
    value: number;
    duration?: number;
  };
  channels: AlertChannel[];
}

export interface AlertChannel {
  type: 'email' | 'slack' | 'webhook';
  config: Record<string, any>;
}
