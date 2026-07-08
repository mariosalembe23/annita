"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useServerInsertedHTML } from "next/navigation";
import { useRef, useState } from "react";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Client ID público — seguro no cliente. A validação real acontece no backend,
// que verifica o ID token do Google contra as chaves públicas da Google.
const GOOGLE_CLIENT_ID =
  "838952091956-3ssel8nsrf0l2sbgqcdcl2jlmj2i6nan.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      })
  );

  // Injeta o script de tema apenas no HTML do servidor (nunca na árvore React
  // do cliente), aplicando a classe "dark" antes da hidratação para evitar
  // flash. Renderizar um <script> diretamente num componente dispara um aviso
  // do React ("scripts are never executed when rendering on the client").
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
