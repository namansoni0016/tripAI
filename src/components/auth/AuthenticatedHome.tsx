"use client";
import { IoIosSend } from "react-icons/io";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUERY_DATA } from "@/constants/data";

const AuthenticatedHome = () => {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [displayText, setDisplayText] = useState("");
    const [textGenerated, setTextGenerated] = useState(false);
    const fetchResponse = async () => {
        setLoading(true);
        setResponse("");
        setDisplayText("");
        setTextGenerated(false);
        setTimeout(() => {
            const generatedResponse = QUERY_DATA;
            setResponse(generatedResponse);
            setLoading(false);
        }, 2000);
    };
    useEffect(() => {
        if(response) {
            let index = 0;
            const interval = setInterval(() => {
                if(index < response.length) {
                    setDisplayText((prev) => prev + response[index]);
                    index++;
                } else {
                    clearInterval(interval);
                    setTextGenerated(true);
                }
            }, 10);
            return () => clearInterval(interval);
        }
    }, [response]);
    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <h2 className="text-4xl font-bold text-white">Generate your perfect trip!</h2>
            <div className="flex flex-row mt-4 w-[800px] bg-white border-none rounded-full px-4 py-2 items-center">
                <textarea placeholder="Message TripAI" value={query} onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 py-3 px-3 rounded-full border-none focus-visible:ring-0 text-lg bg-white max-h-[200px] min-h-[50px] outline-none overflow-y-auto resize-none"
                    rows={1} />
                <Button onClick={fetchResponse} variant={"outline"} className="flex items-center justify-center rounded-full border-none shadow-none p-3" disabled={!query || loading}>
                    <IoIosSend className="w-10 h-10 text-gray-600 cursor-pointer hover:text-gray-500 transition-colors duration-300 transform scale-150"/>
                </Button>
            </div>
            {response && (
                <div className="flex flex-col items-center">
                    <Card className="w-[800px] max-h-[460px] overflow-y-auto rounded-xl mt-4 mb-2 border-none transition-all duration-300">
                        <CardContent className="p-4">
                            <p className="whitespace-pre-line">{displayText}</p>
                        </CardContent>
                    </Card>
                    {textGenerated && (
                        <Button variant="secondary" className="text-lg text-slate-700 font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1">
                            Save Trip
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default AuthenticatedHome;