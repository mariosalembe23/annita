"use client";

import {
  RiAppsLine,
  RiArchiveStackLine,
  RiGroup3Line,
  RiHome6Line,
  RiMailSendLine,
  RiNotificationLine,
  RiSettings6Line,
} from "@remixicon/react";
import Image from "next/image";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { tab: "dashboard", icon: RiHome6Line, label: "Dashboard" },
  { tab: "eventos", icon: RiArchiveStackLine, label: "Eventos" },
  { tab: "usuarios", icon: RiGroup3Line, label: "Usuários" },
  { tab: "categorias", icon: RiAppsLine, label: "Categorias" },
  { tab: "newsletter", icon: RiMailSendLine, label: "Newsletter" },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <header className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex pot:flex-col items-center justify-between z-50
      pot:h-full pot:border-r pot:py-5 pot:px-0 pot:relative
      fixed bottom-0 left-0 right-0 h-16 border-t px-6 py-2 shadow-lg pot:shadow-none"
    >
      <div className="pot:block hidden">
        <Image
          src="/img-logo/simple-logo.svg"
          alt="Logo"
          width={100}
          className="w-7 mt-1"
          height={100}
        />
      </div>
      <nav className="flex flex-row w-full justify-around pot:w-auto pot:flex-col pot:h-full pot:justify-center pot:gap-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`relative group flex items-center justify-center transition-colors ${
                isActive
                  ? "text-design-2"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              <Icon className="size-6" />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg pot:block hidden">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      <footer className="pot:flex hidden flex-col gap-7">
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <RiNotificationLine />
        </button>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <RiSettings6Line />
        </button>
      </footer>
    </header>
  );
}
