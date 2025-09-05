export interface TargetConfig {
  format: TargetFormat;
  paths: string[];
}

export enum TargetFormat {
  Csv = 'csv',
  Json = 'json',
  Html = 'html',
  Yaml = 'yaml',
  Xml = 'xml',
}
