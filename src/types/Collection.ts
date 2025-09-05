import Source from '../classes/Source.js';
import Target from '../classes/TargetFile.js';

export interface CollectionConfig {
  sources: Source[];
  targets: Target[];
  validator?: CollectionValidator;
}

export interface CollectionInterface {
  [id: string]: any;
}

export type CollectionValidator = (obj: any) => boolean;
