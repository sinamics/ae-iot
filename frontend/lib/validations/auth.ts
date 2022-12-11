import * as z from 'zod';

export const userAuthSchema = z.object({
  firstname: z.string().min(2).max(40),
  lastname: z.string().min(2).max(40),
  email: z.string().email(),
  password: z.string().min(8).max(40).optional(),
});
