export interface SourceConfig {
  format: SourceFormat;
  paths: string[];
  mapper?: SourceMapper;
}

export enum SourceFormat {
  Csv = 'csv',
  Json = 'json',
  Html = 'html',
  Text = 'text',
  Yaml = 'yaml',
  Xml = 'xml',
}

export interface SourceMapped {
  orgId: string;
  pkgId: string;
  data: unknown;
}

export type SourceMapper = (input: any) => SourceMapped[];
