"use client";

import { deleteSavedTrip, getProfileById, getSavedQueries, updateProfile } from "@/actions/profile";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon } from "lucide-react";
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
        <div className="w-full mt-4 md:mt-10 mx-auto px-4">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="w-full max-w-lg mx-auto">
                    <Card className="bg-transparent border-none shadow-none">
                        <CardContent className="pt-4 md:pt-6 px-2 md:px-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="size-20 md:size-32 border-2 md:border-4 border-white shadow-lg">
                                    <AvatarImage src={user.image?.startsWith("http") ? user.image : "/avatar.png"} className="object-cover" />
                                    <AvatarFallback className="bg-gray-100 text-slate-700 text-xl md:text-2xl font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h1 className="mt-3 md:mt-4 text-xl md:text-3xl font-bold text-white">{user.name}</h1>
                                <p className="text-md md:text-base text-white/80">Email: {user.email}</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 md:space-y-4 mt-3">
                                <div className="flex justify-between items-center w-full border-b pb-2">
                                    <h3 className="text-md md:text-lg font-semibold text-white">Edit Profile: </h3>
                                    <EditProfileModal user={user} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Tabs className="w-full" defaultValue="queries">
                    <TabsList className="w-full justify-center border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger value="queries" className="flex items-center gap-1 md:gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white px-3 md:px-4 font-semibold text-xl md:text-3xl ">
                            <FileTextIcon className="size-3 md:size-4" />
                            Saved <span className="text-red-600">Trips</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="queries" className="mt-4 md:mt-6 mb-4 md:mb-6">
                        <div className="mx-0 sm:mx-6 md:mx-12 lg:mx-24 xl:mx-48">
                            <div className="space-y-4 md:space-y-6 h-[calc(100vh-400px)] md:h-[calc(100vh-540px)] overflow-y-auto pr-1 md:pr-2">
                                {queries.length > 0 ? (
                                    queries.map((query) => (
                                        <div key={query.id} className="flex flex-col border rounded-lg md:rounded-xl w-full min-h-[120px] md:min-h-[160px] bg-white/5 backdrop-blur-sm ">
                                            <div className="flex items-start justify-between p-1 md:p-3">
                                                <Link href={`/profile/${user.id}/saved-trips/${query.id}`} className="flex-1 min-w-0">
                                                    <h1 className="text-sm md:text-xl text-white font-semibold truncate md:text-center mt-1 ml-2 md:ml-4 border-b pb-1">{query.queryText}</h1>
                                                </Link>
                                                <DeleteDialog isDeleting={isDeleting} onDelete={() => handleDelete(query.id)} />
                                            </div>
                                            <div className="text-muted-foreground mx-2 md:mx-4 mt-1 md:mt-2 line-clamp-3 md:line-clamp-4 text-xs md:text-base">
                                                <ReactMarkdown>
                                                    {query.response}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 md:py-8 text-muted-foreground text-sm md:text-base">No saved trips</div>
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