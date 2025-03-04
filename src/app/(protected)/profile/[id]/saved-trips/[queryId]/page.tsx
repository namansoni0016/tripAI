"use client";
import { getQueryById } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SavedTripProps {
    params: { queryId: string };
}

export default function SavedTrip({ params } : SavedTripProps) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { queryId } = params;
    const [query, setQuery] = useState<{queryText: string; response: string} | null>(null);
    useEffect(() => {
        async function fetchQuery() {
            const data = await getQueryById(queryId);
            setQuery(data);
        }
        fetchQuery();
    }, [queryId])
    if(!query) {
        return (
            <div className="flex items-center justify-center mt-16 text-white text-5xl font-bold">Loading...</div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <h2 className="text-4xl font-bold text-white">{query?.queryText}</h2>
            <Card className="w-[800px] max-h-[540px] overflow-y-auto rounded-xl mt-4 mb-2 border-none">
                <CardContent className="px-4 py-2">
                    <p className="whitespace-pre-line">{query?.response}</p>
                </CardContent>
            </Card>
            <Link href={`/profile/${userId}`}>
                <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                    Back to Profile
                </Button>
            </Link>
        </div>
    )
}