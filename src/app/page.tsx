"use client";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RegisterButton } from "@/components/auth/register-button";
import { useSession, getSession } from "next-auth/react";
import AuthenticatedHome from "@/components/auth/AuthenticatedHome";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  const session = useSession();
  const updatedSession = getSession();
  return (
    <main className="flex h-full flex-col items-center justify-center">
      {session.data ? (
        <AuthenticatedHome />
      ) : (
        <div className="space-y-6 text-center">
          <h1 className={cn("text-3xl md:text-6xl font-semibold text-white drop-shadow-md", font.className)}>
            Welcome to, <span className="text-3xl md:text-6xl font-semibold text-red-600">TripAI</span>
          </h1>
          <p className="text-white md:text-lg">Your journey, magically planned!</p>
          <div>
            <RegisterButton>
              <Button variant="secondary" size="lg">
                Get Started
              </Button>
            </RegisterButton>
          </div>
        </div>
      )}
    </main>
  );
}
