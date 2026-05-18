"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import Loading from "./loading";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication status is determined
    if (!isLoading) {
      if (isAuthenticated) {
        // If authenticated, redirect to the dashboard
        router.replace("/dashboard");
      } else {
        // If not authenticated, redirect to the login page
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Display a full-screen loading component while the check is in progress
  return <Loading />;
}