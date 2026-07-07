"use client";

import {
  RiGroup3Line,
  RiCheckboxCircleLine,
  RiForbid2Line,
  RiMailCloseLine,
} from "@remixicon/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { getUsers } from "@/lib/api/users";
import type { UserData } from "@/lib/api/users";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  MODERATOR: "Moderador",
  CONTRIBUTOR: "Contribuidor",
};

export default function UsuariosContent() {
  const { token } = useUser();

  const { data, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token ?? ""),
    enabled: !!token,
  });

  const users: UserData[] = Array.isArray(data)
    ? data
    : data?.data ?? [];

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
      <div className="mt-10 grid grid-cols-4 gap-6">
        {userMetrics.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 relative border overflow-hidden border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl"
          >
            <header className="flex items-center justify-between">
              <span className="text-zinc-800 dark:text-zinc-200 font-medium text-md">
                {item.label}
              </span>
              <item.icon className="absolute size-32 text-zinc-300 dark:text-zinc-600! -bottom-10 -right-6" />
            </header>
            <footer className="pt-6">
              <p className="text-4xl">{item.value}</p>
            </footer>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <header className="flex items-center justify-between">
          <h3 className="text-3xl">Usuários</h3>
        </header>

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
              {isPending
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-design-2/10 flex items-center justify-center text-sm font-medium text-design-2">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                        {user.email}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-design-2/10 text-design-2">
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {user.active ? (
                          <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            <span className="size-1.5 rounded-full bg-green-500" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-300 bg-red-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            <span className="size-1.5 rounded-full bg-red-500" />
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {user.emailVerified ? (
                          <span className="text-green-600 text-xs font-medium">
                            Verificado
                          </span>
                        ) : (
                          <span className="text-zinc-400 text-xs font-medium">
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
                  ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
