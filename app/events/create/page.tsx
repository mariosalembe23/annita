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
  RiTeamLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PublishConfirmationModal } from "@/components/PublishConfirmationModal";
import { X } from "lucide-react";

const categoryGroups = [
  {
    label: "Formação",
    items: [
      "Palestra / Talk",
      "Workshop",
      "Webinar",
      "Bootcamp",
      "Curso intensivo",
    ],
  },
  {
    label: "Competição & Inovação",
    items: [
      "Hackathon",
      "Maratona de dados (Datathon)",
      "Competição de startups",
      "Pitch de ideias",
    ],
  },
  {
    label: "Networking & Comunidade",
    items: [
      "Meetup",
      "Conferência",
      "Summit",
      "Tech Fest",
      "Comunidade open source",
    ],
  },
  {
    label: "Negócios & Empreendedorismo",
    items: [
      "Demo Day",
      "Lançamento de produto",
      "Feira de tecnologia",
      "Expo tech",
    ],
  },
  {
    label: "Especializadas",
    items: [
      "CTF",
      "Game Jam",
      "AI & Machine Learning",
      "Blockchain & Web3",
      "Robótica & Hardware",
    ],
  },
];

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

const STEP_INFO = [
  {
    title: "Informação básica",
    desc: "Conta-nos o nome e os detalhes do teu evento",
  },
  { title: "Categorização", desc: "Define a categoria e o link do evento" },
  { title: "Apresentação", desc: "Adiciona imagens e escolhe a modalidade" },
  { title: "Finalização", desc: "Define a data e o tipo de ingresso" },
];

