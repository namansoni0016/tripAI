"use client";

import { deleteSavedTrip, getProfileById, getSavedQueries } from "@/actions/profile";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, MapPinIcon } from "lucide-react";
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
            console.error(error);
            toast.error("Failed to delete trip!");
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <div className="w-full min-h-screen mx-auto px-4 max-w-6xl py-4 md:py-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-8 h-full">
                <div className="w-full max-w-md mx-auto md:mx-0 flex flex-col justify-center">
                    <Card className="bg-white/5 border border-white/10 rounded-xl shadow-sm">
                        <CardContent className="pt-6 px-4 pb-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Avatar className="size-24 md:size-32 border-4 border-white/20 shadow-md">
                                    <AvatarImage src={user.image?.startsWith("http") ? user.image : "/avatar.png"} className="object-cover" />
                                    <AvatarFallback className="bg-gray-100 text-slate-700 text-xl md:text-2xl font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                                    <p className="text-sm text-white/80">Email: {user.email}</p>
                                </div>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between items-center w-full border-b border-white/20 pb-3">
                                    <h3 className="text-md font-semibold text-white">Edit Profile: </h3>
                                    <EditProfileModal user={user} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full h-full flex flex-col">
                    <Tabs className="w-full h-full flex flex-col" defaultValue="queries">
                        <TabsList className="w-full justify-center border-b border-white/10 rounded-none h-auto p-0 bg-transparent">
                            <TabsTrigger value="queries" className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-white px-4 font-semibold text-xl md:text-2xl">
                                <FileTextIcon className="size-4 md:size-5" />
                                Saved <span className="text-red-600">Trips</span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="queries" className="mt-4 md:mt-6 mb-4 md:mb-6 flex-1 h-full overflow-hidden">
                            <div className="mx-0 sm:mx-2 h-full flex flex-col">
                                <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto max-h-[35vh] md:max-h-[70vh] pr-2">
                                    {queries.length > 0 ? (
                                        queries.map((query) => (
                                            <div key={query.id} className="flex flex-col border border-white/10 rounded-lg w-full min-h-[120px] md:min-h-[140px] bg-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex items-start justify-between px-3 md:px-4 pt-3 md:pt-4 border-b border-white/10">
                                                    <Link href={`/profile/${user.id}/saved-trips/${query.id}`} className="flex-1 min-w-0">
                                                        <h1 className="text-sm md:text-md text-white font-semibold flex items-center gap-2">
                                                            <MapPinIcon className="size-3 md:size-4 text-red-600" />
                                                            {query.queryText}
                                                        </h1>
                                                    </Link>
                                                    <DeleteDialog isDeleting={isDeleting} onDelete={() => handleDelete(query.id)} />
                                                </div>
                                                <div className="p-3 md:p-4 text-white/80 text-xs md:text-sm">
                                                    <div className="line-clamp-2 md:line-clamp-3">
                                                        <ReactMarkdown>
                                                            {query.response}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 md:py-12 text-white/60 flex flex-col items-center justify-center h-full">
                                            <div className="size-14 md:size-16 mb-3 md:mb-4 flex items-center justify-center bg-white/5 rounded-full">
                                                <FileTextIcon className="size-5 md:size-6 text-white/40" />
                                            </div>
                                            <h3 className="text-md md:text-lg font-medium mb-1 md:mb-2">No saved trips yet</h3>
                                            <p className="max-w-md mx-auto text-sm md:text-base">Your future travel plans will appear here when you save them.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ProfilePageContent;