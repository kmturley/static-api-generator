import { z } from 'zod';
import { PackageInterface, PackageSchema } from './Package';

export interface OrganizationInterface {
  [id: string]: PackageInterface;
}

export const OrganizationSchema = z.record(z.string(), PackageSchema);

export const OrganizationValidator = (item: OrganizationInterface) =>
  OrganizationSchema.safeParse(item);
