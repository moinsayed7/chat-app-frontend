"use client";
import { useEffect } from "react";
import SearchCont from "../searchCont";
import { useRouter } from "next/navigation";

export default function UsersSearch() {
  const router = useRouter();
  useEffect(() => {
    async function isLoggedIn() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
          { credentials: "include" },
        );
        if (!response.ok) {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    }
    isLoggedIn();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs p-4 sm:p-6">
        <SearchCont />
      </div>
    </div>
  );
}
