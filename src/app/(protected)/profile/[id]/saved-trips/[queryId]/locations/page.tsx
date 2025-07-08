"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface SavedTripProps {
    params: { queryId: string };
}

export default function Locations({ params } : SavedTripProps) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { queryId } = params;
    return (
        <>
            <h1 className="text-white">Locations</h1>
            <Link href={`/profile/${userId}/saved-trips/${queryId}`}>
                <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                    Back to Itinerary
                </Button>
            </Link>
        </>
    )
}