"use client";
import { getProfileById, getSavedQueries } from "@/actions/profile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditIcon, FileTextIcon } from "lucide-react";

type User = Awaited<ReturnType<typeof getProfileById>>;
type Queries = Awaited<ReturnType<typeof getSavedQueries>>;

interface ProfilePageContentProps {
    user: NonNullable<User>,
    queries: Queries,
}

function ProfilePageContent({user, queries} : ProfilePageContentProps) {
    return (
        <div className="w-full mt-10 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-w-lg mx-auto">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="w-24 h-24">
                                    <img src={user.image ?? "/avatar.png"} alt="Profile" className="w-24 h-24 rounded-full" />
                                </Avatar>
                                <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                                <p className="text-muted-foreground">Email: {user.email}</p>
                                <Button variant="outline" className="w-full mt-4" onClick={() =>{}}>
                                    <EditIcon className="size-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Tabs className="w-full" defaultValue="queries">
                    <TabsList className="w-full justify-center border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger value="queries" className="flex items-center gap-2 rounded-none data-[state=activa]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white px-6 font-semibold ">
                            <FileTextIcon className="size-4" />
                            Saved Trips
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="queries" className="mt-6">
                        <div className="space-y-6 mx-48">
                            {queries.length > 0 ? (
                                queries.map((query) => <h1 className="text-white font-bold border rounded-xl h-24 text-center">{query.queryText}</h1>)
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No saved trips</div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProfilePageContent;