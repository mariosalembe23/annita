"use client";

import {
  RiArrowDownSLine,
  RiCalendarLine,
  RiCloseLine,
  RiDiamondLine,
  RiExchange2Fill,
  RiGlobalLine,
  RiGroup3Line,
  RiImageAddLine,
  RiMapPinLine,
  RiTeamLine,
} from "@remixicon/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { ChevronDownIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PublishConfirmationModal } from "@/components/PublishConfirmationModal";
import { createEvent, getCategories } from "@/lib/api/events";
import { uploadImage } from "@/lib/upload-image";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

interface CreateEventForm {
  title: string;
  description: string;
  location: string;
  link: string;
  categoryId: string;
  coverImage: File | null;
  modality: string;
  startDate: Date | null;
  type: string;
}

const MODALITY_MAP: Record<string, string> = {
  presencial: "PRESENTIAL",
  digital: "REMOTE",
  hibrido: "HYBRID",
};

const TYPE_MAP: Record<string, string> = {
  gratuito: "FREE",
  pago: "PAID",
};

const modalities = [
  { value: "presencial", label: "Presencial", icon: RiGroup3Line },
  { value: "digital", label: "Digital", icon: RiGlobalLine },
  { value: "hibrido", label: "Híbrido", icon: RiExchange2Fill },
];

const types = [
  { value: "gratuito", label: "Gratuito", icon: RiTeamLine },
  { value: "pago", label: "Pago", icon: RiDiamondLine },
];

const STEPS = [
  { num: 1, title: "Título" },
  { num: 2, title: "Categoria" },
  { num: 3, title: "Visual" },
  { num: 4, title: "Data" },
];

