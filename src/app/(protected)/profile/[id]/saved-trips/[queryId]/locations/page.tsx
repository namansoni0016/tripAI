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
import { Spinner } from "@/components/Spinner";

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
            const coords = await geocodeLocation(`${location}, ${locations[0]}`);
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
    if(!query) return <Spinner />
    return (
        <>
            <div className="flex flex-col p-4 md:p-6">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-8 text-center">{query.queryText}</h1>
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full">
                    <Card className="w-full lg:w-1/3 max-h-[300px] md:max-h-[460px] overflow-y-auto rounded-lg md:rounded-xl border-none bg-white/10 backdrop-blur-sm">
                        <CardContent className="p-3 md:p-6">
                            {query.locations.length > 0 ? (
                                <ul className="space-y-2 md:space-y-3">
                                    {query.locations.map((location, index) => (
                                        <li key={index} className={`text-sm md:text-base text-white p-2 md:p-3 border-b border-white/20 hover:bg-white/10 transition-colors rounded cursor-pointer ${selectedLocation === location ? 'bg-white/20' : ''}`} onClick={() => handleLocationSelect(query.locations, location)}>
                                            {location}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-white text-center py-6 md:py-8">No locations!</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="w-full lg:w-2/3 h-[300px] md:h-[460px] rounded-lg md:rounded-xl border-none overflow-hidden">
                        <CardContent className="p-0 h-full">
                            {coordinates ? (
                                <MapWithNoSSR center={coordinates} zoom={13} locationName={selectedLocation || ''} />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-white/10 text-white">
                                    <Loader2 className="animate-spin size-8 mr-2" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-3 w-full justify-center">
                    <Link href={`/profile/${userId}/saved-trips/${queryId}`} className="w-full sm:w-auto">
                        <Button variant="secondary" className="w-full text-base font-semibold md:text-lg p-3 md:p-4 rounded-full transition-transform duration-300 ease-in-out hover:translate-y-1">
                            Back to Itinerary
                        </Button>
                    </Link>
                    <Link href={coordinates ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}` : "#" } target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto"> 
                        <Button variant="secondary" className="w-full text-base font-semibold md:text-lg p-3 md:p-4 rounded-full transition-transform duration-300 ease-in-out hover:translate-y-1" disabled={!coordinates}>
                            Show Directions
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}