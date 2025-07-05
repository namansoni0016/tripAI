import { getProfileById, getSavedQueries } from "@/actions/profile";
import { Metadata } from "next";
import ProfilePageContent from "./ProfilePageContent";

export async function generateMetadata({params} : {params: { id: string }}): Promise<Metadata> {
    const user = await getProfileById(params.id);
    if(!user) return {};
    return {
        title: user.name,
    }
}

async function ProfilePage({params}: {params: {id: string}}) {
    const user = await getProfileById(params.id);
    if(!user) return null;
    const [queries] = await Promise.all([
        getSavedQueries(user.id),
    ]);
    return (
        <ProfilePageContent user={user} queries={queries} />
    )
}

export default ProfilePage;