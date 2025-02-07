import Link from "next/link";
import { FaTruckPlane } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const PrivateNavbar = () => {
    return (
        <div>
            <nav className="w-full p-5 border-b border-gray-500">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link href="/" className="text-red-600 font-semibold text-3xl flex flex-row gap-4">
                        <FaTruckPlane /> TripAI
                    </Link>
                    <Button variant="secondary" className="text-lg font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                        <Link href="/profile" className="text-slate-700 font-semibold text-lg">Profile</Link>
                    </Button>
                </div>
            </nav>
        </div>
    );
}

export default PrivateNavbar;