export default function CreateEventPage() {
  useEffect(() => {
    document.title = "Criar Evento — Annita";
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [modality, setModality] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [eventUrl, setEventUrl] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [[step, direction], setStep] = useState([0, 0]);
  const categoryRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  function resizeDescription() {
    const el = descriptionRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

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

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const remaining = 2 - images.length;
    setImages((prev) => [...prev, ...files.slice(0, remaining)]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePublish() {
    setShowPublishModal(false);
  }

  function goToStep(next: number) {
    if (next < 0 || next > STEPS.length - 1) return;
    setStep([next, next > step ? 1 : -1]);
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 240 : -240, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -240 : 240, opacity: 0 }),
  };

  return (
    <div className="overflow-x-hidden h-dvh bg-[#f5f5f5]">
      <main className="h-screen grid grid-cols-1">
        {/* <header className="bg-design-2/10 h-full flex items-center justify-center">
          <div>
            <Link href={"/"} className="flex items-center gap-2">
              <Image
                src={"/img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-52 mt-1"
                height={100}
              />
            </Link>
          </div>
        </header> */}
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

            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
              {/* <span className="text-xs font-semibold text-design-2 bg-design-2/10 px-2.5 py-1 rounded-full tabular-nums">
                {step + 1} / {STEPS.length}
              </span> */}
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-design-1 to-design-2 rounded-full"
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              {/* <span className="text-xs text-zinc-400 font-medium tabular-nums">
                {Math.round(((step + 1) / STEPS.length) * 100)}%
              </span> */}
            </div>

            {/* Step circles */}
            {/* <div className="flex items-center mb-7">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => goToStep(i)}
                    className={`relative flex items-center justify-center size-9 rounded-full border-2 text-sm font-medium transition-all duration-300 bg-white z-10 ${
                      step > i
                        ? "bg-design-2 border-design-2 text-white shadow-sm shadow-design-2/30"
                        : step === i
                          ? "border-design-2 text-design-2 shadow-sm"
                          : "border-gray-200 text-zinc-400 hover:border-gray-300"
                    }`}
                  >
                    {step > i ? (
                      <svg
                        className="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 rounded-full mx-1.5">
                      <div
                        className="h-full bg-design-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: step > i ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div> */}

            {/* Step labels */}
            {/* <div className="flex items-center mb-8">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex-1">
                  <span
                    className={`text-xs font-medium block ${
                      i === 0
                        ? "text-left"
                        : i === STEPS.length - 1
                          ? "text-right"
                          : "text-center"
                    } ${
                      step >= i ? "text-design-2" : "text-zinc-400"
                    } transition-colors`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div> */}

            {/* Animated step content */}
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
                {/* <div className="mb-5">
                  <p className="text-sm font-medium text-zinc-900">
                    {STEP_INFO[step].title}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {STEP_INFO[step].desc}
                  </p>
                </div> */}

                <form
                  className="flex flex-col gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (step < STEPS.length - 1) {
                      goToStep(step + 1);
                    } else {
                      setShowPublishModal(true);
                    }
                  }}
                >
                  {step === 0 && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Título do evento
                        </label>
                        <div className="flex bg-white transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
                          <input
                            className="w-full outline-none text-[15px]"
                            type="text"
                            placeholder="Ex.: Hackathon Angola 2026"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Descrição
                        </label>
                        <div className="flex bg-white transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-start px-3 py-2.5 rounded-lg border border-gray-200">
                          <textarea
                            ref={descriptionRef}
                            className="w-full outline-none text-[15px] resize-none overflow-y-auto"
                            rows={3}
                            placeholder="Descreve o teu evento..."
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              resizeDescription();
                            }}
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          URL do evento
                        </label>
                        <div className="flex transition-all bg-white focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
                          <RiGlobalLine className="size-5 text-zinc-400 shrink-0" />
                          <input
                            className="w-full outline-none ps-2 text-[15px]"
                            type="url"
                            placeholder="https://"
                            value={eventUrl}
                            onChange={(e) => setEventUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Categoria
                        </label>
                        <div className="relative" ref={categoryRef}>
                          <button
                            type="button"
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className="flex bg-white w-full transition-all focus:ring-4 focus:ring-blue-100 focus:border-blue-400 items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-[15px] text-left"
                          >
                            <span
                              className={
                                category ? "text-zinc-900" : "text-zinc-400"
                              }
                            >
                              {category || "Seleciona uma categoria"}
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
                                {categoryGroups.map((group) => (
                                  <div key={group.label}>
                                    <p className="px-3 pt-3 pb-1.5 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                      {group.label}
                                    </p>
                                    {group.items.map((item) => (
                                      <button
                                        key={item}
                                        type="button"
                                        onClick={() => {
                                          setCategory(item);
                                          setCategoryOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-[15px] transition-colors hover:bg-blue-50 ${
                                          category === item
                                            ? "text-design-2 font-medium"
                                            : "text-zinc-700"
                                        }`}
                                      >
                                        {item}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Imagens{" "}
                          <span className="text-zinc-400 font-normal">
                            (máx. 2, opcional)
                          </span>
                        </label>
                        <div className="flex flex-col gap-3">
                          <label className="flex bg-white cursor-pointer transition-all hover:border-design-2/40 items-center justify-center gap-2 px-3 py-6 rounded-lg border border-dashed border-gray-200 text-[15px] text-zinc-400 hover:text-design-2 hover:bg-design-2/5">
                            <RiImageAddLine className="size-5" />
                            <span>
                              {images.length === 0
                                ? "Clique para fazer upload"
                                : "Adicionar mais"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              disabled={images.length >= 2}
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                          {images.length > 0 && (
                            <div className="flex gap-2">
                              {images.map((file, i) => (
                                <div
                                  key={i}
                                  className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden group"
                                >
                                  <Image
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 size-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <RiCloseLine className="size-3 text-white" />
                                  </button>
                                </div>
                              ))}
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
                              onClick={() => setModality(m.value)}
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
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700 mb-2 block">
                          Data do evento
                        </label>
                        <div className="flex bg-white transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
                          <RiCalendarLine className="size-5 text-zinc-400 shrink-0" />
                          <input
                            className="w-full outline-none ps-2 text-[15px]"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ colorScheme: "light" }}
                          />
                        </div>
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
                              onClick={() => setType(t.value)}
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
                        type="submit"
                        className="text-base transition-all hover:opacity-75 text-white bg-design-2 rounded-lg px-6 py-2 font-normal"
                      >
                        Próximo →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="text-base transition-all hover:opacity-75 text-white bg-design-2 rounded-lg px-6 py-2 font-normal"
                      >
                        Publicar evento →
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <PublishConfirmationModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublish}
      />
    </div>
  );
}
