"use client";

import { RiGithubFill, RiMailSendFill, RiUser6Fill } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

const defaultLinks = [
  { name: "Eventos", href: "/events" },
  { name: "Contacto", href: "/contact" },
  { name: "Contribuir", href: "/contribute" },
  { name: "Newsletter", href: "/newsletter" },
];

interface NavProps {
  links?: { name: string; href: string }[];
}

export function Nav({ links = defaultLinks }: NavProps) {
  const pathname = usePathname();
  const { isLoggedIn, user, isLoading } = useUser();

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
            <button className="text-base border-gray-200 border rounded-lg px-3 py-1.5 font-normal text-zinc-900 hover:text-gray-900 flex items-center gap-2 ">
              1.2K
              <RiGithubFill className="size-5 text-gray-800" />
            </button>
            {isLoggedIn && user ? (
              <Link href={"/profile"}>
                <div className="px-3 py-1.5 gap-2 border hover:bg-zinc-100 transition-all border-gray-200 rounded-lg text-white flex items-center justify-center text-sm font-medium">
                  <div>
                    <div className=" flex items-center justify-center overflow-hidden">
                      <Image
                        src={"/img/avatar.png"}
                        alt={"Logo"}
                        width={100}
                        className="w-6 h-6 "
                        height={100}
                      />
                    </div>
                  </div>
                  <div className="text-zinc-900">
                    <p>{user.username}</p>
                  </div>
                </div>
              </Link>
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
