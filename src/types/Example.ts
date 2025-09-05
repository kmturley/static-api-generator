import { z } from 'zod';

export enum Library {
  Authors = 'authors',
  Books = 'books',
}

export interface Book {
  id: string | number;
  title: string;
  author?: string;
  year?: number;
}

export const BookSchema = z.object({
  id: z.string().or(z.number()),
  title: z.string().max(255),
  author: z.string().max(255).optional(),
  year: z.number().optional(),
});

export const BookValidator = (item: Book) => BookSchema.safeParse(item).success;
