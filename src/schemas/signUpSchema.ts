import {z} from "zod"

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be less than 20 characters")  // Fixed the min/max issue from the original code
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters or spaces");

  export const signuUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid Email Address"}),
    password: z.string().min(6, {message:"Password must be atleast of 6 Characters"}),
  })