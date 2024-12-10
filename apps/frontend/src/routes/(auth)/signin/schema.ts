import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().email({message: 'Enter your email'}),
  password: z.string().min(1, {message: 'Enter your password'})
});

export const otpSchema = z.object({
  verification_code: z
    .string()
    .min(6, {
      message: 'Enter a 6-character code'
    })
    .max(6)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email' })
});

export type FormSchema = typeof formSchema;
export type OTPSchema = typeof otpSchema; 
export type ForgotPasswordSchema = typeof forgotPasswordSchema; 
