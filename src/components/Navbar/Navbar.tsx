"use client";
import PrivateNavbar from "@/components/Navbar/PrivateNavbar";
import PublicNavbar from "@/components/Navbar/PublicNavbar";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session, status } = useSession();
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