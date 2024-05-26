import { z } from 'zod';


const UserProfileSchema = z.object({
  bio: z.string(),
  age: z.number(),
  profileImage: z.string().optional(),
  address: z.string()
});

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  profile: UserProfileSchema
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const updateUser = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  bio: z.string().optional(),
  age: z.number().optional()
});

export const UserValidation = {
  UserSchema,
  LoginSchema,
  updateUser
};
