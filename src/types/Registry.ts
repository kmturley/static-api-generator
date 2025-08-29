import { TargetData } from './Target.js';

export type RegistryCollection<T = TargetData> = Record<string, T>;

export interface RegistryData<T = TargetData> {
  [type: string]: RegistryCollection<T>;
}
