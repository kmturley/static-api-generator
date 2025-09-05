import { CollectionInterface } from './Collection';

export interface RegistryConfig {
  name: string;
  url: string;
  version: string;
}

export interface RegistryInterface {
  name: string;
  url: string;
  version: string;
  [type: string]: CollectionInterface | string;
}
