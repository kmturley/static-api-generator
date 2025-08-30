import { z } from 'zod';

export interface Book {
  id: number;
  title: string;
  author?: string;
  year?: number;
}

export const BookSchema = z.object({
  id: z.number(),
  title: z.string().max(255),
  author: z.string().max(255).optional(),
  year: z.number().optional(),
});

export const BookValidator = (item: Book) => {
  const result = BookSchema.safeParse(item);
  return result.success ? true : result.error;
};
