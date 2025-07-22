import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string()
        .min(6, {
            message: "Minimun 6 characters required"
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter"
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter"
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number"
        })
        .regex(/[^A-Za-z0-9]/, {
            message: "Password must contain at least one special character"
        }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
});

export const profileSchema = z.object({
    name: z.string().min(1, { message: "Name is required!" }),
    image: z.string().url().or(z.literal("")).optional(),
})