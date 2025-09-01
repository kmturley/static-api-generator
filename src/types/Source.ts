export interface SourceConfig<T = any> {
  type: string;
  format: SourceFormat;
  paths: string[];
  mapper?: (source: SourceData) => T[];
  validator?: (item: T) => any;
}

export type SourceData = any;

export enum SourceFormat {
  Csv = 'csv',
  Json = 'json',
  Html = 'html',
  Yaml = 'yaml',
  Xml = 'xml',
}
