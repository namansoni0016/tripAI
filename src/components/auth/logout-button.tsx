"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
    const router = useRouter();
    const onClick = () => {
        signOut({
            callbackUrl: `${window.location.origin}/auth/login`
        });
        router.refresh();
    };
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
}