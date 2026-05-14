import z from "zod";

export const createUserSchema = z.object({
  userName: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginUserBody = z.infer<typeof loginUserSchema>;
