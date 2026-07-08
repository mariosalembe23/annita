"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import {
  getNewsletterSubscribers,
  unsubscribeNewsletter,
} from "@/lib/api/newsletter";
import {
  RiMailSendLine,
  RiDeleteBinLine,
  RiLoader2Line,
  RiSearchLine,
} from "@remixicon/react";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function NewsletterContent() {
  const { token } = useUser();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isPending, error } = useQuery({
    queryKey: ["newsletter-subscribers", page, search, token],
    queryFn: () =>
      getNewsletterSubscribers(token!, page, 10, search || undefined),
    enabled: !!token,
  });

  const unsubscribeMutation = useMutation({
    mutationFn: (id: string) => unsubscribeNewsletter(id, token!),
    onSuccess: () => {
      toast("success", "Utilizador removido da newsletter com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
    onError: (err: unknown) => {
      let message = "Erro ao remover utilizador da newsletter.";
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast("error", message);
    },
  });

  const subscribers = data?.data ?? [];
  const meta = data?.meta;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-medium text-zinc-900 dark:text-white">
            Newsletter
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Lista de utilizadores registados para receber notificações de
            eventos por e-mail.
          </p>
        </div>
        <div className="relative w-full md:max-w-xs shrink-0">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
          <Input
            type="text"
            placeholder="Pesquisar inscrito..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-3">
          <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-full bg-zinc-100 dark:bg-zinc-800/40 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl">
          Erro ao carregar os inscritos:{" "}
          {error instanceof Error ? error.message : "Erro desconhecido"}
        </div>
      ) : subscribers.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4 text-zinc-300 dark:text-zinc-700 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <RiMailSendLine className="size-16" />
          <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium">
            Nenhum inscrito na newsletter encontrado.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                  <th className="p-4 font-semibold text-sm text-zinc-700 dark:text-zinc-200">
                    Nome
                  </th>
                  <th className="p-4 font-semibold text-sm text-zinc-700 dark:text-zinc-200">
                    E-mail
                  </th>
                  <th className="p-4 font-semibold text-sm text-zinc-700 dark:text-zinc-200">
                    Data de Inscrição
                  </th>
                  <th className="p-4 font-semibold text-sm text-zinc-700 dark:text-zinc-200">
                    Categorias de Interesse
                  </th>
                  <th className="p-4 font-semibold text-sm text-zinc-700 dark:text-zinc-200 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[15px] text-zinc-800 dark:text-zinc-300">
                {subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-zinc-900 dark:text-white">
                      {sub.name}
                    </td>
                    <td className="p-4 font-mono text-sm">{sub.email}</td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400">
                      {formatDate(sub.createdAt)}
                    </td>
                    <td className="p-4">
                      {sub.preferredCategories &&
                      sub.preferredCategories.length > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                            >
                              {sub.preferredCategories.length}{" "}
                              {sub.preferredCategories.length === 1
                                ? "categoria"
                                : "categorias"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            className="w-64 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl z-50"
                          >
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 text-xs uppercase tracking-wider">
                              Categorias de Interesse
                            </h4>
                            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                              {sub.preferredCategories.map((cat) => (
                                <span
                                  key={cat.id}
                                  className="px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                                >
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 text-sm">
                          Nenhuma
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        disabled={unsubscribeMutation.isPending}
                        onClick={() => {
                          if (
                            confirm(
                              "Tens a certeza que desejas remover este utilizador da newsletter?",
                            )
                          ) {
                            unsubscribeMutation.mutate(sub.id);
                          }
                        }}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all cursor-pointer disabled:opacity-40"
                        title="Remover da Newsletter"
                      >
                        {unsubscribeMutation.isPending &&
                        unsubscribeMutation.variables === sub.id ? (
                          <RiLoader2Line className="size-5 animate-spin" />
                        ) : (
                          <RiDeleteBinLine className="size-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/60">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900"
              >
                Anterior
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 mx-2">
                Página {page} de {meta.totalPages}
              </span>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900"
              >
                Seguinte
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
