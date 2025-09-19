import { z } from 'zod';

export interface PackageInterface {
  title: string;
  author?: string;
  year?: number;
}

export const PackageSchema = z.object({
  title: z.string().max(255),
  author: z.string().max(255).optional(),
  year: z.number().optional(),
});

export const PackageValidator = (item: PackageInterface) =>
  PackageSchema.safeParse(item);
