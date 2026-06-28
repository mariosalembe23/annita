"use client";

import {
  RiEqualizerLine,
  RiMailSendFill,
  RiSearchLine,
  RiStackFill,
  RiStickyNoteAddFill,
} from "@remixicon/react";
import { motion } from "framer-motion";
import { EventCard } from "@/components/EventCard";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { events } from "@/data/events";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 } as const,
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Home() {
  const { isLoggedIn, user, isLoading } = useUser();

  return (
    <div className="overflow-x-hidden relative">
      <Nav />

      <motion.header variants={container} initial="hidden" animate="show">
        <section className="grid pt-24 max-w-7xl mt-16 gap-32 items-center mx-auto grid-cols-[50%_50%]">
          <motion.div variants={item} className="max-w-3xl">
            <p className="px-4 py-2 rounded-full text-sm font-normal bg-design-2/10 gap-2 items-center gap- text-design-3 inline-flex mb-6">
              <RiMailSendFill className="size-4" />
              Subscreva a nossa newsletter
            </p>
            <h1 className="text-7xl leading-16 font-medium">
              O teu próximo{" "}
              <span className="text-design-2 font-medium">evento</span> começa
              aqui.
            </h1>
            <p className="mt-10 text-lg font-normal max-w-xl text-zinc-600">
              Publique ou encontre eventos relacionados com a tecnologia em
              Angola. Desde meetups a conferências, tudo o que precisas para
              estares a par do que se passa no mundo tech.
            </p>
            <motion.div
              variants={item}
              className="flex items-center gap-2 mt-6"
            >
              <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                <RiStackFill className="size-4" />
                Explorar eventos
              </button>
              <Link href={"/events/create"}>
                <button className="text-base transition-all hover:opacity-75 bg-white text-design-3 border-gray-200 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                  <RiStickyNoteAddFill className="size-4" />
                  Publicar evento
                </button>
              </Link>
            </motion.div>
            <motion.footer variants={item} className="flex items-center gap-12">
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 gap-0.5 mt-10">
                  Visitas
                </p>
                <p className="text-xl text-black gap-0.5">10K</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 gap-0.5 mt-10">
                  Eventos
                </p>
                <p className="text-xl text-black gap-0.5">50</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="flex items-center text-gray-500 gap-0.5 mt-10">
                  Contribuidores
                </p>
                <p className="text-xl text-black gap-0.5">12</p>
              </div>
            </motion.footer>
          </motion.div>
          <motion.div variants={item} className="relative mt-20">
            <div className="flex items-center ms-20 gap-2 relative justify-center">
              {events.slice(0, 3).map((event) => (
                <EventCard type="presentation" key={event.id} event={event} />
              ))}
            </div>
          </motion.div>
        </section>
      </motion.header>

      <motion.main
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-28"
      >
        <section className="max-w-7xl mx-auto w-full">
          <motion.header
            variants={item}
            className="flex items-center mt-10 justify-between"
          >
            <h2 className="text-5xl font-medium">Eventos</h2>
            <div className="flex items-center gap-4">
              <div className="flex w-96 transition-all focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-400  items-center justify-between px-3 py-2 rounded-lg border border-gray-200">
                <RiSearchLine className="size-5 text-zinc-400" />
                <input
                  className="w-full outline-none ps-2"
                  type="text"
                  name="text"
                  id="text"
                  placeholder="Pesquisar"
                />
                <button className="text-zinc-600 transition-all hover:text-black">
                  <RiEqualizerLine className="size-5 " />
                </button>
              </div>
            </div>
          </motion.header>
          <motion.div
            variants={item}
            className="mt-10 grid grid-cols-4 gap-x-6 gap-y-4"
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}
