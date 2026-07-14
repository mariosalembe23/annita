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
  RiPhoneLine,
  RiMapPinLine,
  RiGlobalLine,
  RiBuildingLine,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "@remixicon/react";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { NotificationPreferenceModal } from "@/components/NotificationPreferenceModal";
import {
  register as registerUser,
  checkUsername,
  verifyNif,
} from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

interface CompanySignUpForm {
  companyNif: string;
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  companyWebsite: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const STEPS = [
  { id: 1, label: "Identificação" },
  { id: 2, label: "Contacto" },
  { id: 3, label: "Acesso" },
];

const COMPANY_NIF_REGEX = /^(\d{9,12}|\d{9}[A-Za-z]{2}\d{3})$/; // 9 to 12 digits or 14-char BI

function generateUsernameFromName(name: string): string {
  if (!name) return "";
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_") // Replace spaces/special chars with _
    .replace(/_+/g, "_") // Collapse multiple underscores
    .replace(/^_+|_+$/g, ""); // Trim leading/trailing underscores
  return normalized.substring(0, 15);
}

export default function CompanySignUpPage() {
  const { toast } = useToast();
  const { isLoggedIn } = useUser();
  const router = useRouter();



  useEffect(() => {
    document.title = "Registo de Empresa — Annita";
  }, []);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // NIF verification state
  const [isVerifyingNif, setIsVerifyingNif] = useState(false);
  const [nifVerified, setNifVerified] = useState(false);
  const [nifError, setNifError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
    trigger,
    formState: { errors, isValid },
  } = useForm<CompanySignUpForm>({
    mode: "onChange",
    defaultValues: {
      companyNif: "",
      companyName: "",
      companyPhone: "",
      companyAddress: "",
      companyWebsite: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const companyNif = watch("companyNif") || "";
  const companyName = watch("companyName") || "";
  const username = watch("username") || "";
  const password = watch("password") || "";

  // Reset NIF verification if user changes the NIF
  useEffect(() => {
    setNifVerified(false);
    setNifError(null);
    setValue("companyName", "");
  }, [companyNif, setValue]);

  // Handle NIF Verification
  async function handleVerifyNif() {
    if (!COMPANY_NIF_REGEX.test(companyNif)) {
      setNifError("NIF ou BI inválido. O NIF deve ter 10 dígitos e o BI deve ter 14 caracteres.");
      return;
    }

    setIsVerifyingNif(true);
    setNifError(null);
    setNifVerified(false);

    try {
      const res = await verifyNif(companyNif);
      if (res.success && res.data?.name) {
        setNifVerified(true);
        setValue("companyName", res.data.name);

        // Auto-generate username
        const generatedUser = generateUsernameFromName(res.data.name);
        setValue("username", generatedUser);

        toast("success", "NIF verificado com sucesso!");
      } else {
        setNifError(
          res.message || "O NIF não foi encontrado ou não está registado.",
        );
      }
    } catch (err: any) {
      console.error(err);
      if (err?.status === 500) {
        setNifError("O NIF não foi encontrado ou não está registado.");
      } else {
        setNifError(
          "Erro ao conectar com a API de verificação. Tente novamente.",
        );
      }
    } finally {
      setIsVerifyingNif(false);
    }
  }

  // Username availability check
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

  // Password strength logic
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }, [password]);

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

  // Step navigation actions
  async function nextStep() {
    if (step === 1) {
      if (!nifVerified) {
        setNifError("Por favor, verifique o NIF antes de avançar.");
        return;
      }
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      const isStep2Valid = await trigger([
        "companyPhone",
        "companyAddress",
        "companyWebsite",
      ]);
      if (isStep2Valid) {
        setDirection(1);
        setStep(3);
      }
    }
  }

  function prevStep() {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  }

  // Mutation for registration
  const mutation = useMutation({
    mutationFn: (data: {
      username: string;
      email: string;
      password: string;
      receiveNotifications: boolean;
      role: "COMPANY";
      companyName: string;
      companyNif: string;
      companyPhone: string;
      companyAddress: string;
      companyWebsite: string;
    }) => registerUser(data),
  });

  const handingRef = useRef(false);

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
        role: "COMPANY",
        companyName: data.companyName,
        companyNif: data.companyNif,
        companyPhone: data.companyPhone,
        companyAddress: data.companyAddress,
        companyWebsite: data.companyWebsite,
      },
      {
        onSuccess: () => {
          handingRef.current = false;
          toast("success", "Conta de empresa criada com sucesso!");
          if (isLoggedIn) {
            router.push("/");
          } else {
            router.push("/signin");
          }
        },
        onError: (error) => {
          handingRef.current = false;
          let message = "Erro ao criar conta de empresa";
          if (isAxiosError(error)) {
            message = error.response?.data?.message || error.message || message;
          } else if (error instanceof Error) {
            message = error.message;
          }
          toast("error", message);
        },
      },
    );
  }

  // Slide transition animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="overflow-x-hidden">
      <main className="pt-32 pb-16 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-[90%] max-w-md mx-auto px-4 small:px-0">
          <div className="flex flex-col items-center mb-10">
            <Link href={"/"} className="flex items-center gap-2 mb-1">
              <Image
                src={"/img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-5 mt-1"
                height={100}
              />
              <p className="text-3xl text-design-3 dark:text-white">annita</p>
            </Link>
            <p className="text-zinc-800 dark:text-zinc-400 text-[15px]">
              Registo de Empresa (Parceiro)
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex flex-col gap-2 mb-6 w-full">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <span>
                Passo {step} de {STEPS.length}
              </span>
              <span>{STEPS[step - 1].label}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-design-1 to-design-2 rounded-full"
                initial={{ width: "33.33%" }}
                animate={{ width: `${(step / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="relative ">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-lg font-medium text-zinc-800 dark:text-white mb-2">
                      Identificação da Empresa
                    </h2>
                    {/* NIF */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        NIF ou BI da Empresa
                      </label>
                      <div className="flex gap-2">
                        <div
                          className={`flex-1 flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                            nifError
                              ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                              : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                          }`}
                        >
                          <RiBuildingLine className="size-5 text-zinc-400 shrink-0" />
                          <input
                            className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                            type="text"
                            maxLength={14}
                            placeholder="Ex: 5000481947 ou 002367037LA033"
                            {...register("companyNif", {
                              required: "O NIF ou BI é obrigatório",
                              pattern: {
                                value: COMPANY_NIF_REGEX,
                                message:
                                  "NIF ou BI inválido. O NIF deve ter 10 dígitos e o BI deve ter 14 caracteres.",
                              },
                            })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleVerifyNif}
                          disabled={
                            isVerifyingNif ||
                            !COMPANY_NIF_REGEX.test(companyNif)
                          }
                          className="px-4 py-2.5 bg-design-2 hover:bg-design-2/90 text-white rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          {isVerifyingNif ? (
                            <RiLoader2Line className="size-4 animate-spin" />
                          ) : (
                            "Verificar"
                          )}
                        </button>
                      </div>
                      {nifError && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                          <RiErrorWarningLine className="size-4 shrink-0" />{" "}
                          {nifError}
                        </p>
                      )}
                    </div>

                    {/* Company Name */}
                    {nifVerified && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border border-green-200 dark:border-green-800/30 bg-green-50/50 dark:bg-green-950/10 flex flex-col gap-1"
                      >
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1">
                          <RiCheckLine className="size-4" /> Empresa Confirmada
                        </span>
                        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {companyName}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-lg font-medium text-zinc-800 dark:text-white mb-2">
                      Informações de Contacto
                    </h2>

                    {/* Telefone */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Telefone da Empresa
                      </label>
                      <div
                        className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                          errors.companyPhone
                            ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                            : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                        }`}
                      >
                        <RiPhoneLine className="size-5 text-zinc-400 shrink-0" />
                        <input
                          className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                          type="tel"
                          placeholder="Ex: 923456789"
                          {...register("companyPhone", {
                            required: "O telefone da empresa é obrigatório",
                            pattern: {
                              value: /^9\d{8}$/,
                              message:
                                "Telefone inválido. Deve ter 9 dígitos e começar por 9.",
                            },
                          })}
                        />
                      </div>
                      {errors.companyPhone && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {errors.companyPhone.message}
                        </p>
                      )}
                    </div>

                    {/* Endereço */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Endereço da Empresa
                      </label>
                      <div
                        className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                          errors.companyAddress
                            ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                            : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                        }`}
                      >
                        <RiMapPinLine className="size-5 text-zinc-400 shrink-0" />
                        <input
                          className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                          type="text"
                          placeholder="Ex: Luanda, Talatona, Edifício X"
                          {...register("companyAddress", {
                            required: "O endereço da empresa é obrigatório",
                            minLength: {
                              value: 5,
                              message: "Endereço muito curto",
                            },
                          })}
                        />
                      </div>
                      {errors.companyAddress && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {errors.companyAddress.message}
                        </p>
                      )}
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Website (Opcional)
                      </label>
                      <div
                        className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                          errors.companyWebsite
                            ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                            : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                        }`}
                      >
                        <RiGlobalLine className="size-5 text-zinc-400 shrink-0" />
                        <input
                          className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                          type="text"
                          placeholder="Ex: https://minhaempresa.com"
                          {...register("companyWebsite", {
                            pattern: {
                              value:
                                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                              message: "Formato de URL inválido",
                            },
                          })}
                        />
                      </div>
                      {errors.companyWebsite && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {errors.companyWebsite.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex flex-col gap-4"
                  >
                    <h2 className="text-lg font-medium text-zinc-800 dark:text-white mb-2">
                      Dados de Acesso
                    </h2>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Email Corporativo
                      </label>
                      <div
                        className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                          errors.email
                            ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                            : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                        }`}
                      >
                        <RiMailLine className="size-5 text-zinc-400 shrink-0" />
                        <input
                          className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
                          type="email"
                          placeholder="Email"
                          {...register("email", {
                            required: "O email é obrigatório",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Formato de email inválido",
                            },
                          })}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Nome de Utilizador
                      </label>
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
                        {!isCheckingUsername &&
                          isUsernameAvailable === true && (
                            <RiCheckLine className="size-5 text-green-500 dark:text-green-400 shrink-0 ms-2" />
                          )}
                        {!isCheckingUsername &&
                          isUsernameAvailable === false && (
                            <RiErrorWarningLine className="size-5 text-red-500 dark:text-red-400 shrink-0 ms-2" />
                          )}
                      </div>
                      {errors.username && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* Palavra-chave */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Palavra-chave
                      </label>
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
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
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
                          <p
                            className={`text-xs font-medium ${strengthTextColor}`}
                          >
                            {strengthLabel}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirmar Palavra-chave */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                        Confirmar Palavra-chave
                      </label>
                      <div
                        className={`flex transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border bg-white dark:bg-white/5 ${
                          errors.confirmPassword
                            ? "border-red-400 focus-within:ring-red-100 dark:focus-within:ring-red-500/20 focus-within:border-red-400 dark:focus-within:border-red-500"
                            : "focus-within:ring-blue-100 dark:focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 border-gray-200 dark:border-zinc-700"
                        }`}
                      >
                        <RiLockLine className="size-5 text-zinc-400 shrink-0" />
                        <input
                          className="w-full outline-none ps-2 text-base det:text-[15px] bg-transparent text-zinc-900 dark:text-zinc-100"
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Termos e Condições */}
                    <div className="flex flex-col gap-1.5 mt-2 mb-1">
                      <div className="flex items-start gap-2.5">
                        <input
                          id="acceptTerms"
                          type="checkbox"
                          className="size-4 mt-1 rounded border-gray-300 dark:border-zinc-700 text-design-2 focus:ring-design-2 cursor-pointer dark:bg-zinc-800"
                          {...register("acceptTerms", {
                            required:
                              "Deves aceitar os Termos e a Política de Privacidade",
                          })}
                        />
                        <label
                          htmlFor="acceptTerms"
                          className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-normal select-none"
                        >
                          Li e aceito os{" "}
                          <Link
                            href="/terms"
                            target="_blank"
                            className="text-design-2 dark:text-design-1 hover:underline font-medium"
                          >
                            Termos e Condições
                          </Link>{" "}
                          e a{" "}
                          <Link
                            href="/privacy"
                            target="_blank"
                            className="text-design-2 dark:text-design-1 hover:underline font-medium"
                          >
                            Política de Privacidade
                          </Link>
                          .
                        </label>
                      </div>
                      {errors.acceptTerms && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                          {errors.acceptTerms.message}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form Step Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 font-medium text-sm flex items-center justify-center gap-1.5"
                >
                  <RiArrowLeftLine className="size-4 shrink-0" />
                  Voltar
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={step === 1 && !nifVerified}
                  className="flex-1 transition-all hover:opacity-90 disabled:opacity-50 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2.5 font-medium text-sm flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
                >
                  Seguinte
                  <RiArrowRightLine className="size-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={
                    !isValid ||
                    isCheckingUsername ||
                    isUsernameAvailable !== true ||
                    mutation.isPending
                  }
                  className="flex-1 text-base transition-all hover:opacity-75 disabled:opacity-50 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2.5 font-normal flex items-center justify-center gap-2"
                >
                  {mutation.isPending ? "A registar..." : "Registar Empresa"}
                </button>
              )}
            </div>
          </form>

          {!isLoggedIn && (
            <>
              <p className="text-center text-[15px] text-zinc-500 dark:text-zinc-400 mt-8">
                Já tens conta?{" "}
                <Link
                  href="/signin"
                  className="text-design-2 dark:text-design-1 hover:underline"
                >
                  Iniciar sessão
                </Link>
              </p>
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                É um utilizador individual?{" "}
                <Link
                  href="/signup"
                  className="text-design-2 dark:text-design-1 hover:underline font-medium"
                >
                  Crie uma conta pessoal
                </Link>
              </p>
            </>
          )}
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
