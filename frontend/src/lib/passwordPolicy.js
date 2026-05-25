import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[0-9]/, 'Password must include a number')
  .regex(/[^A-Za-z0-9]/, 'Password must include a special character');

export const getPasswordValidationMessage = (password) => {
  const result = passwordSchema.safeParse(password);
  return result.success ? null : result.error.issues[0]?.message || 'Password is not strong enough';
};
