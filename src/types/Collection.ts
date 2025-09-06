import Package from '../classes/Package.js';
import Source from '../classes/Source.js';

export interface CollectionConfig {
  sources: Source[];
  validator?: CollectionValidator;
}

export interface CollectionInterface {
  [id: string]: Package;
}

export type CollectionValidator = (obj: any) => boolean;
