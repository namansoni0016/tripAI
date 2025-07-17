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
import { motion } from "framer-motion";
import { FaTruckPlane } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

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
            let text = "";
            setDisplayText("");
            const interval = setInterval(() => {
                if(index < response.itinerary.length) {
                    text += response.itinerary.charAt(index);
                    setDisplayText(text);
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
        <>
            {response ? (
                <div className="flex flex-col items-center justify-center mt-4 px-4 w-full">
                    <h2 className="text-2xl md:text-4xl font-bold text-white">
                        Generate your perfect <span className="text-red-600">Trip</span>
                    </h2>
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
            ) : (
                <main className="flex flex-col items-center pt-4 pb-4 w-full relative overflow-hidden min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 to-black">
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(15)].map((_, i) => (
                            <motion.div key={i} className="absolute rounded-full bg-red-500/10"
                                initial={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 6 + 3}px`,
                                    height: `${Math.random() * 6 + 3}px`,
                                    opacity: 0,
                                }}
                                animate={{ opacity: [0, 0.2, 0], scale: [1, 1.3, 1.6] }}
                                transition={{ duration: Math.random() * 8 + 8, repeat: Infinity, ease: "linear" }}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-center h-full w-full px-4 z-10 py-8">
                        <div className="max-w-4xl w-full space-y-6 md:space-y-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center"
                            >
                                <FaTruckPlane className="w-8 h-8 md:w-12 md:h-12 text-red-600 mb-2 md:mb-4" />
                                <h1 className={cn("text-3xl sm:text-4xl md:text-6xl font-bold text-white drop-shadow-md", font.className)}>
                                    Welcome to <span className="text-red-600">TripAI</span>
                                </h1>
                                <p className="text-base sm:text-lg md:text-xl text-gray-400 mt-2 md:mt-4 px-2">
                                    Your smart travel companion that magically plans perfect journeys!
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mt-6 sm:mt-10 md:mt-12"
                            >
                                {[
                                    { text: "AI-Powered", subtext: "Planning" },
                                    { text: "Interactive", subtext: "Maps" },
                                    { text: "Personalized", subtext: "Experiences" },
                                ].map((item, index) => (
                                    <div key={index} className="text-center px-1">
                                        <div className="text-red-600 text-lg sm:text-xl md:text-2xl font-bold">{item.text}</div>
                                        <div className="text-gray-400 text-xs sm:text-sm">{item.subtext}</div>
                                    </div>
                                ))}
                            </motion.div>
                            <div className="w-full flex justify-center mt-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="flex flex-row w-full max-w-[800px] bg-white border-none rounded-full px-3 py-1 md:px-4 md:py-2 items-center"
                                >
                                    <textarea placeholder="Message TripAI" value={query} onChange={(e) => setQuery(e.target.value)}
                                        className="flex-1 py-2 md:py-3 px-2 md:px-3 text-slate-700 rounded-full border-none focus-visible:ring-0 text-base md:text-lg max-h-[200px] min-h-[50px] outline-none overflow-y-auto resize-none"
                                        rows={1}
                                    />
                                    <Button onClick={fetchResponse} variant={"outline"} disabled={!query || loading}
                                        className="flex items-center justify-center rounded-full border-none shadow-none p-2 md:p-3"
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <IoIosSend className="w-6 h-6 md:w-10 md:h-10 text-gray-700 cursor-pointer hover:text-gray-600 transition-colors duration-300 transform scale-125 md:scale-150" />
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        className="hidden sm:block absolute bottom-1/4 left-1/4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500/20 blur-xl"
                        animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="hidden sm:block absolute top-1/3 right-1/4 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-blue-500/10 blur-xl"
                        animate={{ scale: [1, 1.2, 1], x: [0, 15, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </main>
            )}
        </>
    );
}

export default AuthenticatedHome;