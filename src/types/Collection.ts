import Source from '../classes/Source.js';

export interface CollectionConfig {
  sources: Source[];
  validator?: CollectionValidator;
}

export interface CollectionInterface {
  [id: string]: any;
}

export type CollectionValidator = (obj: any) => boolean;
