"use client";
import Link from "next/link";
import { FaTruckPlane } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "../auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";

const PrivateNavbar = () => {
    const user = useCurrentUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const closeMenu = () => {
        setIsOpen(false);
    }
    return (
        <div className="relative">
            <nav className="w-full p-4 border-b border-gray-500">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link href="/" className="text-red-600 font-semibold text-2xl md:text-3xl flex items-center gap-2">
                        <FaTruckPlane /> <span className="hidden sm:inline">TripAI</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-4 ml-auto">
                        <Button variant="secondary" className="text-slate-700 font-semibold px-4 py-2 rounded-full transition-transform duration-300 ease-in-out hover:translate-y-1">
                            <Link href={`/profile/${user?.id}`} className="text-slate-700 font-semibold text-lg">Profile</Link>
                        </Button>
                        <LogoutButton>
                            <Button variant="secondary" className="text-lg text-slate-700 font-semibold px-4 py-2 rounded-full transition-transform duration-300 ease-in-out hover:translate-y-1" >
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