"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useServerInsertedHTML } from "next/navigation";
import { useRef, useState } from "react";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      }),
  );

  const themeScriptInserted = useRef(false);
  useServerInsertedHTML(() => {
    if (themeScriptInserted.current) return null;
    themeScriptInserted.current = true;
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
        }}
      />
    );
  });

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="pt">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
