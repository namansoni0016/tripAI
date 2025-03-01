import { getProfileById } from "@/actions/profile";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({params} : {params: { id: string }}): Promise<Metadata> {
    const user = await getProfileById(params.id);
    if(!user) return {};
    return {
        title: user.name,
    }
}

async function ProfilePage({params}: {params: {id: string}}) {
    const user = await getProfileById(params.id);
    if(!user) notFound();
    // const [queries] = await Promise.all([
    //     getSavedQueries(user.id);
    // ]) 
    return (
        <div>Profile Page</div>
    )
}

export default ProfilePage;