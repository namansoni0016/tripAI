import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RegisterButton } from "@/components/auth/register-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 to-black">
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
    </main>
  );
}
