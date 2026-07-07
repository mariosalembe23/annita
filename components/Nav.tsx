"use client";

import {
  RiGithubFill,
  RiMoonLine,
  RiSettings3Line,
  RiSunLine,
  RiUser6Fill,
  RiLogoutCircleRLine,
  RiUser6Line,
  RiGovernmentLine,
  RiMegaphoneLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn, removeCookie } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { useTheme } from "@/hooks/use-theme";
import {
  getNotifications,
  markNotificationRead,
} from "@/lib/api/notifications";
import { timeAgoFromDate } from "@/data/events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const defaultLinks = [
  { name: "Eventos", href: "/events" },
  { name: "Contacto", href: "/contact" },
  { name: "Contribuir", href: "/contribute" },
  { name: "Newsletter", href: "/newsletter" },
];

const GITHUB_REPO_URL = "https://github.com/mariosalembe23/annita";

function formatStars(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(count);
}

interface NavProps {
  links?: { name: string; href: string }[];
}

type NotificationsTab = "all" | "unread" | "read";

const NOTIFICATION_TABS: { value: NotificationsTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
  { value: "read", label: "Lidas" },
];

export function Nav({ links = defaultLinks }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, isLoading, token } = useUser();
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const [notificationsTab, setNotificationsTab] =
    useState<NotificationsTab>("all");

  const { data: notificationsResponse } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(token!, 1, 50),
    enabled: !!token,
  });

  const notifications = notificationsResponse?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications = notifications.filter((n) =>
    notificationsTab === "all"
      ? true
      : notificationsTab === "unread"
        ? !n.read
        : n.read,
  );

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { data: githubStars, isPending: starsLoading } = useQuery({
    queryKey: ["github-stars"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.github.com/repos/mariosalembe23/annita",
      );
      if (!res.ok) throw new Error("Erro ao obter as estrelas do GitHub");
      const repo = await res.json();
      return repo.stargazers_count as number;
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setDropdownOpen(false);
    removeCookie("token");
    router.push("/");
  }

  return (
    <div className="w-full fixed bg-background z-50 right-0 top-0 left-0">
      <nav className="max-w-7xl bg-background border-b border-gray-100 dark:border-zinc-700/50 py-5 mx-auto flex items-center justify-between">
        <div>
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src={"/img-logo/simple-logo.svg"}
              alt={"Logo"}
              width={100}
              className="w-5 mt-1"
              height={100}
            />
            <p className="text-3xl dark:text-white text-design-3 ">annita</p>
          </Link>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-16">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-[15px] font-normal transition-all ",
                  pathname === item.href
                    ? "text-design-2"
                    : "text-zinc-900 dark:text-zinc-100 hover:text-design-2 dark:hover:text-design-1",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {starsLoading ? (
              <div className="w-16 py-4.5 rounded-lg bg-gray-200 dark:bg-zinc-700 animate-pulse" />
            ) : (
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base border-gray-200 dark:border-zinc-700 border rounded-lg px-3 py-1.5 font-normal text-zinc-900 dark:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center gap-2"
              >
                {githubStars != null && formatStars(githubStars)}
                <RiGithubFill className="size-5 text-gray-800 dark:text-zinc-200" />
              </a>
            )}
            <button
              type="button"
              title={
                theme === "light"
                  ? "Mudar para tema escuro"
                  : "Mudar para tema claro"
              }
              onClick={toggleTheme}
              className="p-2 border-gray-200 dark:border-zinc-700 border rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center"
            >
              {theme === "light" ? (
                <RiMoonLine className="size-5" />
              ) : (
                <RiSunLine className="size-5" />
              )}
            </button>
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    title="Notificações"
                    className="relative p-2 border-gray-200 dark:border-zinc-700 border rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center"
                  >
                    <RiMegaphoneLine className="size-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-red-600 text-white text-[11px] font-medium flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <div className="px-3 pt-2.5 pb-2 border-b border-gray-100 dark:border-zinc-700">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Notificações
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {NOTIFICATION_TABS.map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => setNotificationsTab(tab.value)}
                          className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                            notificationsTab === tab.value
                              ? "bg-design-2 text-white font-medium"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {tab.label}
                          {tab.value === "unread" && unreadCount > 0 && (
                            <span className="ms-1">({unreadCount})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-1">
                    {visibleNotifications.length === 0 ? (
                      <p className="text-sm text-zinc-500 text-center py-8">
                        {notificationsTab === "unread"
                          ? "Sem notificações por ler."
                          : notificationsTab === "read"
                            ? "Sem notificações lidas."
                            : "Sem notificações."}
                      </p>
                    ) : (
                      visibleNotifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          onSelect={(e) => {
                            e.preventDefault();
                            if (!notification.read) {
                              markReadMutation.mutate(notification.id);
                            }
                          }}
                          className="flex flex-col items-start gap-0.5 px-2.5 py-2 cursor-pointer"
                        >
                          <div className="flex w-full items-center justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                notification.read
                                  ? "text-zinc-600 dark:text-zinc-400"
                                  : "text-zinc-900 dark:text-zinc-100 font-medium"
                              }`}
                            >
                              {notification.eventTitle}
                            </p>
                            {!notification.read && (
                              <span className="size-2 rounded-full bg-design-2 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            {timeAgoFromDate(notification.createdAt)}
                          </p>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3 py-1.5 gap-2 border hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all border-gray-200 dark:border-zinc-700 rounded-lg flex items-center"
                >
                  <Image
                    src={"/img/avatar.png"}
                    alt={"Avatar"}
                    width={100}
                    className="w-6 h-6 dark:invert"
                    height={100}
                  />
                  <span className="text-zinc-900 dark:text-zinc-100 text-sm">
                    {user.username}
                  </span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute border border-zinc-200 dark:border-zinc-700 right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="py-1">
                        <Link
                          href={"/profile"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <RiUser6Line className="size-4" />
                          Perfil
                        </Link>
                        {(user.role === "ADMIN" ||
                          user.role === "MODERATOR") && (
                          <Link
                            href={"/dashboard"}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <RiGovernmentLine className="size-4" />
                            Gestão Geral
                          </Link>
                        )}
                        <Link
                          href={"/settings"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <RiSettings3Line className="size-4" />
                          Configurações
                        </Link>
                        <hr className="my-1 border-gray-100 dark:border-zinc-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <RiLogoutCircleRLine className="size-4" />
                          Terminar Sessão
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isLoading ? (
              <div className="w-24 py-4.5 rounded-lg bg-gray-200 dark:bg-zinc-700 animate-pulse" />
            ) : (
              <Link href={"/signin"}>
                <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2">
                  <RiUser6Fill className="size-4" />
                  Entrar
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
