import { z } from 'zod';

export enum Library {
  Authors = 'authors',
  Books = 'books',
}

export interface Book {
  slug: string;
  title: string;
  author?: string;
  year?: number;
}

export const BookSchema = z.object({
  slug: z.string().max(255),
  title: z.string().max(255),
  author: z.string().max(255).optional(),
  year: z.number().optional(),
});

export const BookValidator = (item: Book) => BookSchema.safeParse(item).success;
