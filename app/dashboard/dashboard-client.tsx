"use client";

import { RiEqualizerLine } from "@remixicon/react";
import { Search } from "lucide-react";
import Image from "next/image";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import DashboardContent from "./dashboard-content";
import EventosContent from "./eventos-content";
import UsuariosContent from "./usuarios-content";
import CategoriasContent from "./categorias-content";
import NewsletterContent from "./newsletter-content";

interface DashboardClientProps {
  initialTab: string;
}

export default function DashboardClient({ initialTab }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const router = useRouter();
  const pathname = usePathname();

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  }

  return (
    <div className="w-full h-dvh bg-[#f5f5f5] grid grid-cols-[4%_96%]">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="h-dvh overflow-y-auto">
        <section id="dashboard" className="p-10">
          <header className="flex items-center justify-between">
            <div className="w-full">
              <InputGroup className="max-w-lg bg-white">
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <RiEqualizerLine />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div>
              <button className="px-5 py-1.5 gap-2 border bg-white hover:bg-zinc-100 transition-all border-gray-200 rounded-lg flex items-center">
                <Image
                  src={"/img/avatar.png"}
                  alt={"Avatar"}
                  width={100}
                  className="size-5"
                  height={100}
                />
                <span className="text-zinc-900 inline-flex pe-2 text-sm">
                  msalembe
                </span>
              </button>
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
