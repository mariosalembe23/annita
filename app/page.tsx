import {
  RiGithubFill,
  RiMailSendFill,
  RiStackFill,
  RiStickyNoteAddFill,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Eventos", href: "/events" },
  { name: "Contacto", href: "/contact" },
  { name: "Contribuir", href: "/contribute" },
];

export default function Home() {
  return (
    <div>
      <header>
        <div className="w-full ">
          <nav className="max-w-7xl border-b border-gray-100 py-5 mx-auto flex items-center justify-between">
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

        <section className="grid max-w-7xl mt-16 mx-auto grid-cols-[60%_40%]">
          <div className="max-w-3xl">
            <p className="px-4 py-2 rounded-full text-sm font-normal bg-design-2/10 gap-2 items-center gap- text-design-3 inline-flex mb-6">
              <RiMailSendFill className="size-4" />
              Subscreva a nossa newsletter
            </p>
            <h1 className="text-8xl leading-16 font-medium">
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
          </div>
          <div className="relative">
            <div className="flex items-center  relative justify-center">
              <div className="h-96  shadow-2xl z-20 bg-white absolute top-0 border border-gray-100 rounded-3xl w-72" />
              <div className="h-96 rotate-12 bg-white border absolute top-0 border-gray-100 rounded-3xl w-72" />
              <div className="h-96 -rotate-12 bg-white border absolute top-0 border-gray-100 rounded-3xl w-72" />
            </div>
          </div>
        </section>
      </header>
    </div>
  );
}
