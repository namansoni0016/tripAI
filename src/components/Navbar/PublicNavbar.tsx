import Link from "next/link";
import { FaTruckPlane } from "react-icons/fa6";

const PublicNavbar = () => {
    return (
        <div>
            <nav className="w-full p-4 border-b border-gray-500">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <Link href="/" className="text-red-600 font-semibold text-3xl flex flex-row gap-4">
                        <FaTruckPlane /> TripAI
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default PublicNavbar;