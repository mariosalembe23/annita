"use client";

import {
  RiMailLine,
  RiMailSendFill,
  RiUser6Line,
} from "@remixicon/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Confetti } from "@/components/ui/confetti";
import { getCategories } from "@/lib/api/events";
import { subscribeNewsletter } from "@/lib/api/newsletter";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface NewsletterForm {
  name: string;
  email: string;
}

const STEPS = [
  { num: 1, title: "Categorias" },
  { num: 2, title: "Dados" },
];

const MIN_CATEGORIES = 3;

export default function NewsletterPage() {
  const { toast } = useToast();
  const { token, isLoading: userLoading } = useUser();

  const [[step, direction], setStep] = useState([0, 0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    document.title = "Newsletter — Annita";
  }, []);

  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token!, 1, 1000),
    enabled: !!token,
  });

  const categories = categoriesResponse?.data ?? [];
  const loadingCategories = userLoading || categoriesLoading;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<NewsletterForm>({ mode: "onChange" });

  const mutation = useMutation({
    mutationFn: (data: NewsletterForm) =>
      subscribeNewsletter({
        name: data.name.trim(),
        email: data.email.trim(),
        categoryIds: selectedCategories,
      }),
    onSuccess: () => {
      setSubscribed(true);
      toast("success", "Inscrição feita com sucesso!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao subscrever a newsletter";
      toast("error", message);
    },
  });

  function toggleCategory(id: string) {
    setCategoriesError(null);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function goToStep(next: number) {
    if (next < 0 || next > STEPS.length - 1) return;
    setStep([next, next > step ? 1 : -1]);
  }

  async function handleNext() {
    if (step === 0) {
      const required =
        categories.length > 0
          ? Math.min(MIN_CATEGORIES, categories.length)
          : MIN_CATEGORIES;
      if (selectedCategories.length < required) {
        setCategoriesError(
          `Seleciona pelo menos ${required} categorias para continuar`,
        );
        return;
      }
    }
    if (step === 1) {
      const valid = await trigger(["name", "email"]);
      if (!valid) return;
    }
    goToStep(step + 1);
  }

  function handleSubscribe() {
    handleSubmit((data) => mutation.mutate(data))();
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 240 : -240, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -240 : 240, opacity: 0 }),
  };

  return (
    <div className="overflow-x-hidden h-dvh bg-[#f5f5f5]">
      <main className="h-screen grid grid-cols-1">
        <section className="h-full overflow-y-auto py-20 relative w-full">
          <button
            onClick={() => window.history.back()}
            className="absolute size-9 rounded-full bg-gray-100 flex items-center justify-center top-6 right-6 text-zinc-600 hover:text-zinc-700 transition-opacity"
          >
            <X className="size-5" />
          </button>
          <div className="max-w-lg mx-auto px-4">
            {subscribed ? (
              <>
                <Confetti
                  className="fixed w-full inset-0 pointer-events-none z-50"
                  options={{
                    particleCount: 120,
                    spread: 180,
                    startVelocity: 40,
                    origin: { y: 0.15 },
                    colors: [
                      "#6366f1",
                      "#8b5cf6",
                      "#a855f7",
                      "#c084fc",
                      "#f472b6",
                      "#22d3ee",
                      "#34d399",
                    ],
                  }}
                />
                <Confetti
                  className="fixed w-full inset-0 pointer-events-none z-50"
                  options={{
                    particleCount: 100,
                    spread: 160,
                    startVelocity: 30,
                    origin: { y: 0.5 },
                    colors: [
                      "#6366f1",
                      "#8b5cf6",
                      "#a855f7",
                      "#c084fc",
                      "#f472b6",
                      "#22d3ee",
                    ],
                  }}
                />
              <div className="flex max-w-[90%] mx-auto border rounded-2xl border-zinc-200 px-5 py-14 flex-col items-center text-center gap-4 mt-20">
                <div className="pot:mt-3 mt-7">
                  <Image
                    src={"/img/happy.png"}
                    alt="icon"
                    width={100}
                    height={100}
                    className="w-20 mb-4"
                  />
                </div>
                <h1 className="text-3xl font-medium">Inscrição confirmada!</h1>
                <p className="text-zinc-600 text-[15px] max-w-sm">
                  Obrigado por subscreveres a nossa newsletter. Vais passar a
                  receber as novidades dos eventos tech em Angola no teu email.
                </p>
                <Link href={"/"}>
                  <button className="mt-2 text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-4 py-2 font-normal">
                    Voltar ao início
                  </button>
                </Link>
              </div>
              </>
            ) : (
              <>
                <header className="mb-6">
                  <Link href={"/"} className="flex mb-8 items-center gap-2">
                    <Image
                      src={"/img-logo/simple-logo.svg"}
                      alt={"Logo"}
                      width={100}
                      className="w-8 mt-1"
                      height={100}
                    />
                  </Link>
                  <h1 className="text-3xl mt-4 font-medium">
                    Subscrever newsletter
                  </h1>
                  <p className="text-zinc-500 text-[15px] mt-1">
                    Recebe no teu email os próximos eventos tech em Angola —
                    meetups, conferências, hackathons e muito mais.
                  </p>
                </header>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-design-1 to-design-2 rounded-full"
                      animate={{
                        width: `${((step + 1) / STEPS.length) * 100}%`,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    <div className="flex flex-col gap-5">
                      {step === 0 && (
                        <div className="">
                          <label className="text-sm mb-6 font-medium text-zinc-700 flex items-center justify-between">
                            <span>
                              Categorias de interesse{" "}
                              <span className="text-zinc-400 font-normal">
                                (seleciona pelo menos {MIN_CATEGORIES})
                              </span>
                            </span>
                            {categories.length > 0 && (
                              <span
                                className={`font-normal ${
                                  selectedCategories.length >= MIN_CATEGORIES
                                    ? "text-design-2"
                                    : "text-zinc-400"
                                }`}
                              >
                                {selectedCategories.length}/{MIN_CATEGORIES}
                              </span>
                            )}
                          </label>
                          {loadingCategories ? (
                            <div className="flex flex-wrap gap-2">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="h-9 w-28 rounded-lg bg-gray-200 animate-pulse"
                                />
                              ))}
                            </div>
                          ) : categories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {categories.map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => toggleCategory(cat.id)}
                                  className={`px-3 py-1.5 rounded-lg border text-[15px] transition-all ${
                                    selectedCategories.includes(cat.id)
                                      ? "border-design-2 bg-design-2 text-white font-medium"
                                      : "border-gray-200 bg-white text-zinc-600 hover:border-gray-300"
                                  }`}
                                >
                                  {cat.name}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-zinc-500 bg-white border border-gray-200 rounded-lg px-3 py-2.5">
                              {token ? (
                                "Sem categorias disponíveis de momento. Tenta novamente mais tarde."
                              ) : (
                                <>
                                  Precisas de{" "}
                                  <Link
                                    href={"/signin"}
                                    className="text-design-2 hover:underline"
                                  >
                                    iniciar sessão
                                  </Link>{" "}
                                  para escolheres as categorias de interesse.
                                </>
                              )}
                            </p>
                          )}
                          {categoriesError && (
                            <p className="text-red-500 text-sm mt-5">
                              {categoriesError}
                            </p>
                          )}
                        </div>
                      )}

                      {step === 1 && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-zinc-700 mb-2 block">
                              Nome
                            </label>
                            <div
                              className={`flex bg-white transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border ${
                                errors.name
                                  ? "border-red-400 focus-within:ring-red-100 focus-within:border-red-400"
                                  : "focus-within:ring-blue-100 focus-within:border-blue-400 border-gray-200"
                              }`}
                            >
                              <RiUser6Line className="size-5 text-zinc-400 shrink-0" />
                              <input
                                className="w-full outline-none ps-2 text-[15px]"
                                type="text"
                                placeholder="O teu nome"
                                {...register("name", {
                                  required: "O nome é obrigatório",
                                  minLength: {
                                    value: 2,
                                    message:
                                      "O nome deve ter pelo menos 2 caracteres",
                                  },
                                })}
                              />
                            </div>
                            {errors.name && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors.name.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-sm font-medium text-zinc-700 mb-2 block">
                              Email
                            </label>
                            <div
                              className={`flex bg-white transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border ${
                                errors.email
                                  ? "border-red-400 focus-within:ring-red-100 focus-within:border-red-400"
                                  : "focus-within:ring-blue-100 focus-within:border-blue-400 border-gray-200"
                              }`}
                            >
                              <RiMailLine className="size-5 text-zinc-400 shrink-0" />
                              <input
                                className="w-full outline-none ps-2 text-[15px]"
                                type="email"
                                placeholder="user@example.com"
                                {...register("email", {
                                  required: "O email é obrigatório",
                                  pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Insere um email válido",
                                  },
                                })}
                              />
                            </div>
                            {errors.email && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => goToStep(step - 1)}
                          className={`text-base transition-all bg-white hover:bg-gray-50 text-zinc-700 border border-gray-200 rounded-lg px-4 py-2 font-normal ${
                            step === 0 ? "invisible" : ""
                          }`}
                        >
                          ← Anterior
                        </button>

                        {step < STEPS.length - 1 ? (
                          <button
                            type="button"
                            onClick={handleNext}
                            className="text-base transition-all hover:opacity-75 text-white bg-design-2 rounded-lg px-6 py-2 font-normal"
                          >
                            Próximo →
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSubscribe}
                            disabled={mutation.isPending}
                            className="text-base transition-all hover:opacity-75 disabled:opacity-50 text-white bg-design-2 rounded-lg px-6 py-2 font-normal flex items-center gap-2"
                          >
                            <RiMailSendFill className="size-4" />
                            {mutation.isPending
                              ? "A subscrever..."
                              : "Subscrever →"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
