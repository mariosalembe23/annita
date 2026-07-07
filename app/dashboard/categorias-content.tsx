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
    <tr className="border-b border-zinc-200 dark:border-zinc-700 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
      <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100 uppercase font-mono font-medium">
        {category.id.slice(0, 6)}
      </td>
      <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
        {category.name}
      </td>
      <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">{category.groupName}</td>
      <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
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
  const [useSameGroup, setUseSameGroup] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 10;
  const [entries, setEntries] = useState([
    { name: "", groupName: "" },
    { name: "", groupName: "" },
    { name: "", groupName: "" },
  ]);

  function updateEntry(
    index: number,
    field: "name" | "groupName",
    value: string,
  ) {
    setEntries((prev) => {
      const next = prev.map((e, i) =>
        i === index ? { ...e, [field]: value } : e,
      );
      if (useSameGroup && field === "groupName") {
        for (let i = 1; i < next.length; i++) {
          next[i].groupName = value;
        }
      }
      return next;
    });
  }

  const { data: response, isPending } = useQuery({
    queryKey: ["categories", search, page],
    queryFn: () => getCategories(token!, page, perPage, search || undefined),
    enabled: !!token,
  });

  const categories = response?.data ?? [];
  const meta = response?.meta;

  const createMutation = useMutation({
    mutationFn: async () => {
      const valid = entries.filter((e) => e.name.trim() && e.groupName.trim());
      for (const entry of valid) {
        await createCategory(
          { name: entry.name.trim(), groupName: entry.groupName.trim() },
          token!,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      setUseSameGroup(false);
      setEntries([
        { name: "", groupName: "" },
        { name: "", groupName: "" },
        { name: "", groupName: "" },
      ]);
    },
  });

  const hasAnyFilled = entries.some((e) => e.name.trim() && e.groupName.trim());

  return (
    <div className="mt-10">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-medium text-zinc-800 dark:text-zinc-200">Categorias</h2>
        <button
          onClick={() => setOpen(true)}
          className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2 cursor-pointer"
        >
          <RiAppsLine className="size-4" />
          Adicionar Categoria
        </button>
      </header>

      <div className="mt-6">
        <Input
          placeholder="Pesquisar"
          className="max-w-lg bg-white dark:bg-zinc-900 mb-4"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Nome
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Grupo
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
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
                  className="border-b border-zinc-200 dark:border-zinc-700 last:border-b-0"
                >
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-24" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-32" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-20" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-24" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="size-8 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : categories?.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
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

      {meta && (
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Página {meta.page + 1} de {meta.totalPages} ({meta.totalElements}{" "}
            categorias)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={meta.page <= 0}
              className="px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(meta.totalPages - 1, p + 1))
              }
              disabled={meta.page >= meta.totalPages - 1}
              className="px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Seguinte
            </button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Categorias</DialogTitle>
            <DialogDescription>
              Preencha até 3 categorias para criar de uma vez.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5 flex items-center gap-2">
            <input
              type="checkbox"
              id="useSameGroup"
              checked={useSameGroup}
              onChange={(e) => {
                setUseSameGroup(e.target.checked);
                if (e.target.checked) {
                  setEntries((prev) => {
                    const next = [...prev];
                    for (let i = 1; i < next.length; i++) {
                      next[i].groupName = next[0].groupName;
                    }
                    return next;
                  });
                }
              }}
              className="size-4 rounded border-zinc-300 text-design-2 focus:ring-design-2"
            />
            <label
              htmlFor="useSameGroup"
              className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none"
            >
              Usar mesmo grupo para todas
            </label>
          </div>

          <div className="space-y-4">
            {entries.map((entry, i) => (
              <div
                key={i}
                className="space-y-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700"
              >
                <div className="mb-3">
                  <span className="text-sm px-2 font-normal text-zinc-600 dark:text-zinc-400">
                    Categoria {i + 1}
                  </span>
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-sm px-2 font-medium text-zinc-700 dark:text-zinc-300">
                    Nome
                  </label>
                  <Input
                    placeholder="Ex: Tecnologia"
                    value={entry.name}
                    onChange={(e) => updateEntry(i, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-sm px-2 font-medium text-zinc-700 dark:text-zinc-300">
                    Grupo
                  </label>
                  <Input
                    placeholder="Ex: Tech"
                    value={entry.groupName}
                    onChange={(e) =>
                      updateEntry(i, "groupName", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="border-zinc-200 dark:border-zinc-700">
            <DialogClose asChild>
              <Button variant="outline" size="default">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              size="default"
              className="bg-design-2 hover:bg-design-2/90"
              disabled={!hasAnyFilled || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending
                ? "A salvar..."
                : `Salvar ${entries.filter((e) => e.name.trim() && e.groupName.trim()).length} categorias`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
