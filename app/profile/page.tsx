"use client";

import {
  RiShareForwardLine,
  RiCalendarEventLine,
  RiFlagLine,
  RiSettings4Line,
  RiNotificationLine,
  RiMoonLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adaptApiEvent, formatDate } from "@/data/events";
import { getMyEvents } from "@/lib/api/events";
import { removeCookie } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { ProfileEvents } from "./ProfileEvents";
import { ProfileReports } from "./ProfileReports";
import { ProfileSettings } from "./ProfileSettings";

export default function ProfilePage() {
  const { user, token, isLoggedIn, isLoading } = useUser();
  const { toast } = useToast();
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

  const adaptedEvents = myEventsData?.data.map(adaptApiEvent) ?? [];

  const handleSignout = () => {
    removeCookie("token");
    toast("success", "Sessão terminada.");
    router.push("/");
  };

  const handleSaveSettings = () => {
    toast("success", "Definições guardadas com sucesso!");
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-design-2 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pb-16">
      <header className="max-w-7xl mx-auto px-4">
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
              <p className="text-3xl text-design-3">annita</p>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative">
              <RiNotificationLine />
              <div className="absolute -top-0.5 right-1 size-2.5 rounded-full bg-red-500" />
            </button>
            <button className="relative">
              <RiMoonLine />
            </button>
            <button className="text-sm transition-all hover:opacity-75 bg-white text-black border-gray-200 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-1.5">
              <RiShareForwardLine className="size-5" />
              Partilhar
            </button>
          </div>
        </div>

        <section className="mt-5 w-full">
          <div className="w-full h-38 flex flex-col justify-end rounded-2xl bg-linear-to-br from-design-1 to-design-3">
            <div className="flex gap-2 p-5 items-center w-full justify-end">
              <button
                onClick={() => setActiveTab("settings")}
                className="text-sm transition-all hover:opacity-75 bg-white text-black rounded-lg px-4 py-1.5 font-normal flex items-center gap-2 cursor-pointer shadow-sm"
              >
                Editar Perfil
              </button>
              {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-sm transition-all hover:opacity-75 bg-white text-black rounded-lg px-4 py-1.5 font-normal flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Painel de Adminstração
                </button>
              )}
            </div>
          </div>
          <div className="-mt-22 mx-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="size-24 overflow-hidden border-4 border-zinc-100 flex items-center justify-center rounded-full bg-white ">
                <Image
                  src={"/img/avatar.png"}
                  alt={"Avatar"}
                  width={100}
                  className="size-18 -mb-5"
                  height={100}
                />
              </div>
              <div className="mb-2 pt-6 mt-20">
                <h2 className="text-2xl font-bold text-zinc-900">
                  {user.username}
                </h2>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap pb-5 items-center gap-4 mb-2 text-base text-zinc-600">
              <span className="flex items-center gap-1">
                Registado desde {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <div className="mt-10 border-b border-zinc-200">
          <div className="flex gap-12 mx-7">
            {[
              { id: "events", label: "Meus Eventos", icon: RiCalendarEventLine },
              { id: "reports", label: "Denúncias", icon: RiFlagLine },
              { id: "settings", label: "Configurações", icon: RiSettings4Line },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative py-4 text-[15px] font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                    isActive
                      ? "text-design-2"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-design-2"
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
        <div className="py-8 mx-7">
          {activeTab === "events" && (
            <ProfileEvents isLoading={myEventsPending} events={adaptedEvents} />
          )}

          {activeTab === "reports" && <ProfileReports />}

          {activeTab === "settings" && (
            <ProfileSettings
              user={user}
              onSignout={handleSignout}
              onSave={handleSaveSettings}
            />
          )}
        </div>
      </header>
    </div>
  );
}
