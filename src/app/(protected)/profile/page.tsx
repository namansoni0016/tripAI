"use client";
import { useSession, signOut } from "next-auth/react";

const ProfilePage = () => {
    const session = useSession();
    const onClick = () => {
        signOut();
    }
    return (
        <div>
            {JSON.stringify(session)}
            <button onClick={onClick} type="submit">
                Sign Out
            </button>
        </div>
    );
};

export default ProfilePage;