import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 to-black">
      <div className="space-y-1 text-center text-gray-200">
        <h1 className="text-6xl font-semibold">
          Welcome to, <span className="text-6xl font-semibold text-red-600 drop-shadow-md">TripAI</span>
        </h1>
        <p className="text-xl font-medium">Your journey, magically planned!</p>
        <Button asChild variant="link">
          <Link href="/register" className="text-xl text-blue-400 hover:text-blue-700">Get started...</Link>
        </Button>
      </div>
    </main>
  );
}
