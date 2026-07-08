"use client";

import {
  RiCloseLine,
  RiGithubFill,
  RiMoonLine,
  RiSettings3Line,
  RiSunLine,
  RiUser6Fill,
  RiLogoutCircleRLine,
  RiUser6Line,
  RiGovernmentLine,
  RiMenu4Fill,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn, removeCookie } from "@/lib/utils";
import { useUser, notifyAuthChange } from "@/hooks/use-user";
import { useTheme } from "@/hooks/use-theme";
import { NotificationsBell } from "@/components/NotificationsBell";

const GITHUB_REPO_URL = "https://github.com/mariosalembe23/annita";

const defaultLinks = [
  { name: "Eventos", href: "/events" },
  { name: "Contacto", href: "/contact" },
  { name: "Contribuir", href: GITHUB_REPO_URL },
  { name: "Newsletter", href: "/newsletter" },
];

function formatStars(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(count);
}

interface NavProps {
  links?: { name: string; href: string }[];
}

export function Nav({ links = defaultLinks }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, isLoading } = useUser();
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

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
    notifyAuthChange();
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["notifications"] });
    router.push("/");
  }

  return (
    <div className="w-full fixed bg-background z-50 right-0 top-0 left-0">
      <nav className="max-w-7xl bg-background border-b border-gray-100 dark:border-zinc-700/50 py-5 px-5 det:px-0 mx-auto flex items-center justify-between">
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
        <div className="flex items-center gap-4 pot:gap-10">
          <div className="hidden pot:flex items-center gap-8 det:gap-16">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
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
            <>
              {starsLoading ? (
                <div className="w-16 py-4.5 rounded-lg bg-gray-200 dark:bg-zinc-700 animate-pulse" />
              ) : (
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-base ${isLoggedIn ? "pot:flex hidden" : "flex"} border-gray-200 dark:border-zinc-700 border rounded-lg px-3 pot:py-1.5 py-2.5 font-normal text-zinc-900 dark:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all  items-center gap-2`}
                >
                  {githubStars != null && formatStars(githubStars)}
                  <RiGithubFill className="pot:size-5 size-6 text-gray-800 dark:text-zinc-200" />
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
                className={`${isLoggedIn ? "pot:flex hidden" : ""} pot:p-2 p-2.5 border-gray-200 flex  dark:border-zinc-700 border rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all  items-center justify-center`}
              >
                {theme === "light" ? (
                  <RiMoonLine className="size-6 pot:size-5" />
                ) : (
                  <RiSunLine className="size-6 pot:size-5" />
                )}
              </button>
            </>

            {isLoggedIn && <NotificationsBell />}
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2 pot:p-1.5 border gap-2 border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center justify-center"
                >
                  <Image
                    src={"/img/avatar.png"}
                    alt={"Avatar"}
                    width={100}
                    className="w-7 h-7 pot:w-6 pot:h-6 pot:ms-1 dark:invert"
                    height={100}
                  />
                  <p className="pot:inline-flex hidden">{user.username}</p>
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
                        <button
                          type="button"
                          onClick={() => {
                            toggleTheme();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                          {theme === "light" ? (
                            <>
                              <RiMoonLine className="size-4" />
                              Tema Escuro
                            </>
                          ) : (
                            <>
                              <RiSunLine className="size-4" />
                              Tema Claro
                            </>
                          )}
                        </button>
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

                        <hr className="my-1 border-gray-100 dark:border-zinc-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm dark:text-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
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
              <div className="w-24 py-4.5 pot:inline-flex hidden rounded-lg bg-gray-200 dark:bg-zinc-700 animate-pulse" />
            ) : (
              <Link href={"/signin"}>
                <button className="text-base pot:flex hidden transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal  items-center gap-2">
                  <RiUser6Fill className="size-4" />
                  Entrar
                </button>
              </Link>
            )}
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                "text-base p-2.5  border-gray-200 dark:border-zinc-700 border rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center",
                isLoggedIn ? "pot:hidden" : "pot:hidden -ms-1.5",
              )}
            >
              <RiMenu4Fill className="size-6" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/20 dark:bg-black/50 backdrop-blur-sm pot:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              key="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 right-0 z-50 h-dvh w-72 max-w-[85vw] bg-white dark:bg-zinc-900 border-l border-gray-100 dark:border-zinc-700/50 shadow-2xl dark:shadow-black/40 pot:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-zinc-800">
                <Link
                  href={"/"}
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Image
                    src={"/img-logo/simple-logo.svg"}
                    alt={"Logo"}
                    width={100}
                    className="w-5 mt-1"
                    height={100}
                  />
                  <p className="text-2xl dark:text-white text-design-3">
                    annita
                  </p>
                </Link>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  <RiCloseLine className="size-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-3 p-3">
                {links.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-[15px] font-normal px-3 py-2.5 rounded-lg transition-all",
                      pathname === item.href
                        ? "text-design-2 bg-design-2/10 dark:bg-design-2/20"
                        : "text-zinc-900 dark:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {!isLoggedIn && !isLoading && (
                <div className="mt-auto p-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
                  <Link
                    href={"/signin"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <button className="w-full text-[15px] transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-2 font-normal flex items-center justify-center gap-2 cursor-pointer">
                      Entrar
                    </button>
                  </Link>
                  <Link
                    href={"/signup"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full"
                  >
                    <button className="w-full text-[15px] transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 font-normal flex items-center justify-center gap-2 cursor-pointer bg-transparent">
                      Registar-se
                    </button>
                  </Link>
                </div>
              )}

              {isLoggedIn && user && (
                <div className="mt-auto p-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
                  <Link
                    href={"/profile"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Image
                      src={"/img/avatar.png"}
                      alt={"Avatar"}
                      width={32}
                      height={32}
                      className="w-6 h-6 dark:invert rounded-full object-cover"
                    />
                    <span className="text-zinc-900 dark:text-zinc-100 text-sm font-medium truncate">
                      {user.username}
                    </span>
                  </Link>
                  {starsLoading ? (
                    <div className="w-full py-4.5 rounded-lg bg-gray-200 dark:bg-zinc-700 animate-pulse" />
                  ) : (
                    <a
                      href={GITHUB_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-[15px] border-gray-200 dark:border-zinc-700 border rounded-lg px-3 py-2 font-normal text-zinc-900 dark:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
                    >
                      {githubStars != null && formatStars(githubStars)}
                      <RiGithubFill className="size-5 text-gray-800 dark:text-zinc-200" />
                    </a>
                  )}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
