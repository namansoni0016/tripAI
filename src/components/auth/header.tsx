import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { FaTruckPlane } from "react-icons/fa6";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

interface HeaderProps {
    title: string;
    label: string;
};

export const Header = ({ title, label } : HeaderProps ) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn("text-3xl md:text-4xl font-semibold", font.className)}>
                <div className="flex flex-row gap-4">
                    <FaTruckPlane className="text-red-600" /> {title}
                </div>
            </h1>
            <p className="text-muted-foreground text-md">{label}</p>
        </div>
    )
}