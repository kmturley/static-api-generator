import { TargetData } from './Target.js';

export interface SourceConfig {
  format: string;
  mapper: (source: SourceData) => TargetData[];
  paths: string[];
}

export type SourceData = any;

export enum SourceFormat {
  Csv = 'csv',
  Json = 'json',
  Html = 'html',
  Yaml = 'yaml',
  Xml = 'xml',
}
