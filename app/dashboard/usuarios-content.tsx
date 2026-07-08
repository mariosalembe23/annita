"use client";

import {
  RiGroup3Line,
  RiCheckboxCircleLine,
  RiForbid2Line,
  RiMailCloseLine,
  RiSearchLine,
} from "@remixicon/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { getUsers } from "@/lib/api/users";
import type { UserData } from "@/lib/api/users";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  MODERATOR: "Moderador",
  CONTRIBUTOR: "Contribuidor",
  COMPANY: "Empresa",
};

export default function UsuariosContent() {
  const { token } = useUser();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["users", search, role, isActive, page, token],
    queryFn: () =>
      getUsers(token ?? "", {
        search: search || undefined,
        role: role === "all" ? undefined : role,
        isActive: isActive === "all" ? undefined : isActive === "true",
        page,
        perPage: 12,
      }),
    enabled: !!token,
  });

  const users: UserData[] = Array.isArray(data) ? data : (data?.data ?? []);
  const meta = data && "meta" in data ? data.meta : undefined;

  const total = users.length;
  const verified = users.filter((u) => u.emailVerified).length;
  const inactive = users.filter((u) => !u.active).length;
  const unverified = users.filter((u) => !u.emailVerified).length;

  const userMetrics = [
    {
      label: "Total de Usuários",
      icon: RiGroup3Line,
      value: total,
    },
    {
      label: "Usuários Verificados",
      icon: RiCheckboxCircleLine,
      value: verified,
    },
    {
      label: "Usuários Inativos",
      icon: RiForbid2Line,
      value: inactive,
    },
    {
      label: "Usuários não Verificados",
      icon: RiMailCloseLine,
      value: unverified,
    },
  ];

  return (
    <>
      <div className="mt-10 grid grid-cols-1 small:grid-cols-2 pot:grid-cols-4 gap-6">
        {userMetrics.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 relative border overflow-hidden border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl"
          >
            <header className="flex items-center justify-between">
              <span className="text-zinc-800 dark:text-zinc-200 font-medium text-md z-10">
                {item.label}
              </span>
              <item.icon className="absolute size-32 text-zinc-300 dark:text-zinc-700/20 -bottom-10 -right-6 pointer-events-none" />
            </header>
            <footer className="pt-6 z-10 relative">
              <p className="text-4xl text-zinc-900 dark:text-zinc-100">
                {item.value}
              </p>
            </footer>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <header className="flex items-center justify-between">
          <h3 className="text-3xl text-zinc-900 dark:text-zinc-100">
            Usuários
          </h3>
        </header>

        <div className="mt-6 flex flex-col small:flex-row gap-4 items-stretch small:items-center">
          <div className="relative flex-1 max-w-md">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
            <Input
              type="text"
              placeholder="Pesquisar por nome ou e-mail..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <Select
            value={role}
            onValueChange={(val) => {
              setRole(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full small:w-45 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Funções</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="MODERATOR">Moderador</SelectItem>
              <SelectItem value="CONTRIBUTOR">Contribuidor</SelectItem>
              <SelectItem value="COMPANY">Empresa</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={isActive}
            onValueChange={(val) => {
              setIsActive(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full small:w-45 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
                <th className="text-left px-5 py-3.5 font-medium text-zinc-600 dark:text-zinc-400">
                  Utilizador
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-zinc-600 dark:text-zinc-400">
                  Email
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-zinc-600 dark:text-zinc-400">
                  Função
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-zinc-600 dark:text-zinc-400">
                  Estado
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-zinc-600 dark:text-zinc-400">
                  Verificado
                </th>
                <th className="text-left px-5 py-3.5 font-medium text-zinc-600 dark:text-zinc-400">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    Nenhum utilizador encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-design-2/10 dark:bg-design-1/10 text-design-2 dark:text-design-1">
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.active ? (
                        <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {user.emailVerified ? (
                        <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                          Verificado
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">
                          Não verificado
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 dark:text-zinc-400 text-xs">
                      {format(new Date(user.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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
      </section>
    </>
  );
}
