"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api/auth";
import { decodeToken, getCookie } from "@/lib/utils";

export function useUser() {
  const [session, setSession] = useState<{
    token: string;
    userId: string;
  } | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    setHasChecked(true);
    if (!token) return;
    const payload = decodeToken(token);
    if (payload?.userId) {
      setSession({ token, userId: payload.userId });
    }
  }, []);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", session?.userId],
    queryFn: () => getUser(session!.userId, session!.token),
    enabled: !!session?.userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user ?? null,
    isLoading: !hasChecked || isLoading,
    isLoggedIn: !!user,
    token: session?.token ?? null,
    payload: session ? decodeToken(session.token) : null,
    error,
  };
}
