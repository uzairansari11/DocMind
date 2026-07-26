import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const uploadSchema = z.object({
  title: z.string().min(3, 'Document title is required'),
  collectionId: z.string().min(1, 'Select a collection'),
  document: z
    .any()
    .refine(
      (files) =>
        typeof FileList !== 'undefined' && files instanceof FileList && files.length === 1,
      'Select a document file',
    ),
});

export type UploadValues = z.infer<typeof uploadSchema>;
