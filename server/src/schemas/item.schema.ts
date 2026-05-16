import z from "zod";

export const createItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.int(),
  image: z.string().min(1),
});

export type CreateItemBody = z.infer<typeof createItemSchema>;

export const updateItemSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.int().optional(),
  image: z.string().min(1).optional(),
});

export type UpdateItemBody = z.infer<typeof updateItemSchema>;
