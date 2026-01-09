import { z } from 'zod';
import Source from '../classes/Source.js';
import { PackageInterface, PackageSchema } from './Package.js';

export interface CollectionConfig {
  sources: Source[];
  validator?: CollectionValidator;
}

export interface CollectionInterface {
  [id: string]: PackageInterface;
}

export type CollectionValidator = (pkg: any) => {
  success: boolean;
  error?: any;
};

export const CollectionSchema = z.record(z.string(), PackageSchema);

export const CollectionValidator = (item: CollectionInterface) =>
  CollectionSchema.safeParse(item);
