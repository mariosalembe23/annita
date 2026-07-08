"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api/auth";
import { decodeToken, getCookie, removeCookie } from "@/lib/utils";

export const AUTH_CHANGED_EVENT = "auth:changed";

export function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function useUser() {
  const [session, setSession] = useState<{
    token: string;
    userId: string;
  } | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    function checkSession() {
      const token = getCookie("token");
      setHasChecked(true);
      if (!token) {
        setSession(null);
        return;
      }
      const payload = decodeToken(token);
      if (payload?.exp && payload.exp * 1000 <= Date.now()) {
        removeCookie("token");
        setSession(null);
        return;
      }
      if (payload?.userId) {
        setSession({ token, userId: payload.userId });
      }
    }

    checkSession();
    window.addEventListener(AUTH_CHANGED_EVENT, checkSession);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, checkSession);
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
