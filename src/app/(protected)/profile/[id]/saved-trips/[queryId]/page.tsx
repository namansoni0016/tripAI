"use client";
import { getQuery } from "@/actions/query";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

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
    if(loading) return <Spinner />
    if(error) {
        <div className="flex flex-col items-center justify-center h-[50vh] px-4 text-white text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Error</h1>
            <p className="text-lg md:text-xl">{error}</p>
            <Link href={`/profile/${userId}`} className="mt-6 md:mt-8">
                <Button variant="secondary" className="text-base md:text-lg text-slate-700 font-semibold p-3 md:p-5 rounded-full transition-transform duration-300 ease-in-out hover:translate-y-1">
                    Back to Profile
                </Button>
            </Link>
        </div>
    };
    if(!query) {
        return (
            <div className="flex items-center justify-center h-[50vh] px-4 text-white text-xl md:text-3xl font-bold text-center">No trip found!</div>
        )
    }
    return (
        <div className="flex flex-col items-center px-4 py-4 md:py-0">
            <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-2 mt-4">{query?.queryText}</h2>
            <Card className="w-full max-w-[800px] max-h-[60vh] md:max-h-[540px] overflow-y-auto rounded-lg md:rounded-xl mt-2 mb-4 border-none">
                <CardContent className="px-3 py-3 md:px-4 md:py-4">
                    <p className="prose prose-sm md:prose-base max-w-none whitespace-pre-line">
                        <ReactMarkdown>
                            {query?.response}
                        </ReactMarkdown>
                    </p>
                </CardContent>
            </Card>
            <div className="flex flex-row sm:flex-row gap-2 md:gap-10 w-full max-w-[800px] justify-center">
                <Link href={`/profile/${userId}`} className="w-full sm:w-auto">
                    <Button variant="secondary" className={cn(
                        "text-base sm:text-lg font-semibold px-4 py-3 sm:px-6 sm:py-4 rounded-full",
                        "bg-gradient-to-r from-red-600 to-red-700 text-white",
                        "hover:from-red-600 hover:to-red-700",
                        "transition-all duration-300 hover:scale-[1.03] hover:shadow-lg",
                        "shadow-md shadow-red-500/20", "mt-2",
                        font.className
                    )}>
                        Back to Profile
                    </Button>
                </Link>
                {query?.locations.length > 0 && (
                    <Link href={`/profile/${userId}/saved-trips/${queryId}/locations`} className="w-full sm:w-auto">
                        <Button variant="secondary" className={cn(
                        "text-base sm:text-lg font-semibold px-4 py-3 sm:px-6 sm:py-4 rounded-full",
                        "bg-gradient-to-r from-red-600 to-red-700 text-white",
                        "hover:from-red-600 hover:to-red-700",
                        "transition-all duration-300 hover:scale-[1.03] hover:shadow-lg",
                        "shadow-md shadow-red-500/20", "mt-2",
                        font.className
                    )}>
                            Show Locations({query?.locations.length})
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}