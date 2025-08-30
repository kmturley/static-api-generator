export interface SourceConfig<T = any> {
  format: SourceFormat;
  mapper: (source: SourceData) => T[];
  paths: string[];
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
