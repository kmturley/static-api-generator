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
  Org = 'org',
  Package = 'package',
  Registry = 'registry',
}
