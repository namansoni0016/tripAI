"use client";
import { getQueryById } from "@/actions/profile";
import { getQuery } from "@/actions/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

interface SavedTripProps {
    params: { queryId: string };
}

interface QueryData {
    queryText: string;
    response: string;
    locations: string[];
}

export default function SavedTrip({ params } : SavedTripProps) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { queryId } = params;
    const [query, setQuery] = useState<QueryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        async function fetchQuery() {
            try {
                setLoading(true);
                setError(null);
                const data = await getQuery(queryId);
                if(!data) {
                    throw new Error("Trip not found!");
                }
                setQuery(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to Load Trip!");
                setQuery(null);
            } finally {
                setLoading(false);
            }
        }
        fetchQuery();
    }, [queryId])
    if(loading) {
        return (
            <div className="flex items-center justify-center mt-16 text-white text-5xl font-bold">Loading...</div>
        )
    }
    if(error) {
        <div className="flex flex-col items-center justify-center mt-16 text-white">
            <h1 className="text-5xl font-bold mb-4">Error</h1>
            <p className="text-xl">{error}</p>
            <Link href={`/profile/${userId}`} className="mt-8">
                <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                    Back to Profile
                </Button>
            </Link>
        </div>
    };
    if(!query) {
        return (
            <div className="flex items-center justify-center mt-16 text-white text-3xl font-bold">No trip found!</div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <h2 className="text-4xl font-bold text-white">{query?.queryText}</h2>
            <Card className="w-[800px] max-h-[540px] overflow-y-auto rounded-xl mt-4 mb-2 border-none">
                <CardContent className="px-4 py-2">
                    <p className="whitespace-pre-line">
                        <ReactMarkdown>
                            {query?.response}
                        </ReactMarkdown>
                    </p>
                </CardContent>
            </Card>
            <div className="flex flex-row gap-10">
                <Link href={`/profile/${userId}`}>
                    <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                        Back to Profile
                    </Button>
                </Link>
                {query?.locations.length > 0 && (
                    <Link href={`/profile/${userId}/saved-trips/${queryId}/locations`}>
                        <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                            Show Locations({query?.locations.length})
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}