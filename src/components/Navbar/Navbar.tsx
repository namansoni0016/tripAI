import { auth } from "@/auth";
import PrivateNavbar from "@/components/Navbar/PrivateNavbar";
import PublicNavbar from "@/components/Navbar/PublicNavbar";

const Navbar = async () => {
    const session = await auth();
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