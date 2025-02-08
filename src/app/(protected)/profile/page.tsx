"use client";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const ProfilePage = () => {
    const user = useCurrentUser();
    const onClick = () => {
        logout();
    }
    return (
        <div className="text-white">
            {JSON.stringify(user)}
            <button onClick={onClick} type="submit">
                Sign Out
            </button>
        </div>
    );
};

export default ProfilePage;