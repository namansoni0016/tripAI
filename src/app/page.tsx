"use client";
import AuthenticatedHome from "@/components/auth/AuthenticatedHome";
import { HomeContent } from "@/components/auth/HomeContent";
import { Spinner } from "@/components/Spinner";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
  const { user, loading } = useCurrentUser();
  if(loading) return <Spinner />;
  return (
    <>
      {user ? (
        <AuthenticatedHome />
      ) : (
        <HomeContent />
      )}
    </>
  );
}