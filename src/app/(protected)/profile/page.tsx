"use client";
import { useCurrentUser } from "@/hooks/use-current-user";

const ProfilePage = () => {
    const user = useCurrentUser();
    return (
        <div className="p-10">
            <div className="text-white">
                {JSON.stringify(user)}
            </div>
        </div>
    );
};

export default ProfilePage;