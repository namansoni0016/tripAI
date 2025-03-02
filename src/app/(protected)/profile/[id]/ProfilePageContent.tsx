"use client";
import { getProfileById, getSavedQueries, updateProfile } from "@/actions/profile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileById>>;
type Queries = Awaited<ReturnType<typeof getSavedQueries>>;

interface ProfilePageContentProps {
    user: NonNullable<User>,
    queries: Queries,
}

function ProfilePageContent({user, queries} : ProfilePageContentProps) {
    const isOAuthUser = user.provider === "google";
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name || "",
        email: user.email || "",
        password: "",
    });
    const handleEditSubmit = async () => {
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const result = await updateProfile(formData);
        if(result.success) {
            setShowEditDialog(false);
            toast.success("Profile updated successfully!");
        }
    }
    return (
        <div className="w-full mt-10 mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-w-lg mx-auto">
                    <Card className="bg-card">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={user.image ?? "/avatar.png"} alt="Profile" className="w-24 h-24 rounded-full" />
                                </Avatar>
                                <h1 className="mt-4 text-2xl font-bold text-slate-800">{user.name}</h1>
                                <p className="text-muted-foreground">Email: {user.email}</p>
                                <Button variant="outline" className="w-full mt-4" onClick={() => setShowEditDialog(true)}>
                                    <EditIcon className="size-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Tabs className="w-full" defaultValue="queries">
                    <TabsList className="w-full justify-center border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger value="queries" className="flex items-center gap-2 rounded-none data-[state=activa]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white px-6 font-semibold text-xl ">
                            <FileTextIcon className="size-4" />
                            Saved Trips
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="queries" className="mt-6">
                        <div className="space-y-6 mx-48">
                            {queries.length > 0 ? (
                                queries.map((query) => <h1 key={query.id} className="text-white font-bold border rounded-xl h-24 text-center">{query.queryText}</h1>)
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No saved trips</div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-slate-700">Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input name="name" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Your name" />
                            </div>
                            {!isOAuthUser && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input name="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} placeholder="Email address" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <Input name="password" type="password" onChange={(e) => setEditForm({...editForm, password: e.target.value})} placeholder="******" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <DialogClose asChild>
                                <Button variant="outline" className="rounded-2xl">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleEditSubmit} className="bg-slate-700 rounded-2xl">Save changes</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default ProfilePageContent;