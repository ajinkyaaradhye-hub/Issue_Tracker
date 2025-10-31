import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['super_admin', 'admin', 'user']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
