"use client";

import {
  RiShareForwardLine,
  RiCalendarEventLine,
  RiFlagLine,
  RiSettings4Line,
  RiMoonLine,
  RiSunLine,
  RiHome6Line,
} from "@remixicon/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyEvents } from "@/lib/api/events";
import { removeCookie } from "@/lib/utils";
import { useUser, notifyAuthChange } from "@/hooks/use-user";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { NotificationsBell } from "@/components/NotificationsBell";
import { ProfileEvents } from "./ProfileEvents";
import { ProfileReports } from "./ProfileReports";
import { ProfileSettings } from "./ProfileSettings";
import { formatDate } from "@/data/events";

export default function ProfilePage() {
  const { user, token, isLoggedIn, isLoading } = useUser();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"events" | "reports" | "settings">(
    "events",
  );

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/signin");
    }
  }, [isLoading, isLoggedIn, router]);

  // Fetch current user events
  const { data: myEventsData, isPending: myEventsPending } = useQuery({
    queryKey: ["my-events", token],
    queryFn: () => getMyEvents(token ?? ""),
    enabled: !!token,
  });

  const myEvents = myEventsData?.data ?? [];

  const handleSignout = () => {
    removeCookie("token");
    notifyAuthChange();
    queryClient.removeQueries({ queryKey: ["user"] });
    queryClient.removeQueries({ queryKey: ["notifications"] });
    toast("success", "Sessão terminada.");
    router.push("/");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Perfil de ${user?.username}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("success", "Link do perfil copiado!");
    } catch {
      /* utilizador cancelou a partilha — sem ação */
    }
  };

  const handleSaveSettings = () => {
    toast("success", "Definições guardadas com sucesso!");
  };

  const handleDeleteAccount = () => {
    removeCookie("token");
    toast("success", "A sua conta foi eliminada com sucesso.");
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 dark:border-zinc-700 border-t-design-2 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-900 pb-16">
      <header className="pot:max-w-[90%] mx-auto px-5 pot:px-4">
        <div className="flex py-4 items-center justify-between">
          <div>
            <Link href={"/"} className="flex items-center gap-2 mb-1">
              <Image
                src={"img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-5 mt-1"
                height={100}
              />
              <p className="text-3xl dark:text-white text-design-3">annita</p>
            </Link>
          </div>
          <div className="flex items-center gap-2 pot:gap-3">
            <NotificationsBell />
            <button
              type="button"
              title={
                theme === "light"
                  ? "Mudar para tema escuro"
                  : "Mudar para tema claro"
              }
              onClick={toggleTheme}
              className="p-2 pot:p-2 border-gray-200 dark:border-zinc-700 border rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center"
            >
              {theme === "light" ? (
                <RiMoonLine className="size-7 pot:size-5" />
              ) : (
                <RiSunLine className="size-7 pot:size-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-sm transition-all hover:bg-gray-50 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 border-gray-200 dark:border-zinc-700 border rounded-lg p-2 pot:px-3 pot:py-2 font-normal flex items-center gap-1.5"
            >
              <RiHome6Line className="size-7 pot:size-5" />
              <span className="hidden pot:inline">Página Inicial</span>
            </button>
          </div>
        </div>

        <section className="mt-5 w-full">
          <div className="w-full h-38 flex flex-col justify-end rounded-2xl bg-linear-to-br from-design-1 to-design-3">
            <div className="flex gap-2 p-5 items-center w-full justify-end">
              {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-sm transition-all hover:opacity-75 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 rounded-lg px-4 py-1.5 font-normal flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Painel de Adminstração
                </button>
              )}
            </div>
          </div>
          <div className="-mt-22 mx-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="size-24 overflow-hidden border-4 dark:border-zinc-800 border-zinc-100 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 ">
                <Image
                  src={"/img/avatar.png"}
                  alt={"Avatar"}
                  width={100}
                  className="size-18 -mb-5 dark:invert"
                  height={100}
                />
              </div>
              <div className="mb-2 pt-6 mt-20">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {user.username}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex pot:justify-start justify-between flex-wrap pb-5 items-center gap-4  mb-0 text-base text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                Registado desde {formatDate(user.createdAt)}
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="text-sm transition-all hover:bg-gray-50 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 border-gray-200 dark:border-zinc-700 border rounded-lg p-2 pot:px-3 pot:py-2 font-normal flex items-center gap-1.5"
              >
                <RiShareForwardLine className="size-6 pot:size-5" />
                <span className="hidden pot:inline">Partilhar</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <div className="mt-10 border-b border-zinc-200 dark:border-zinc-700 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <div className="flex gap-12 px-7 min-w-max">
            {[
              {
                id: "events",
                label: "Meus Eventos",
                icon: RiCalendarEventLine,
              },
              { id: "reports", label: "Denúncias", icon: RiFlagLine },
              { id: "settings", label: "Configurações", icon: RiSettings4Line },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "events" | "reports" | "settings")
                  }
                  className={`relative py-4 text-[15px] font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                    isActive
                      ? "dark:text-design-1 text-design-2"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 dark:bg-design-1 bg-design-2"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="py-8 pot:mx-7">
          {activeTab === "events" && (
            <ProfileEvents isLoading={myEventsPending} events={myEvents} />
          )}

          {activeTab === "reports" && <ProfileReports token={token ?? ""} />}

          {activeTab === "settings" && (
            <ProfileSettings
              user={user}
              token={token ?? ""}
              onSignout={handleSignout}
              onSave={handleSaveSettings}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
        </div>
      </header>
    </div>
  );
}
