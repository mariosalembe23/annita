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
    <header className="border-r py-5 flex bg-white dark:bg-zinc-900 flex-col items-center justify-between border-zinc-200 dark:border-zinc-700">
      <div>
        <Image
          src="/img-logo/simple-logo.svg"
          alt="Logo"
          width={100}
          className="w-7 mt-1"
          height={100}
        />
      </div>
      <nav className="h-full flex flex-col items-center justify-center gap-10">
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
              <Icon />
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      <footer className="flex flex-col gap-7">
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
