"use client";
import { IoIosSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createSavedQuery } from "@/actions/query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { aiGeneration } from "@/actions/gemini";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

const AuthenticatedHome = () => {
    const { data: session } = useSession();
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<{
        itinerary: string;
        isRelated: boolean;
        locations: string[];
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [displayText, setDisplayText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [textGenerated, setTextGenerated] = useState(false);
    const userId = session?.user?.id;
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(response?.itinerary && response.itinerary.length > 0) {
            let index = 0;
            setDisplayText("");
            const interval = setInterval(() => {
                if(index < response.itinerary.length) {
                    setDisplayText(prev => prev + response.itinerary[index]);
                    index++;
                    if(cardRef.current) {
                        cardRef.current.scrollTo({
                            top: cardRef.current.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    clearInterval(interval);
                    setTextGenerated(true);
                }
            }, 10);
            return () => clearInterval(interval);
        }
    }, [response]);
    const fetchResponse = async () => {
        if(!userId) {
            console.error("User not authenticated!");
            return;
        }
        if(!query.trim()) return;
        setLoading(true);
        setResponse(null);
        setDisplayText("");
        setTextGenerated(false);
        try {
            const generatedResponse = await aiGeneration(query);
            setResponse(generatedResponse);
            if(!generatedResponse.isRelated) {
                setResponse({
                    itinerary: generatedResponse.itinerary,
                    isRelated: false,
                    locations: []
                })
            }
        } catch (error) {
            console.error("Error generating response: ", error);
            setResponse({
                itinerary: "An error occured while generating your response!",
                isRelated: false,
                locations: []
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if(cardRef.current) {
            cardRef.current.scrollTo({
                top: cardRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [displayText]);
    const handleSubmit = async() => {
        if(!userId) {
            console.error("User not authenticated!");
            return;
        }
        if(!displayText.trim()) return;
        setIsSaving(true);
        try {
            const saved = await createSavedQuery(userId, query, displayText, response?.locations || []);
            if(saved?.success) {
                setQuery("");
                setDisplayText("");
                setResponse(null);
                toast.success("Trip saved successfully!");
            }
        } catch (error) {
            console.log("Failed to save trip: ", error);
            toast.error("Failed to save trip!");
        } finally {
            setIsSaving(false);
        }
    }
    const handleClear = () => {
        setQuery("");
        setDisplayText("");
        setResponse(null);
    }
    return (
        <div className="flex flex-col items-center justify-center mt-4 px-4 w-full">
            <h2 className="text-2xl md:text-4xl font-bold text-white">Generate your perfect trip!</h2>
            <div className="flex flex-row mt-4 w-full max-w-[800px] bg-white border-none rounded-full px-3 py-1 md:px-4 md:py-2 items-center">
                <textarea placeholder="Message TripAI" value={query} onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 py-2 md:py-3 px-2 md:px-3 text-slate-700 rounded-full border-none focus-visible:ring-0 text-base md:text-lg max-h-[200px] min-h-[50px] outline-none overflow-y-auto resize-none"
                    rows={1} />
                <Button onClick={fetchResponse} variant={"outline"} className="flex items-center justify-center rounded-full border-none shadow-none p-2 md:p-3" disabled={!query || loading}>
                    {loading ? (
                        <div className="flex items-center">
                            <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <IoIosSend className="w-6 h-6 md:w-10 md:h-10 text-gray-700 cursor-pointer hover:text-gray-600 transition-colors duration-300 transform scale-125 md:scale-150"/>
                    )}
                </Button>
            </div>
            {loading && !response && (
                <Card className="w-full max-w-[800px] min-h-[150px] md:min-h-[200px] rounded-3xl mt-4 mb-2 border-none bg-gray-50">
                    <CardContent className="p-4 md:p-6 flex flex-col space-y-3">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-300 animate-pulse"></div>
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-300 animate-pulse delay-75"></div>
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray-300 animate-pulse delay-150"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {response && (
                <div className="flex flex-col items-center w-full">
                    <Card ref={cardRef} className="w-full max-w-[800px] max-h-[400px] md:max-h-[460px] overflow-y-auto rounded-3xl mt-4 mb-2 border-none transition-all duration-300 shadow-lg">
                        <CardContent className="p-4 md:p-6 whitespace-break-spaces text-slate-700 text-sm md:text-base">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {displayText}
                            </ReactMarkdown>
                            {!textGenerated && (
                                <div className="inline-block ml-1 w-1.5 h-4 md:w-2 md:h-6 bg-blue-500 animate-pulse"></div>
                            )}
                        </CardContent>
                    </Card>
                    {textGenerated && (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full max-w-[800px] justify-center">
                            {response.isRelated ? (
                                <div className="flex space-x-4">
                                    <Button variant="secondary" onClick={handleSubmit} disabled={!displayText.trim() || isSaving} className="text-base md:text-lg text-slate-700 font-semibold p-3 md:p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1 w-full sm:w-auto">
                                        {isSaving ? "Saving..." : "Save Trip"}
                                    </Button>
                                    <Button variant="secondary" onClick={handleClear} className="text-base md:text-lg text-slate-700 font-semibold p-3 md:p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1 w-full sm:w-auto">
                                        Clear
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="secondary" onClick={handleClear} className="text-base md:text-lg text-slate-700 font-semibold p-3 md:p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1 w-full sm:w-auto">
                                    Clear
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AuthenticatedHome;