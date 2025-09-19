import { z } from 'zod';
import { CollectionInterface, CollectionSchema } from './Collection';

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

export const RegistrySchema = z
  .object({
    name: z.string(),
    url: z.url(),
    version: z.string(),
  })
  .and(z.record(z.string(), z.union([CollectionSchema, z.string()])));

export const RegistryValidator = (item: RegistryInterface) =>
  RegistrySchema.safeParse(item);
