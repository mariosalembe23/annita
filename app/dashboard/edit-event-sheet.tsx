"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { updateEvent, getCategories } from "@/lib/api/events";
import type { ApiEvent, EventModality, EventType } from "@/lib/api/events";
import { uploadImage } from "@/lib/upload-image";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetClose,
} from "@/components/ui/bottom-sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RiImageAddLine, RiCloseLine } from "@remixicon/react";
import { X } from "lucide-react";

interface EditEventSheetProps {
  event: ApiEvent | null;
  onClose: () => void;
}

const MODALITIES: { value: EventModality; label: string }[] = [
  { value: "PRESENTIAL", label: "Presencial" },
  { value: "REMOTE", label: "Remoto" },
  { value: "HYBRID", label: "Híbrido" },
];

const TYPES: { value: EventType; label: string }[] = [
  { value: "PAID", label: "Pago" },
  { value: "FREE", label: "Gratuito" },
];

export default function EditEventSheet({
  event,
  onClose,
}: EditEventSheetProps) {
  const { token } = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token!, 1, 1000),
    enabled: !!token,
  });

  const categories = categoriesResponse?.data ?? [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [modality, setModality] = useState<EventModality>("PRESENTIAL");
  const [startDate, setStartDate] = useState("");
  const [type, setType] = useState<EventType>("FREE");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setLink(event.link);
      setCategoryId(event.category.id);
      setModality(
        Array.isArray(event.modality)
          ? event.modality[0]
          : (event.modality as EventModality),
      );
      setStartDate(
        event.startDate
          ? new Date(event.startDate).toISOString().slice(0, 16)
          : "",
      );
      setType(event.type);
      setCoverImageUrl(event.coverImage);
      setCoverImageFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [event]);

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      title: string;
      description: string;
      link: string;
      categoryId: string;
      modality: EventModality;
      startDate: string;
      type: EventType;
      coverImageFile: File | null;
      existingCoverImage: string;
    }) => {
      const finalCoverImage = payload.coverImageFile
        ? await uploadImage(payload.coverImageFile)
        : payload.existingCoverImage;

      return updateEvent(
        payload.id,
        {
          title: payload.title,
          description: payload.description,
          link: payload.link,
          categoryId: payload.categoryId,
          modality: payload.modality,
          startDate: new Date(payload.startDate).toISOString(),
          type: payload.type,
          coverImage: finalCoverImage,
        },
        token ?? "",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events-admin"] });
      toast("success", "Evento actualizado com sucesso.");
      onClose();
    },
    onError: () => {
      toast("error", "Erro ao actualizar o evento. Tente novamente.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCoverImageUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    updateMutation.mutate({
      id: event.id,
      title,
      description,
      link,
      categoryId,
      modality,
      startDate,
      type,
      coverImageFile,
      existingCoverImage: coverImageUrl,
    });
  };

  const isPending = updateMutation.isPending;

  return (
    <BottomSheet
      open={!!event}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <BottomSheetContent
        showCloseButton={false}
        className="h-[95vh] overflow-y-auto rounded-t-none!"
      >
        <div className="flex items-center mt-5 w-full  justify-end">
          <button
            className="text-zinc-600 bg-zinc-100 rounded-full p-1"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>
        <BottomSheetHeader className="pt-10">
          <BottomSheetTitle>Editar Evento</BottomSheetTitle>
          <BottomSheetDescription>
            Altere os dados do evento e clique em salvar.
          </BottomSheetDescription>
        </BottomSheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-zinc-700">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do evento"
              required
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-zinc-700">
              Descrição
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do evento"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-zinc-700">Link</label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              type="url"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">
                Categoria
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">Tipo</label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as EventType)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">
                Modalidade
              </label>
              <Select
                value={modality}
                onValueChange={(v) => setModality(v as EventModality)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {MODALITIES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium text-zinc-700">
                Data de Início
              </label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3 flex flex-col">
            <label className="text-sm font-medium text-zinc-700">
              Imagem de Capa
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {coverImageFile || coverImageUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl ?? coverImageUrl}
                  alt="Preview da capa"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="size-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <RiImageAddLine className="size-5 text-zinc-700" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="size-9 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <RiCloseLine className="size-5 text-zinc-700" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-video w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 transition-colors hover:border-design-2/40 hover:text-design-2 hover:bg-design-2/5"
              >
                <RiImageAddLine className="size-6" />
                <span className="text-sm">Adicionar imagem</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <BottomSheetClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </BottomSheetClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-design-2 hover:bg-design-2/90"
            >
              {isPending ? "A salvar..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </BottomSheetContent>
    </BottomSheet>
  );
}
