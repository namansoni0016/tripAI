import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
import { auth } from "@/auth";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TripAI",
  description: "Your smart travel companion, powered by AI!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 to-black h-[580px] md:h-[700px]`}>
          <Navbar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
