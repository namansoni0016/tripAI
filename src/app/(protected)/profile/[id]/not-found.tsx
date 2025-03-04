import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] grid place-items-center px-4">
            <div className="w-full max-w-md text-center space-x-6">
                <p className="text-8xl font-bold text-primary text-white">Error 404</p>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">User not found!</h1>
                    <p className="text-muted-foreground text-white">The user you're looking for doesn't exist</p>
                </div>
                <div className="flex mt-4 flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="secondary" asChild>
                        <Link href="/">
                            <HomeIcon className="mr-2 size-4" />
                            Back to home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}