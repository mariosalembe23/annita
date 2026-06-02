"use client";

import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiMailLine,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EmailVerificationModal } from "@/components/EmailVerificationModal";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowVerification(true);
  }

  return (
    <div className="overflow-x-hidden">
      <main className="pt-32 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-10">
            <Link href={"/"} className="flex items-center gap-2 mb-1">
              <Image
                src={"img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-5 mt-1"
                height={100}
              />
              <p className="text-3xl text-design-3">annita</p>
            </Link>
            <p className="text-zinc-800 text-[15px]">
              Inicie sessão para continuar
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 text-base font-normal text-zinc-900 hover:bg-gray-50 transition-colors"
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
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-zinc-400">ou</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div>
              <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
                <RiMailLine className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-[15px]"
                  type="email"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
                <RiLockLine className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-[15px]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Palavra-chave"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? (
                    <RiEyeOffLine className="size-5" />
                  ) : (
                    <RiEyeLine className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2.5 font-normal flex items-center justify-center gap-2"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-[15px] text-zinc-500 mt-8">
            Não tens conta?{" "}
            <Link href="/signup" className="text-design-2 hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </main>

      <EmailVerificationModal
        open={showVerification}
        onClose={() => setShowVerification(false)}
      />
    </div>
  );
}
