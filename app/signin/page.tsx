"use client";

import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiUser6Line,
} from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EmailVerificationModal } from "@/components/EmailVerificationModal";
import { login as loginUser } from "@/lib/api/auth";
import { decodeToken, setCookie } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface SignInForm {
  username: string;
  password: string;
}

export default function SignInPage() {
  const { toast } = useToast();
  const { isLoggedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  useEffect(() => {
    document.title = "Iniciar Sessão — Annita";
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const handingRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (data: SignInForm) => loginUser(data),
  });

  function onSubmit(data: SignInForm) {
    if (handingRef.current) return;
    handingRef.current = true;
    mutation.mutate(data, {
      onSuccess: (response) => {
        handingRef.current = false;
        const token =
          typeof response === "string"
            ? response
            : (response as any)?.token;
        if (!token) {
          handingRef.current = false;
          return;
        }
        const payload = decodeToken(token);
        if (payload && !payload.is_email_verified) {
          setPendingToken(token);
          setPendingEmail(payload.email);
          setShowVerification(true);
        } else {
          setCookie("token", token);
          toast("success", "Sessão iniciada com sucesso!");
          router.push("/");
        }
      },
      onError: (error) => {
        handingRef.current = false;
        const message =
          (error as any)?.response?.data?.message ||
          (error as Error)?.message ||
          "Erro ao iniciar sessão";
        toast("error", message);
      },
    });
  }

  function handleVerified() {
    if (pendingToken) {
      setCookie("token", pendingToken);
    }
    setShowVerification(false);
    toast("success", "Sessão iniciada com sucesso!");
    router.push("/");
  }

  return (
    <div className="overflow-x-hidden">
      <main className="pt-32 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-[90%] pot:max-w-xs mx-auto px-4 small:px-0">
          <div className="flex flex-col items-center mb-10">
            <Link href={"/"} className="flex items-center gap-2 mb-1">
              <Image
                src={"img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-5 mt-1"
                height={100}
              />
              <p className="text-3xl text-design-3 dark:text-white">annita</p>
            </Link>
            <p className="text-zinc-800 dark:text-zinc-400 text-[15px]">
              Inicie sessão para continuar
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-base font-normal text-zinc-900 dark:text-zinc-100 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Image
                src={"/img/google.png"}
                alt={"Google icon"}
                width={25}
                height={25}
              />
              Entrar com Google
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700" />
              <span className="text-sm text-zinc-400 dark:text-zinc-500">ou</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700" />
            </div>

            <div>
              <div
                className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                  errors.username
                    ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                    : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                }`}
              >
                <RiUser6Line className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                  type="text"
                  placeholder="Email ou nome de utilizador"
                  {...register("username", {
                    required: "O email ou nome de utilizador é obrigatório",
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-3">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <div
                className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                  errors.password
                    ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                    : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                }`}
              >
                <RiLockLine className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                  type={showPassword ? "text" : "password"}
                  placeholder="Palavra-chave"
                  {...register("password", {
                    required: "A palavra-chave é obrigatória",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <RiEyeOffLine className="size-5" />
                  ) : (
                    <RiEyeLine className="size-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-3">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full text-base transition-all hover:opacity-75 disabled:opacity-50 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2.5 font-normal flex items-center justify-center gap-2"
            >
              {mutation.isPending ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-[15px] text-zinc-500 dark:text-zinc-400 mt-8">
            Não tens conta?{" "}
            <Link href="/signup" className="text-design-2 dark:text-design-1 hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </main>

      {pendingToken && (
        <EmailVerificationModal
          open={showVerification}
          token={pendingToken}
          email={pendingEmail}
          onVerified={handleVerified}
          onClose={() => setShowVerification(false)}
        />
      )}
    </div>
  );
}
