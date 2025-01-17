import {z} from "zod"

export const signInSchema = z.object({
    identifier: z.string(),
    //Username or Email
    password:z.string(),
})