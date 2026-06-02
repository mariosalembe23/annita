import {
  RiEqualizerLine,
  RiGithubFill,
  RiMailSendFill,
  RiSearchLine,
  RiStackFill,
  RiStickyNoteAddFill,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { events } from "@/data/events";

const navigation = [
  { name: "Eventos", href: "/events" },
  { name: "Contacto", href: "/contact" },
  { name: "Contribuir", href: "/contribute" },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden relative">
      <header className="">
        <div className="w-full fixed bg-white z-50 right-0 top-0 left-0">
          <nav className="max-w-7xl bg-white  border-b border-gray-100 py-5 mx-auto flex items-center justify-between">
            <div>
              <Link href={"/"} className="flex items-center gap-2">
                <Image
                  src={"img-logo/simple-logo.svg"}
                  alt={"Logo"}
                  width={100}
                  className="w-5 mt-1"
                  height={100}
                />
                <p className=" text-3xl">annita</p>
              </Link>
            </div>
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-16">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[15px] font-normal text-zinc-900 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-base border-gray-200 border rounded-lg px-3 py-1.5 font-normal text-zinc-900 hover:text-gray-900 flex items-center gap-2 font-mono">
                  1.2K
                  <RiGithubFill className="size-5 text-gray-800" />
                </button>
                <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                  <RiMailSendFill className="size-4" />
                  Newsletter
                </button>
              </div>
            </div>
          </nav>
        </div>

        <section className="grid pt-24 max-w-7xl mt-16 gap-32 items-center mx-auto grid-cols-[50%_50%]">
          <div className="max-w-3xl">
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
            <div className="flex items-center gap-2 mt-6">
              <button className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                <RiStackFill className="size-4" />
                Explorar eventos
              </button>
              <button className="text-base transition-all hover:opacity-75 bg-white text-design-3 border-gray-200 border rounded-lg px-3 py-1.5 font-normal  flex items-center gap-2 ">
                <RiStickyNoteAddFill className="size-4" />
                Publicar evento
              </button>
            </div>
            <footer className="flex items-center gap-12">
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
            </footer>
          </div>
          <div className="relative mt-20">
            <div className="flex items-center ms-20 gap-2 relative justify-center">
              {events.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      </header>

      <main className="mt-28">
        <section className="max-w-7xl  mx-auto w-full">
          <header className="flex items-center mt-10 justify-between">
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
          </header>
          <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 mt-28">
        <div className="max-w-7xl mx-auto w-full py-16 grid grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href={"/"} className="flex items-center gap-2 mb-4">
              <Image
                src={"img-logo/simple-logo.svg"}
                alt={"Logo"}
                width={100}
                className="w-5 mt-1"
                height={100}
              />
              <p className="text-3xl">annita</p>
            </Link>
            <p className="text-zinc-500 max-w-sm text-[15px] leading-relaxed">
              A plataforma de eventos de tecnologia em Angola. Publica, descobre
              e participa nos melhores eventos tech do país.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-4">Navegação</h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-zinc-500 hover:text-design-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:ola@annita.co"
                  className="text-[15px] text-zinc-500 hover:text-design-2 transition-colors"
                >
                  ola@annita.co
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[15px] text-zinc-500 hover:text-design-2 transition-colors flex items-center gap-2"
                >
                  <RiGithubFill className="size-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100">
          <p className="max-w-7xl mx-auto w-full text-center text-sm text-zinc-400 py-6">
            &copy; {new Date().getFullYear()} annita. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
