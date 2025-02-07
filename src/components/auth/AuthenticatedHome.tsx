"use client"
import { Input } from "@/components/ui/input";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AuthenticatedHome = () => {
    const [query, setQuery] = useState("");
    return (
        <div className="flex flex-col items-center justify-center mt-8">
            <h2 className="text-4xl font-bold text-white">Generate your perfect trip!</h2>
            <div className="flex flex-row mt-4 w-[800px] bg-white border-none rounded-full px-4 py-2 items-center">
                {/* <Input placeholder="Type here..." value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    className="flex-1 p-6 rounded-full border-none focus-visible:ring-0 text-lg" 
                    aria-multiline="true"/> */}
                    <textarea placeholder="Message TripAI" value={query} onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 py-3 px-3 rounded-full border-none focus-visible:ring-0 text-lg bg-white max-h-[200px] min-h-[50px] outline-none overflow-y-auto resize-none"
                        rows={1} />
                <Button variant={"outline"} className="flex items-center justify-center rounded-full border-none shadow-none p-3">
                    <IoIosSend className="w-10 h-10 text-gray-600 cursor-pointer hover:text-gray-500 transition-colors duration-300 transform scale-150"/>
                </Button>
            </div>
        </div>
    );
}

export default AuthenticatedHome;