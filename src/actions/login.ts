"use server";
import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "../../schemas";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    if(!validatedFields.success) {
        return { error: "Invalid fields!" }
    }
    const { email, password } = validatedFields.data;
    try {
        await signIn("credentials", {
            email, 
            password,
            redirect: false,
        });
        return { success: "User logged in successfully!"};
    } catch (error) {
        if(error instanceof AuthError) {
            switch(error.type) {
                case "CredentialsSignin" : 
                    return { error : "Invalid Credentials!" }
                default: 
                    return { error : "Something went wrong!" }
            }
        }
        throw error;
    }
}