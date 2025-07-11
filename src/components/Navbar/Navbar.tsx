"use client";
import PrivateNavbar from "@/components/Navbar/PrivateNavbar";
import PublicNavbar from "@/components/Navbar/PublicNavbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Navbar = () => {
    const { data: session } = useSession();
    return (
        <>
            {session ? (
                <PrivateNavbar />
            ) : (
                <PublicNavbar />
            )}
        </>
    );
}

export default Navbar;