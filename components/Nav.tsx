"use client";

import {
  RiGithubFill,
  RiSettings3Line,
  RiUser6Fill,
  RiUserLine,
  RiLogoutCircleRLine,
  RiUser6Line,
  RiGovernmentLine,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn, removeCookie } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

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

export function Nav({ links = defaultLinks }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, isLoading } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full fixed bg-white z-50 right-0 top-0 left-0">
      <nav className="max-w-7xl bg-white border-b border-gray-100 py-5 mx-auto flex items-center justify-between">
        <div>
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src={"img-logo/simple-logo.svg"}
              alt={"Logo"}
              width={100}
              className="w-5 mt-1"
              height={100}
            />
            <p className="text-3xl text-design-3">annita</p>
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
                    : "text-zinc-900 hover:text-design-2",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {starsLoading ? (
              <div className="w-16 py-4.5 rounded-lg bg-gray-200 animate-pulse" />
            ) : (
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base border-gray-200 border rounded-lg px-3 py-1.5 font-normal text-zinc-900 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                {githubStars != null && formatStars(githubStars)}
                <RiGithubFill className="size-5 text-gray-800" />
              </a>
            )}
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3 py-1.5 gap-2 border hover:bg-zinc-100 transition-all border-gray-200 rounded-lg flex items-center"
                >
                  <Image
                    src={"/img/avatar.png"}
                    alt={"Avatar"}
                    width={100}
                    className="w-6 h-6"
                    height={100}
                  />
                  <span className="text-zinc-900 text-sm">{user.username}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute border border-zinc-200 right-0 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="py-1">
                        <Link
                          href={"/profile"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                        >
                          <RiUser6Line className="size-4" />
                          Perfil
                        </Link>
                        {(user.role === "ADMIN" ||
                          user.role === "MODERATOR") && (
                          <Link
                            href={"/dashboard"}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                          >
                            <RiGovernmentLine className="size-4" />
                            Gestão Geral
                          </Link>
                        )}
                        <Link
                          href={"/settings"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-gray-50 transition-colors"
                        >
                          <RiSettings3Line className="size-4" />
                          Configurações
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
              <div className="w-24 py-4.5 rounded-lg bg-gray-200 animate-pulse" />
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
