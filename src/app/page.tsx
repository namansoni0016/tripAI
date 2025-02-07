"use client";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RegisterButton } from "@/components/auth/register-button";
import { useCurrentUser } from "../../hooks/use-current-user";
import AuthenticatedHome from "@/components/auth/AuthenticatedHome";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  const user = useCurrentUser();
  return (
    <>
      {user ? (
        <AuthenticatedHome />
      ) : (
      <main className="flex h-full flex-col items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className={cn("text-3xl md:text-6xl font-semibold text-white drop-shadow-md", font.className)}>
            Welcome to, <span className="text-3xl md:text-6xl font-semibold text-red-600">TripAI</span>
          </h1>
          <p className="text-white md:text-xl font-semibold">Your journey, magically planned!</p>
          <div>
            <RegisterButton>
              <Button variant="secondary" className="text-lg font-semibold p-5 rounded-full mt-2 transition-transform duration-300 ease-in-out hover:translate-y-1" >
                Get Started
              </Button>
            </RegisterButton>
          </div>
        </div>
      </main>
      )}
    </>
  );
}
