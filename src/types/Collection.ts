import Source from '../classes/Source.js';
import { OrganizationInterface } from './Organization.js';

export interface CollectionConfig {
  sources: Source[];
  validator?: CollectionValidator;
}

export interface CollectionInterface {
  [id: string]: OrganizationInterface;
}

export type CollectionValidator = (obj: any) => boolean;
