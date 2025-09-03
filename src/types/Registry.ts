import { SourceConfig } from './Source';
import { TargetConfig } from './Target';

export interface RegistryConfig {
  sources: SourceConfig[];
  targets: TargetConfig[];
}

export type RegistryCollection = Record<string, any>;

export interface RegistryData {
  [schema: string]: RegistryCollection;
}
