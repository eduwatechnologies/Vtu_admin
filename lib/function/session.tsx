"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  console.log("Session in ProtectedRoute:", session);
  const router = useRouter();

  if (status === "loading") return null; // or spinner

  if (!session || !session.accessToken) {
    router.replace("/auth/login");
    return null;
  }

  return <>{children}</>;
}
