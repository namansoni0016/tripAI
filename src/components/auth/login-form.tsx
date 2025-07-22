"use client";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../../schemas";
import { login } from "@/actions/login";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "../../../routes";
import { Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccoundNotLinked" ? "Email already in use with different provider!" : "";
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            login(values).then(async (data) => { 
                if(data?.error) {
                    setError(data.error);
                } else {
                    setSuccess(data?.success);
                    await getSession();
                    router.refresh();
                    router.push(DEFAULT_LOGIN_REDIRECT);
                }
            })
        })
    }
    return (
        <CardWrapper headerTitle="Log in to TripAI" headerLabel="Adventure Awaits!"
            backButtonLabel="Don't have an account?" backButtonHref="/auth/register" showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="johndoe@email.com" type="email" />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input {...field} disabled={isPending} placeholder="******" type={showPassword ? "text" : "password"} className="pr-10" />
                                        <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5" />
                                            ) : (
                                                <FaEye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} type="submit" className="w-full">
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : ("Log In")}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}