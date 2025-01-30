import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string(),
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6),
});