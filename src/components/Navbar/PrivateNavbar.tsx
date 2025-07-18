"use client";
import Link from "next/link";
import { FaTruckPlane } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "../auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { Spinner } from "../Spinner";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

const PrivateNavbar = () => {
    const { user, loading } = useCurrentUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const closeMenu = () => {
        setIsOpen(false);
    }
    if (loading) return <Spinner />
    return (
        <div className="relative">
            <nav className="w-full p-4 border-b border-gray-500">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link href="/" className="text-red-600 font-semibold text-2xl md:text-3xl flex items-center gap-2">
                        <FaTruckPlane /> <span className="hidden sm:inline">TripAI</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-4 ml-auto">
                        <Button variant="secondary" size="lg" className={cn(
                            "text-base sm:text-lg font-semibold px-4 py-3 sm:px-6 sm:py-4 rounded-full",
                            "bg-gradient-to-r from-red-600 to-red-700 text-white",
                            "hover:from-red-600 hover:to-red-700",
                            "transition-all duration-300 hover:scale-[1.03] hover:shadow-lg",
                            "shadow-md shadow-red-500/20",
                            font.className
                        )}>
                            <Link href={`/profile/${user?.id}`}>Profile</Link>
                        </Button>
                        <LogoutButton>
                            <Button variant="secondary" size="lg" className={cn(
                                "text-base sm:text-lg font-semibold px-4 py-3 sm:px-6 sm:py-4 rounded-full",
                                "bg-gradient-to-r from-red-600 to-red-700 text-white",
                                "hover:from-red-600 hover:to-red-700",
                                "transition-all duration-300 hover:scale-[1.03] hover:shadow-lg",
                                "shadow-md shadow-red-500/20",
                                font.className
                            )}>
                                Log out
                            </Button>
                        </LogoutButton>
                    </div>
                    <button className="md:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 to-black z-50 border-t border-gray-500">
                        <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
                            <Button variant="secondary" className="w-full text-slate-700 font-semibold py-6 rounded-full" onClick={closeMenu}>
                                <Link href={`/profile/${user?.id}`} className="w-full block text-lg">Profile</Link>
                            </Button>
                            <LogoutButton>
                                <Button variant="secondary" className="w-full text-slate-700 font-semibold py-6 rounded-full text-lg" onClick={closeMenu}>
                                    Log out
                                </Button>
                            </LogoutButton>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default PrivateNavbar;