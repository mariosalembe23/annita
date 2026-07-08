"use client";

import {
  RiMoonLine,
  RiSunLine,
  RiUser6Line,
  RiHomeLine,
  RiLogoutCircleRLine,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "./sidebar";
import DashboardContent from "./dashboard-content";
import EventosContent from "./eventos-content";
import UsuariosContent from "./usuarios-content";
import CategoriasContent from "./categorias-content";
import NewsletterContent from "./newsletter-content";
import { useUser, notifyAuthChange } from "@/hooks/use-user";
import { useDashboardStore } from "@/lib/store/dashboard-store";
import { useTheme } from "@/hooks/use-theme";
import { NotificationsBell } from "@/components/NotificationsBell";
import { removeCookie } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DashboardClientProps {
  initialTab: string;
}

export default function DashboardClient({ initialTab }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useUser();
  const fetchMetrics = useDashboardStore((state) => state.fetchMetrics);
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const tabLabels: Record<string, string> = {
    dashboard: "Painel Geral",
    eventos: "Gestão de Eventos",
    usuarios: "Utilizadores",
    categorias: "Categorias",
    newsletter: "Newsletter",
  };

  useEffect(() => {
    if (token) {
      fetchMetrics(token);
    }
  }, [token, fetchMetrics]);

  function handleLogout() {
    removeCookie("token");
    notifyAuthChange();
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["notifications"] });
    router.push("/");
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  }

  return (
    <div className="w-full h-dvh bg-[#f5f5f5] dark:bg-[#242424] grid grid-cols-[4%_96%]">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="h-dvh overflow-y-auto">
        <section id="dashboard" className="p-10">
          <header className="flex items-center justify-between">
            <div className="w-full">
              <h1 className="text-lg font-medium text-zinc-600 dark:text-zinc-500">
                {tabLabels[activeTab] || activeTab}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                title={
                  theme === "light"
                    ? "Mudar para tema escuro"
                    : "Mudar para tema claro"
                }
                onClick={toggleTheme}
                className="p-2 border-gray-200 dark:border-zinc-700 border rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center cursor-pointer bg-white dark:bg-zinc-900"
              >
                {theme === "light" ? (
                  <RiMoonLine className="size-5" />
                ) : (
                  <RiSunLine className="size-5" />
                )}
              </button>

              <NotificationsBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-5 py-2 gap-2 border bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border-gray-200 dark:border-zinc-700 rounded-lg flex items-center cursor-pointer">
                    <Image
                      src={"/img/avatar.png"}
                      alt={"Avatar"}
                      width={100}
                      className="size-5 dark:invert"
                      height={100}
                    />
                    <span className="text-zinc-900 dark:text-zinc-100 inline-flex pe-2 text-sm">
                      {user?.username || "Admin"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuItem asChild className="py-2.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <RiUser6Line className="size-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="py-2.5">
                    <Link
                      href="/"
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <RiHomeLine className="size-4" />
                      <span>Página Inicial</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center py-2.5 gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer w-full"
                  >
                    <RiLogoutCircleRLine className="size-4" />
                    <span>Terminar Sessão</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {activeTab === "dashboard" && (
            <DashboardContent onNavigate={handleTabChange} />
          )}
          {activeTab === "eventos" && <EventosContent />}
          {activeTab === "usuarios" && <UsuariosContent />}
          {activeTab === "categorias" && <CategoriasContent />}
          {activeTab === "newsletter" && <NewsletterContent />}
        </section>
      </main>
    </div>
  );
}
