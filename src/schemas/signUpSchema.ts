import {z} from "zod"

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be less than 20 characters")  // Fixed the min/max issue from the original code
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters or spaces");

  export const signuUpSchema = z.object({
    username: usernameValidation,
  })