export default function CreateEventPage() {
  const { toast } = useToast();
  const { user, token, isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    document.title = "Criar Evento — Annita";
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push("/signin");
  }, [isLoading, isLoggedIn, router]);

  const STORAGE_KEY = "create-event-form";

  const [[step, direction], setStep] = useState([0, 0]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateEventForm>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      location: "",
      link: "",
      categoryId: "",
      coverImage: null,
      modality: "",
      startDate: null,
      type: "",
    },
  });

  useEffect(() => {
    if (restored.current) return;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed.step != null) setStep([parsed.step, 0]);
      if (parsed.form) {
        const f = parsed.form;
        if (f.title) setValue("title", f.title);
        if (f.description) setValue("description", f.description);
        if (f.location) setValue("location", f.location);
        if (f.link) setValue("link", f.link);
        if (f.categoryId) setValue("categoryId", f.categoryId);
        if (f.modality) setValue("modality", f.modality);
        if (f.type) setValue("type", f.type);
        if (f.startDate) setValue("startDate", new Date(f.startDate));
      }
    } catch {}
    restored.current = true;
  }, []);

  useEffect(() => {
    const sub = watch((values) => {
      try {
        const { coverImage, ...rest } = values;
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            step,
            form: {
              ...rest,
              startDate:
                rest.startDate instanceof Date
                  ? rest.startDate.toISOString()
                  : rest.startDate,
            },
          }),
        );
      } catch {}
    });
    return sub.unsubscribe;
  }, [watch, step]);

  const categoryId = watch("categoryId");
  const modality = watch("modality");
  const type = watch("type");
  const startDate = watch("startDate");
  const coverImage = watch("coverImage");

  useEffect(() => {
    register("startDate", { required: "A data do evento é obrigatória" });
    register("type", { required: "O tipo de ingresso é obrigatório" });
    register("modality", { required: "A modalidade é obrigatória" });
    register("categoryId", { required: "A categoria é obrigatória" });
  }, [register]);

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token!, 1, 1000),
    enabled: !!token,
  });

  const categories = categoriesResponse?.data ?? [];

  const createMutation = useMutation({
    mutationFn: async (formData: CreateEventForm) => {
      if (!token || !user) throw new Error("Não autenticado");

      let coverImageUrl = "";
      if (formData.coverImage) {
        coverImageUrl = await uploadImage(formData.coverImage);
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim() || undefined,
        link: formData.link.trim(),
        categoryId: formData.categoryId,
        modality: MODALITY_MAP[formData.modality] as
          | "PRESENTIAL"
          | "REMOTE"
          | "HYBRID",
        startDate: (formData.startDate as Date).toISOString(),
        type: TYPE_MAP[formData.type] as "PAID" | "FREE",
        coverImage: coverImageUrl,
      };

      return createEvent(payload, token);
    },
    onSuccess: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      toast("success", "Evento publicado com sucesso!");
      setShowPublishModal(false);
      router.push("/event-created");
    },
    onError: (error: Error) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ||
        error.message ||
        "Erro ao publicar evento";
      toast("error", message);
      setShowPublishModal(false);
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCategoryOpen(false);
  }, [step]);

  function resizeDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("coverImage", file, { shouldValidate: true });
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeImage() {
    setValue("coverImage", null, { shouldValidate: true });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  function handlePublish() {
    handleSubmit((data) => createMutation.mutate(data))();
  }

  function goToStep(next: number) {
    if (next < 0 || next > STEPS.length - 1) return;
    setStep([next, next > step ? 1 : -1]);
  }

  async function handleNext() {
    let fields: (keyof CreateEventForm)[] = [];
    if (step === 0) fields = ["title", "description", "location"];
    else if (step === 1) fields = ["link", "categoryId"];
    else if (step === 2) fields = ["modality"];
    else if (step === 3) fields = ["startDate", "type"];

    const valid = await trigger(fields);
    if (valid) goToStep(step + 1);
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
            <header className="mb-6">
              <div className="pot:hidden inline-flex">
                <Link href={"/"} className="flex items-center gap-2">
                  <Image
                    src={"/img-logo/simple-logo.svg"}
                    alt={"Logo"}
                    width={100}
                    className="w-7 mt-1"
                    height={100}
                  />
                </Link>
              </div>
              <Link href={"/"} className="flex mb-8 items-center gap-2">
                <Image
                  src={"/img-logo/simple-logo.svg"}
                  alt={"Logo"}
                  width={100}
                  className="w-8 mt-1"
                  height={100}
                />
              </Link>
              <h1 className="text-3xl mt-4 font-medium">Criar evento</h1>
              <p className="text-zinc-500 text-[15px] mt-1">
                Publica o teu evento e reacha a comunidade tech em Angola.
              </p>
            </header>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-design-1 to-design-2 rounded-full"
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
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
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Título do evento
                        </label>
                        <div
                          className={`flex bg-white transition-all focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border ${
                            errors.title
                              ? "border-red-400 focus-within:ring-red-100 focus-within:border-red-400"
                              : "focus-within:ring-blue-100 focus-within:border-blue-400 border-gray-200"
                          }`}
                        >
                          <input
                            className="w-full outline-none text-[15px]"
                            type="text"
                            placeholder="Ex.: Hackathon Angola 2026"
                            {...register("title", {
                              required: "O título é obrigatório",
                              minLength: {
                                value: 3,
                                message:
                                  "O título deve ter pelo menos 3 caracteres",
                              },
                            })}
                          />
                        </div>
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Descrição
                        </label>
                        <div
                          className={`flex bg-white transition-all focus-within:ring-4 items-start px-3 py-2.5 rounded-lg border ${
                            errors.description
                              ? "border-red-400 focus-within:ring-red-100 focus-within:border-red-400"
                              : "focus-within:ring-blue-100 focus-within:border-blue-400 border-gray-200"
                          }`}
                        >
                          <textarea
                            className="w-full outline-none text-[15px] resize-none overflow-y-auto"
                            rows={3}
                            placeholder="Descreve o teu evento..."
                            style={{ maxHeight: "200px" }}
                            {...register("description", {
                              required: "A descrição é obrigatória",
                              minLength: {
                                value: 10,
                                message:
                                  "A descrição deve ter pelo menos 10 caracteres",
                              },
                              onChange: (e) => {
                                resizeDescription(e);
                              },
                            })}
                          />
                        </div>
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Localização{" "}
                          <span className="text-zinc-400 font-normal">
                            (opcional)
                          </span>
                        </label>
                        <div
                          className={`flex bg-white transition-all focus-within:ring-4 items-start px-3 py-2.5 rounded-lg border ${
                            errors.location
                              ? "border-red-400 focus-within:ring-red-100 focus-within:border-red-400"
                              : "focus-within:ring-blue-100 focus-within:border-blue-400 border-gray-200"
                          }`}
                        >
                          <RiMapPinLine className="size-5 text-zinc-400 shrink-0" />
                          <textarea
                            className="w-full outline-none ps-2 text-[15px] resize-none overflow-y-auto"
                            rows={1}
                            placeholder="Ex.: Centro de Convenções de Talatona, Luanda"
                            style={{ maxHeight: "120px" }}
                            {...register("location", {
                              maxLength: {
                                value: 120,
                                message:
                                  "A localização deve ter no máximo 120 caracteres",
                              },
                              validate: (value) =>
                                !value ||
                                value.trim().length >= 3 ||
                                "A localização deve ter pelo menos 3 caracteres",
                              onChange: (e) => {
                                resizeDescription(e);
                              },
                            })}
                          />
                        </div>
                        {errors.location && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.location.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          URL do evento
                        </label>
                        <div
                          className={`flex transition-all bg-white focus-within:ring-4 items-center px-3 py-2.5 rounded-lg border ${
                            errors.link
                              ? "border-red-400 focus-within:ring-red-100 focus-within:border-red-400"
                              : "focus-within:ring-blue-100 focus-within:border-blue-400 border-gray-200"
                          }`}
                        >
                          <RiGlobalLine className="size-5 text-zinc-400 shrink-0" />
                          <input
                            className="w-full outline-none ps-2 text-[15px]"
                            type="url"
                            placeholder="https://"
                            {...register("link", {
                              required: "O URL é obrigatório",
                              pattern: {
                                value: /^https?:\/\/.+/,
                                message:
                                  "Insere um URL válido (http:// ou https://)",
                              },
                            })}
                          />
                        </div>
                        {errors.link && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.link.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Categoria
                        </label>
                        <div className="relative" ref={categoryRef}>
                          <button
                            type="button"
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className={`flex bg-white w-full transition-all focus:ring-4 items-center justify-between px-3 py-2.5 rounded-lg border text-[15px] text-left ${
                              errors.categoryId
                                ? "border-red-400 focus:ring-red-100"
                                : "focus:ring-blue-100 focus:border-blue-400 border-gray-200"
                            }`}
                          >
                            <span
                              className={
                                categoryId ? "text-zinc-900" : "text-zinc-400"
                              }
                            >
                              {categoryId
                                ? categories.find((c) => c.id === categoryId)
                                    ?.name || "Seleciona uma categoria"
                                : "Seleciona uma categoria"}
                            </span>
                            <motion.span
                              animate={{ rotate: categoryOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <RiArrowDownSLine className="size-5 text-zinc-400" />
                            </motion.span>
                          </button>
                          <AnimatePresence>
                            {categoryOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -4, scaleY: 0.97 }}
                                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                style={{ transformOrigin: "top" }}
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto"
                              >
                                {categories.map((cat) => (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                      setValue("categoryId", cat.id, {
                                        shouldValidate: true,
                                      });
                                      setCategoryOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-[15px] transition-colors hover:bg-blue-50 ${
                                      categoryId === cat.id
                                        ? "text-design-2 font-medium"
                                        : "text-zinc-700"
                                    }`}
                                  >
                                    {cat.name}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {errors.categoryId && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.categoryId.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Imagem de capa{" "}
                          <span className="text-zinc-400 font-normal">
                            (opcional)
                          </span>
                        </label>
                        <div className="flex flex-col gap-3">
                          {!coverImage ? (
                            <label className="flex bg-white cursor-pointer transition-all hover:border-design-2/40 items-center justify-center gap-2 px-3 py-6 rounded-lg border border-dashed border-gray-200 text-[15px] text-zinc-400 hover:text-design-2 hover:bg-design-2/5">
                              <RiImageAddLine className="size-5" />
                              <span>Clique para fazer upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden group">
                              <Image
                                src={previewUrl!}
                                alt="Capa do evento"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 size-7 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <RiCloseLine className="size-4 text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Modalidade
                        </label>
                        <div className="flex items-center gap-3">
                          {modalities.map((m) => (
                            <button
                              key={m.value}
                              type="button"
                              onClick={() =>
                                setValue("modality", m.value, {
                                  shouldValidate: true,
                                })
                              }
                              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-[15px] transition-all ${
                                modality === m.value
                                  ? "border-design-2 text-white bg-design-2 font-medium"
                                  : "border-gray-200 bg-white text-zinc-600 hover:border-gray-300"
                              }`}
                            >
                              <m.icon className="size-4" />
                              {m.label}
                            </button>
                          ))}
                        </div>
                        {errors.modality && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.modality.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Data do evento
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              data-empty={!startDate}
                              data-error={!!errors.startDate}
                              className={`w-full justify-between text-left font-normal border rounded-lg px-3 py-2.5 h-auto text-[15px] hover:bg-white ${
                                errors.startDate
                                  ? "border-red-400 data-[empty=true]:text-red-400"
                                  : "data-[empty=true]:text-zinc-400 border-gray-200"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <RiCalendarLine className="size-5 shrink-0 text-zinc-400" />
                                {startDate ? (
                                  format(startDate, "PPP")
                                ) : (
                                  <span>Seleciona a data do evento</span>
                                )}
                              </span>
                              <ChevronDownIcon className="size-4 text-zinc-400" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate ?? undefined}
                              onSelect={(date) =>
                                setValue("startDate", date ?? null, {
                                  shouldValidate: true,
                                })
                              }
                              defaultMonth={startDate ?? undefined}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.startDate && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.startDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Tipo
                        </label>
                        <div className="flex items-center gap-3">
                          {types.map((t) => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() =>
                                setValue("type", t.value, {
                                  shouldValidate: true,
                                })
                              }
                              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-[15px] transition-all ${
                                type === t.value
                                  ? "border-design-2 bg-design-2 text-white font-medium"
                                  : "border-gray-200 bg-white text-zinc-600 hover:border-gray-300"
                              }`}
                            >
                              <t.icon className="size-4" />
                              {t.label}
                            </button>
                          ))}
                        </div>
                        {errors.type && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.type.message}
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
                        onClick={() => setShowPublishModal(true)}
                        className="text-base transition-all hover:opacity-75 text-white bg-design-2 rounded-lg px-6 py-2 font-normal"
                      >
                        Publicar evento →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <PublishConfirmationModal
        open={showPublishModal}
        loading={createMutation.isPending}
        onClose={() => !createMutation.isPending && setShowPublishModal(false)}
        onConfirm={handlePublish}
      />
    </div>
  );
}
