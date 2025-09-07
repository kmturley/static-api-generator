export interface SourceConfig {
  format: SourceFormat;
  paths: string[];
  mapper?: SourceMapper;
}

export enum SourceFormat {
  Csv = 'csv',
  Json = 'json',
  Html = 'html',
  Yaml = 'yaml',
  Xml = 'xml',
}

export interface SourceMapped {
  org: string;
  slug: string;
  data: unknown;
}

export type SourceMapper = (input: any) => SourceMapped[];
