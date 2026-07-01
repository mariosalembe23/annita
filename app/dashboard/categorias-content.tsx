"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { getCategories, createCategory } from "@/lib/api/events";
import type { ApiEventCategory } from "@/lib/api/events";
import { format } from "date-fns";
import {
  RiAppsLine,
  RiMore2Fill,
  RiMarkPenLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiCloseLine,
} from "@remixicon/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CategoriaRow({ category }: { category: ApiEventCategory }) {
  return (
    <tr className="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50 transition-colors">
      <td className="py-3 px-4 text-sm text-zinc-900">{category.id}</td>
      <td className="py-3 px-4 text-sm text-zinc-900 font-medium">
        {category.name}
      </td>
      <td className="py-3 px-4 text-sm text-zinc-600">{category.groupName}</td>
      <td className="py-3 px-4 text-sm text-zinc-600">
        {format(new Date(category.createdAt), "dd/MM/yyyy")}
      </td>
      <td className="py-3 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="size-8 rounded border border-zinc-300 flex items-center justify-center cursor-pointer">
              <RiMore2Fill className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 py-3">
            <DropdownMenuItem className="cursor-pointer py-1 px-3 gap-2">
              <RiMarkPenLine className="size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer py-1 px-3 gap-2"
              variant="destructive"
            >
              <RiDeleteBinLine className="size-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export default function CategoriasContent() {
  const { token } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");

  const { data: categories, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(token!),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createCategory(
        { name: name.trim(), groupName: groupName.trim() },
        token!,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      setName("");
      setGroupName("");
    },
  });

  return (
    <div className="mt-10">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-medium text-zinc-800">Categorias</h2>
        <button
          onClick={() => setOpen(true)}
          className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2 cursor-pointer"
        >
          <RiAppsLine className="size-4" />
          Adicionar Categoria
        </button>
      </header>

      <div className="mt-6 bg-white border border-zinc-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Grupo
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Data
              </th>
              <th className="py-3 px-4 w-16" />
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-200 last:border-b-0"
                >
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 rounded animate-pulse w-24" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 rounded animate-pulse w-32" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 rounded animate-pulse w-20" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 rounded animate-pulse w-24" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="size-8 bg-zinc-200 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : categories?.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm text-zinc-500"
                >
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            ) : (
              categories?.map((category) => (
                <CategoriaRow key={category.id} category={category} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Categoria</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar uma nova categoria.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm px-2 font-medium text-zinc-700">
                Nome
              </label>
              <Input
                placeholder="Ex: Tecnologia"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-sm px-2 font-medium text-zinc-700">
                Grupo
              </label>
              <Input
                placeholder="Ex: Tech"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="border-zinc-200">
            <DialogClose asChild>
              <Button variant="outline" size="default">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              size="default"
              className="bg-design-2 hover:bg-design-2/90"
              disabled={
                !name.trim() || !groupName.trim() || createMutation.isPending
              }
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending ? "A salvar..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
