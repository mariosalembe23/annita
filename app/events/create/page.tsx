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

export default function CreateEventPage() {
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
    // submit logic
  }

  return (
    <div className="overflow-x-hidden">
      <main className=" h-screen grid grid-cols-2">
        <header className="bg-design-2/10 h-full flex items-center justify-center">
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
        </header>
        <section className="h-full overflow-y-auto py-20 relative w-full">
          <button
            onClick={() => window.history.back()}
            className="absolute size-9 rounded-full bg-gray-100 flex items-center justify-center top-6 right-6 text-zinc-600 hover:text-zinc-700 transition-opacity"
          >
            <X className="size-5" />
          </button>
          <div className="max-w-lg  mx-auto px-4">
            <header className="mb-8">
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
              <h1 className="text-3xl mt-4 font-medium">Criar evento</h1>
              <p className="text-zinc-500 text-[15px] mt-1">
                Publica o teu evento e reacha a comunidade tech em Angola.
              </p>
            </header>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                setShowPublishModal(true);
              }}
            >
              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">
                  Título do evento
                </label>
                <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
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
                <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-start px-3 py-2.5 rounded-lg border border-gray-200">
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

              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">
                  URL do evento
                </label>
                <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
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
                    className="flex w-full transition-all focus:ring-4 focus:ring-blue-100 focus:border-blue-400 items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-[15px] text-left"
                  >
                    <span
                      className={category ? "text-zinc-900" : "text-zinc-400"}
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

              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">
                  Imagens{" "}
                  <span className="text-zinc-400 font-normal">
                    (máx. 2, opcional)
                  </span>
                </label>
                <div className="flex flex-col gap-3">
                  <label className="flex cursor-pointer transition-all hover:border-design-2/40 items-center justify-center gap-2 px-3 py-6 rounded-lg border border-dashed border-gray-200 text-[15px] text-zinc-400 hover:text-design-2 hover:bg-design-2/5">
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
                <div className="flex items-center  gap-3">
                  {modalities.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setModality(m.value)}
                      className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-[15px] transition-all ${
                        modality === m.value
                          ? "border-design-2 text-white bg-design-2 font-medium"
                          : "border-gray-200 text-zinc-600 hover:border-gray-300"
                      }`}
                    >
                      <m.icon className="size-4" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 mb-2 block">
                  Data do evento
                </label>
                <div className="flex transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400 items-center px-3 py-2.5 rounded-lg border border-gray-200">
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
                          : "border-gray-200 text-zinc-600 hover:border-gray-300"
                      }`}
                    >
                      <t.icon className="size-4" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="w-full text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-3 font-normal"
                >
                  Publicar evento
                </button>
              </div>
            </form>
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
