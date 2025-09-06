export interface TargetConfig {
  format: TargetFormat;
  pattern: string;
  type: TargetType;
}

export enum TargetFormat {
  Csv = 'csv',
  Json = 'json',
  Html = 'html',
  Yaml = 'yaml',
  Xml = 'xml',
}

export enum TargetType {
  Collection = 'collection',
  Package = 'package',
  Registry = 'registry',
}
