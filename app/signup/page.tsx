"use client";

import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiMailLine,
  RiUser6Line,
  RiLoader2Line,
  RiCheckLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { NotificationPreferenceModal } from "@/components/NotificationPreferenceModal";
import { register as registerUser, checkUsername } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const { toast } = useToast();
  const { isLoggedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  useEffect(() => {
    document.title = "Criar Conta — Annita";
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<SignUpForm>({
    mode: "onChange",
  });

  const username = watch("username") || "";
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (!username) {
      setIsUsernameAvailable(null);
      setIsCheckingUsername(false);
      return;
    }

    setIsUsernameAvailable(null);

    // Basic client-side checks to avoid calling API with invalid usernames
    if (
      username.length < 3 ||
      username.length > 15 ||
      !/^[a-z0-9_]+$/.test(username)
    ) {
      setIsCheckingUsername(false);
      return;
    }

    let active = true;

    const delayDebounceFn = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const res = await checkUsername(username);
        if (!active) return;

        if (!res.available) {
          setError("username", {
            type: "manual",
            message: "Este nome de utilizador já existe",
          });
          setIsUsernameAvailable(false);
        } else {
          clearErrors("username");
          setIsUsernameAvailable(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsCheckingUsername(false);
        }
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [username, setError, clearErrors]);

  const password = watch("password") || "";

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const handingRef = useRef(false);

  const strengthLabel =
    password.length === 0
      ? ""
      : passwordStrength <= 2
        ? "Fraca"
        : passwordStrength <= 3
          ? "Média"
          : "Forte";

  const strengthColors =
    password.length === 0
      ? []
      : passwordStrength <= 2
        ? [
            "bg-red-500",
            "bg-gray-200 dark:bg-zinc-700",
            "bg-gray-200 dark:bg-zinc-700",
          ]
        : passwordStrength <= 3
          ? ["bg-amber-500", "bg-amber-500", "bg-gray-200 dark:bg-zinc-700"]
          : ["bg-green-500", "bg-green-500", "bg-green-500"];

  const strengthTextColor =
    password.length === 0
      ? ""
      : passwordStrength <= 2
        ? "text-red-600 dark:text-red-400"
        : passwordStrength <= 3
          ? "text-amber-600 dark:text-amber-400"
          : "text-green-600 dark:text-green-400";

  const mutation = useMutation({
    mutationFn: (data: {
      username: string;
      email: string;
      password: string;
      receiveNotifications: boolean;
    }) => registerUser(data),
  });

  function onSubmit() {
    setShowNotificationModal(true);
  }

  function handleConfirmNotifications() {
    setShowNotificationModal(false);
    submitForm(true);
  }

  function handleDeclineNotifications() {
    setShowNotificationModal(false);
    submitForm(false);
  }

  function submitForm(notifications: boolean) {
    if (handingRef.current) return;
    handingRef.current = true;
    const data = getValues();
    mutation.mutate(
      {
        username: data.username,
        email: data.email,
        password: data.password,
        receiveNotifications: notifications,
      },
      {
        onSuccess: () => {
          handingRef.current = false;
          toast("success", "Conta criada com sucesso!");
          router.push("/signin");
        },
        onError: (error) => {
          handingRef.current = false;
          const message =
            (error as any)?.response?.data?.message ||
            (error as Error)?.message ||
            "Erro ao criar conta";
          toast("error", message);
        },
      },
    );
  }

  return (
    <div className="overflow-x-hidden">
      <main className="pt-32 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-full max-w-xs mx-auto">
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
              Crie a sua conta
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
              Continuar com Google
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700" />
              <span className="text-sm text-zinc-400 dark:text-zinc-500">
                ou
              </span>
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
                  className="w-full outline-none ps-2 text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                  type="text"
                  placeholder="Nome de Utilizador"
                  {...register("username", {
                    required: "O nome de utilizador é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Mínimo de 3 caracteres",
                    },
                    maxLength: {
                      value: 15,
                      message: "Máximo de 15 caracteres",
                    },
                    pattern: {
                      value: /^[a-z0-9_]+$/,
                      message:
                        "Apenas letras minúsculas, números e _ são permitidos",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.toLowerCase();
                    },
                  })}
                />
                {isCheckingUsername && (
                  <RiLoader2Line className="size-5 text-zinc-400 animate-spin shrink-0 ms-2" />
                )}
                {!isCheckingUsername && isUsernameAvailable === true && (
                  <RiCheckLine className="size-5 text-green-500 dark:text-green-400 shrink-0 ms-2" />
                )}
                {!isCheckingUsername && isUsernameAvailable === false && (
                  <RiErrorWarningLine className="size-5 text-red-500 dark:text-red-400 shrink-0 ms-2" />
                )}
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
                  errors.email
                    ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                    : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                }`}
              >
                <RiMailLine className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "O email é obrigatório",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Formato de email inválido",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-3">
                  {errors.email.message}
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
                  className="w-full outline-none ps-2 text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                  type={showPassword ? "text" : "password"}
                  placeholder="Palavra-chave"
                  {...register("password", {
                    required: "A palavra-chave é obrigatória",
                    minLength: {
                      value: 6,
                      message: "Mínimo de 6 caracteres",
                    },
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

              {password.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${strengthColors[i]}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strengthTextColor}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            <div>
              <div
                className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                  errors.confirmPassword
                    ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                    : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                }`}
              >
                <RiLockLine className="size-5 text-zinc-400 shrink-0" />
                <input
                  className="w-full outline-none ps-2 text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar palavra-chave"
                  {...register("confirmPassword", {
                    required: "Confirma a palavra-chave",
                    validate: (value) =>
                      value === getValues("password") ||
                      "As palavras-chave não coincidem",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <RiEyeOffLine className="size-5" />
                  ) : (
                    <RiEyeLine className="size-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-3">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                !isValid ||
                isCheckingUsername ||
                isUsernameAvailable !== true ||
                mutation.isPending
              }
              className="w-full text-base transition-all hover:opacity-75 disabled:opacity-50 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2.5 font-normal flex items-center justify-center gap-2"
            >
              {mutation.isPending ? "A criar conta..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-[15px] text-zinc-500 dark:text-zinc-400 mt-8">
            Já tens conta?{" "}
            <Link
              href="/signin"
              className="text-design-2 dark:text-design-1 hover:underline"
            >
              Iniciar sessão
            </Link>
          </p>
        </div>
      </main>

      <NotificationPreferenceModal
        open={showNotificationModal}
        onClose={handleDeclineNotifications}
        onConfirm={handleConfirmNotifications}
        loading={mutation.isPending}
      />
    </div>
  );
}
