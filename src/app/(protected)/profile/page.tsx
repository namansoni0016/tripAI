"use client";
import { logout } from "@/actions/logout";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
    const { data: session } = useSession();
    const onClick = () => {
        logout();
    }
    return (
        <div className="text-white">
            {JSON.stringify(session?.user)}
            <button onClick={onClick} type="submit">
                Sign Out
            </button>
        </div>
    );
};

export default ProfilePage;