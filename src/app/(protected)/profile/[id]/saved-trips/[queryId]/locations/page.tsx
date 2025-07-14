"use client";
import { getQuery } from "@/actions/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { geocodeLocation } from "@/lib/geocode";
import { Loader2 } from "lucide-react";

const MapWithNoSSR = dynamic(
    () => import('@/components/Map'),
    { ssr: false },
)

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
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    useEffect(() => {
        const fetchQueryData = async() => {
            try {
                const data = await getQuery(queryId);
                setQuery(data);
                if(data?.locations && data.locations.length > 0) {
                    setSelectedLocation(data.locations[0]);
                    const initialCoords = await geocodeLocation(data.locations[0]);
                    setCoordinates(initialCoords);
                }
            } catch (error) {
                console.error("Failed to fetch query: ", error);
                setQuery(null);
            }
        }
        fetchQueryData();
    }, [queryId]);
    const handleLocationSelect = async (locations: string[], location: string) => {
        setSelectedLocation(location);
        try {
            console.log(locations[0]);
            const coords = await geocodeLocation(`${location}, ${locations[0]}`);
            console.log(coords);
            if(coords) {
                setCoordinates(coords);
            } else {
                setCoordinates([77.1025, 28.7041]);
            }
        } catch (error) {
            console.error("Geocoding error: ", error);
            setCoordinates([11.1271, 78.6569]);
        }
    }
    if(!query) {
        return (
            <div className="flex items-center justify-center mt-16 text-white">
                <Loader2 className="animate-spin size-16" />
            </div>
        );
    }
    return (
        <>
            <div className="flex flex-col p-4 mt-4">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">{query.queryText}</h1>
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    <Card className="w-full lg:w-1/4 max-h-[460px] overflow-y-auto rounded-xl mb-8 border-none bg-white/10 backdrop-blur-sm">
                        <CardContent className="p-6">
                            {query.locations.length > 0 ? (
                                <ul className="space-y-3">
                                    {query.locations.map((location, index) => (
                                        <li key={index} className={`text-white text-lg p-3 border-b border-white/20 hover:bg-white/10 transition-colors rounded cursor-pointer ${selectedLocation === location ? 'bg-white/20' : ''}`} onClick={() => handleLocationSelect(query.locations, location)}>
                                            {location}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-white text-center py-8">No locations!</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="w-full lg:w-3/4 max-h-[460px] rounded-xl border-none overflow-hidden">
                        <CardContent className="p-0 h-[460px]">
                            {coordinates ? (
                                <MapWithNoSSR center={coordinates} zoom={13} locationName={selectedLocation || ''} />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-white/10 text-white">
                                    Loading...
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-row gap-4">
                    <Link href={`/profile/${userId}/saved-trips/${queryId}`}>
                        <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                            Back to Itinerary
                        </Button>
                    </Link>
                    <Link href={``}>
                        <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                            Show Directions
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}