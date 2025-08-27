import { z } from 'zod';

export type TargetData = {
  id: number;
  title: string;
};

export const TargetSchema = z.object({
  id: z.number(),
  title: z.string().max(50),
});

export const TargetValidator = (item: TargetData) =>
  TargetSchema.safeParse(item).success
    ? true
    : TargetSchema.safeParse(item).error;
