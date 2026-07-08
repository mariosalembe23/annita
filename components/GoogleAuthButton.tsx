"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loginWithGoogle } from "@/lib/api/auth";
import { decodeToken, setCookie } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { notifyAuthChange } from "@/hooks/use-user";
import { useTheme } from "@/hooks/use-theme";

interface GoogleAuthButtonProps {
  /** Texto do botão renderizado pela Google. */
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

/**
 * Botão de autenticação com Google usando o componente <GoogleLogin> do
 * Google Identity Services (fluxo de ID token).
 *
 * Fluxo:
 * 1. A Google devolve um `credential` (ID token JWT) em `onSuccess`.
 * 2. Enviamos esse idToken para o backend (`/auth/google` via loginWithGoogle).
 * 3. O backend valida o ID token contra as chaves públicas da Google e devolve
 *    o nosso próprio JWT, que guardamos em cookie e usamos para redirecionar.
 *
 * Requer o <GoogleOAuthProvider> (montado em components/Providers.tsx).
 */
export function GoogleAuthButton({
  text = "continue_with",
}: GoogleAuthButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { theme } = useTheme();

  // O widget da Google exige uma largura em píxeis (200–400). Medimos o
  // contentor para o botão acompanhar a largura do formulário de forma responsiva.
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setWidth(
        Math.min(
          400,
          Math.max(200, Math.round(el.getBoundingClientRect().width)),
        ),
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast("error", "Não foi possível obter as credenciais do Google.");
      return;
    }

    try {
      const data = await loginWithGoogle(idToken);
      const token = data?.token;
      if (!token) {
        toast("error", "Resposta inválida do servidor.");
        return;
      }
      const payload = decodeToken(token);
      if (!payload) {
        toast("error", "Token inválido recebido.");
        return;
      }
      setCookie("token", token);
      notifyAuthChange();
      toast("success", "Sessão iniciada com sucesso!");
      router.push("/");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        "Erro ao autenticar com Google";
      toast("error", message);
    }
  }

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast("error", "Falha ao autenticar com Google.")}
        theme={theme === "dark" ? "filled_black" : "outline"}
        text={text}
        shape="rectangular"
        size="large"
        logo_alignment="center"
        width={width}
        containerProps={{ className: "rounded-lg" }}
      />
    </div>
  );
}
