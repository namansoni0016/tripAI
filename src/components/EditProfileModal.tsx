"use client";

import { User } from "next-auth";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { profileSchema } from "../../schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { updateProfile } from "@/actions/profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UploadButton } from "@/lib/uploadthing";
import { Input } from "./ui/input";
import { SubmitButton } from "./SubmitButton";

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileModal({user} : {user: User}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [tempImage, setTempImage] = useState<string>(user.image || "");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || "",
            image: user.image || "",
        }
    });
    useEffect(() => {
        if(isOpen) {
            form.reset({
                name: user.name || "",
                image: user.image || "",
            });
            setTempImage(user.image || "");
        }
    }, [isOpen, form, user]);
    const handleImageUpload = (url: string) => {
        setTempImage(url);
        form.setValue("image", url, { shouldValidate: true });
        toast.success("Image uploaded successfully!");
    }
    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await updateProfile(data);
            if(result?.success) {
                toast.success("Profile updated successfully!");
                setIsOpen(false);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update profile!");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsOpen(true)}>
                <Pencil className="size-4" />
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-700">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="size-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={tempImage || "/avatar.png"} className="object-cover" />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <UploadButton endpoint="imageUploader" onClientUploadComplete={(res) => {
                                    if(res && res[0]?.ufsUrl) {
                                        handleImageUpload(res[0].ufsUrl);
                                    }
                                }} onUploadError={(error: Error) => {
                                    console.error(error);
                                    toast.error(`Upload failed: ${error.message}`)
                                }} />
                            </div>
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700">Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <SubmitButton text="Save Changes" isLoading={isSubmitting} />
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}