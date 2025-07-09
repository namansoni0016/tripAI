"use client";
import { getQuery } from "@/actions/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SavedTripProps {
    params: { queryId: string };
}

interface QueryData { 
    queryText: string;
    locations: string[];
}

export default function Locations({ params } : SavedTripProps) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { queryId } = params;
    const [query, setQuery] = useState<QueryData | null>(null);
    useEffect(() => {
        async function fetchQuery() {
            const data = await getQuery(queryId);
            setQuery(data);
        }
        fetchQuery();
    }, [queryId]);
    if(!query) {
        return (
            <div className="flex items-center justify-center mt-16 text-white text-5xl font-bold">Loading...</div>
        );
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center p-4 mt-4">
                <h1 className="text-4xl font-bold text-white mb-8">{query.queryText}</h1>
                <Card className="w-[800px] max-h-[460px] overflow-y-auto rounded-xl mb-8 border-none bg-white/10 backdrop-blur-sm">
                    <CardContent className="p-6">
                        {query.locations.length > 0 ? (
                            <ul className="space-y-3">
                                {query.locations.map((location, index) => (
                                    <li key={index} className="text-white text-lg p-3 border-b border-white/20 hover:bg-white/10 transition-colors rounded">
                                        {location}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-white text-center py-8">No locations!</p>
                        )}
                    </CardContent>
                </Card>
                <Link href={`/profile/${userId}/saved-trips/${queryId}`}>
                    <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                        Back to Itinerary
                    </Button>
                </Link>
            </div>
        </>
    )
}