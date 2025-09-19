import { z } from 'zod';
import Source from '../classes/Source.js';
import { OrganizationInterface, OrganizationSchema } from './Organization.js';

export interface CollectionConfig {
  sources: Source[];
  validator?: CollectionValidator;
}

export interface CollectionInterface {
  [orgId: string]: OrganizationInterface;
}

export type CollectionValidator = (obj: any) => {
  success: boolean;
  error?: any;
};

export const CollectionSchema = z.record(z.string(), OrganizationSchema);

export const CollectionValidator = (item: CollectionInterface) =>
  CollectionSchema.safeParse(item);
