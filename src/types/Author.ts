import { z } from 'zod';

export interface AuthorInterface {
  name: string;
  bio?: string;
  website?: string;
  books?: Record<string, boolean>;
}

export const AuthorSchema = z.object({
  name: z.string().max(255),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  books: z.record(z.string(), z.boolean()).optional(),
});

export const AuthorValidator = (item: AuthorInterface) =>
  AuthorSchema.safeParse(item);
