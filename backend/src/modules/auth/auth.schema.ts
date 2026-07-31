import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

export const refreshTokenSchema = {
  cookies: z.object({
    refreshToken: z.string().optional(),
  }),
};
