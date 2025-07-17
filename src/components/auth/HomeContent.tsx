import { motion } from "framer-motion";
import { FaTruckPlane } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RegisterButton } from "@/components/auth/register-button";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

export function HomeContent() {
    return (
        <>
            <main className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 to-black">
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <motion.div key={i} className="absolute rounded-full bg-red-500/10"
                            initial={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 6 + 3}px`,
                                height: `${Math.random() * 6 + 3}px`,
                                opacity: 0
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
                            <h1 className={cn("text-3xl sm:text-4xl md:text-6xl font-bold text-white drop-shadow-md", font.className )}>
                                Welcome to <span className="text-red-600">TripAI</span>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-gray-400 mt-2 md:mt-4 px-2">
                                Your smart travel companion that magically plans perfect journeys!
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="pt-2"
                        >
                            <RegisterButton>
                                <Button variant="secondary" size="lg"
                                    className={cn(
                                        "text-base sm:text-lg font-semibold px-6 py-5 sm:px-8 sm:py-6 rounded-full",
                                        "bg-gradient-to-r from-red-600 to-red-700 text-white",
                                        "hover:from-red-600 hover:to-red-700",
                                        "transition-all duration-300 hover:scale-[1.03] hover:shadow-lg",
                                        "shadow-md shadow-red-500/20",
                                        font.className
                                    )}
                                >Get Started</Button>
                            </RegisterButton>
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
                                { text: "Personalized", subtext: "Experiences" }
                            ].map((item, index) => (
                                <div key={index} className="text-center px-1">
                                    <div className="text-red-600 text-lg sm:text-xl md:text-2xl font-bold">
                                        {item.text}
                                    </div>
                                    <div className="text-gray-400 text-xs sm:text-sm">
                                        {item.subtext}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
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
        </>
    )
}