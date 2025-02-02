import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username Must not exceed more then 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username Must Not Contain Special Character")


    export const signUpSchema = z.object({usernameValidation})