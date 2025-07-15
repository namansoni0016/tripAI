"use client";
import { useRouter } from "next/navigation";

interface RegisterButtonProps {
    children: React.ReactNode;
}

export const RegisterButton = ({
    children,
} : RegisterButtonProps) => {
    const router = useRouter();
    const onClick = () => {
        router.push("/auth/register");
    }
    return(
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}