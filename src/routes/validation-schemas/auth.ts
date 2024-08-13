import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string({ required_error: 'username is required' }),
    password: z.string({ required_error: 'password must contain alphanumeric characters and at least one special character' })
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z0-9]/, "Password must contain alphanumeric characters")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string({ required_error: 'confirmPassword is required' }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
    username: z.string({ required_error: 'username is required' }),
    password: z.string({ required_error: 'password is required' }),
});