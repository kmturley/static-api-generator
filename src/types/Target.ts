import { z } from 'zod';

export type TargetData = {
  id: number;
  title: string;
  author?: string;
  year?: number;
};

export const TargetSchema = z.object({
  id: z.number(),
  title: z.string().max(255),
  author: z.string().max(255).optional(),
  year: z.number().optional(),
});

export const TargetValidator = (item: TargetData) => {
  const result = TargetSchema.safeParse(item);
  return result.success ? true : result.error;
};
