"use client";

import { deleteSavedTrip, getProfileById, getSavedQueries, updateProfile } from "@/actions/profile";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';

type User = Awaited<ReturnType<typeof getProfileById>>;
type Queries = Awaited<ReturnType<typeof getSavedQueries>>;

interface ProfilePageContentProps {
    user: NonNullable<User>,
    queries: Queries,
}

function ProfilePageContent({user, queries} : ProfilePageContentProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async (queryId: string) => {
        if(isDeleting) return;
        try {
            setIsDeleting(true);
            const result = await deleteSavedTrip(queryId);
            if(result.success) toast.success("Trip deleted successfully!");
            else throw new Error(result.error);
        } catch (error) {
            toast.error("Failed to delete trip!");
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <div className="w-full mt-10 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-w-lg mx-auto">
                    <Card className="bg-transparent">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="size-32 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.image?.startsWith("http") ? user.image : "/avatar.png"} className="object-cover" />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h1 className="mt-4 text-3xl font-bold text-white">{user.name}</h1>
                                <p className="text-white">Email: {user.email}</p>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="flex justify-between items-center mt-4 w-full">
                                    <h3 className="text-lg font-semibold text-white">Edit Profile: </h3>
                                    <EditProfileModal user={user} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Tabs className="w-full" defaultValue="queries">
                    <TabsList className="w-full justify-center border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger value="queries" className="flex items-center gap-2 rounded-none data-[state=activa]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white px-6 font-semibold text-3xl ">
                            <FileTextIcon className="size-4" />
                            Saved <span className="text-red-600">Trips</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="queries" className="mt-6 mb-6">
                        <div className="mx-48">
                            <div className="space-y-6 h-[calc(100vh-540px)] overflow-y-auto pr-2">
                                {queries.length > 0 ? (
                                    queries.map((query) => (
                                        <div key={query.id} className="flex flex-col border rounded-xl w-full min-h-[160px]">
                                            <div className="flex items-start justify-between">
                                                <Link href={`/profile/${user.id}/saved-trips/${query.id}`}>
                                                    <h1 className="text-xl text-white font-semibold text-center mt-2 ml-4 border-b">{query.queryText}</h1>
                                                </Link>
                                                <DeleteDialog isDeleting={isDeleting} onDelete={() => handleDelete(query.id)} />
                                            </div>
                                            <div className="text-muted-foreground mx-4 mt-2 line-clamp-4">
                                                <ReactMarkdown>
                                                    {query.response}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">No saved trips</div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProfilePageContent;