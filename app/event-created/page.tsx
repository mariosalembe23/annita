"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { getMyEvents } from "@/lib/api/events";
import { Confetti } from "@/components/ui/confetti";

export default function EventCreated() {
  const { token } = useUser();
  const { data, isPending } = useQuery({
    queryKey: ["my-events"],
    queryFn: () => getMyEvents(token!),
    enabled: !!token,
  });

  const hasApproved = data?.data?.some((e) => e.status === "APPROVED") ?? false;
  const loaded = !!data;

  if (isPending || !loaded) {
    return (
      <div className="w-full bg-[#f5f5f5] dark:bg-[#18181b] h-dvh flex items-center justify-center">
        <div className="max-w-md bg-white dark:bg-zinc-900 w-full p-7 border rounded-2xl border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex justify-end">
            <div className="size-5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="size-24 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full animate-pulse" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6 animate-pulse" />
          </div>
          <div className="flex justify-end">
            <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f5f5] dark:bg-[#18181b] h-dvh flex items-center justify-center">
      <Confetti
        className="fixed w-full inset-0 pointer-events-none z-50"
        options={{
          particleCount: 120,
          spread: 180,
          startVelocity: 40,
          origin: { y: 0.15 },
          colors: [
            "#6366f1",
            "#8b5cf6",
            "#a855f7",
            "#c084fc",
            "#f472b6",
            "#22d3ee",
            "#34d399",
          ],
        }}
      />
      <Confetti
        className="fixed w-full inset-0 pointer-events-none z-50"
        options={{
          particleCount: 100,
          spread: 160,
          startVelocity: 30,
          origin: { y: 0.5 },
          colors: [
            "#6366f1",
            "#8b5cf6",
            "#a855f7",
            "#c084fc",
            "#f472b6",
            "#22d3ee",
          ],
        }}
      />
      <div className="max-w-md bg-white dark:bg-zinc-900 w-full p-7 border rounded-2xl border-zinc-200 dark:border-zinc-800">
        <header>
          <div className="flex items-center justify-end">
            <Link href="/">
              <button className="size-5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all cursor-pointer">
                <X className="size-5" />
              </button>
            </Link>
          </div>
          <div className="pot:mt-3 mt-7">
            <Image
              src={"/img/happy.png"}
              alt="icon"
              width={100}
              height={100}
              className="w-24 mb-4 dark:invert"
            />
          </div>
          <h2 className="text-2xl mt-8 font-medium text-zinc-900 dark:text-zinc-100">
            Evento criado
          </h2>
          {hasApproved ? (
            <p className="text-zinc-700 dark:text-zinc-300 text-[15px] mt-2">
              Parabéns! O teu evento já está publicado e disponível para
              exploração na plataforma. Caso necessário, podes realizar
              alterações nas configurações do evento sempre que desejares.
            </p>
          ) : (
            <p className="text-zinc-700 dark:text-zinc-300 text-[15px] mt-2">
              O teu evento foi recebido com sucesso!{" "}
              <span className="font-semibold text-black dark:text-white">
                Como é o teu primeiro post, ele precisa ser revisado pela nossa
                equipa antes de ser publicado.
              </span>{" "}
              Assim que for aprovado, estará visível para todos na plataforma.
              Agradecemos a compreensão — esta medida é para garantir a
              segurança e qualidade do conteúdo.
            </p>
          )}
        </header>
        <Link href="/">
          <button
            type="button"
            className="text-sm mt-4 float-right transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal inline-flex items-center gap-2 cursor-pointer"
          >
            Continuar
          </button>
        </Link>
      </div>
    </div>
  );
}
