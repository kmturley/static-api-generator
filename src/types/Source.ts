export interface SourceConfig {
  schema: string;
  paths: string[];
  type?: string;
  format?: SourceFormat;
  mapper?: (source: SourceData) => any[];
  validator?: (item: any) => any;
}

export type SourceData = any;

export enum SourceFormat {
  Csv = 'csv',
  Json = 'json',
  Html = 'html',
  Yaml = 'yaml',
  Xml = 'xml',
}
