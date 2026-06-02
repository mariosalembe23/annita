import { RiGithubFill } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Eventos", href: "/events" },
  { name: "Contacto", href: "/contact" },
  { name: "Contribuir", href: "/contribute" },
];

export function Footer() {
  return (
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
            A plataforma de eventos de tecnologia em Angola. Publica, descobre e
            participa nos melhores eventos tech do país.
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
  );
}
