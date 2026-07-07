"use client";

import {
  RiGithubFill,
  RiInstagramLine,
  RiLinkedinFill,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Eventos", href: "/events" },
  { name: "Contacto", href: "/contact" },
  { name: "Contribuir", href: "https://github.com/mariosalembe23/annita" },
];

const policies = [
  { name: "Política de Privacidade", href: "/privacy" },
  { name: "Política de Cookies", href: "/cookies" },
  { name: "Termos e Condições", href: "/terms" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast("success", "Inscrição realizada com sucesso!");
    setEmail("");
  };

  return (
    <footer className="border-t border-gray-100 dark:border-zinc-700/50 mt-28">
      <div className="max-w-7xl mx-auto w-full py-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-4">
          <Link href={"/"} className="flex items-center gap-2 mb-4">
            <Image
              src={"/img-logo/simple-logo.svg"}
              alt={"Logo"}
              width={100}
              className="w-12 mt-1"
              height={100}
            />
          </Link>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-sm text-[15px] leading-relaxed">
            A plataforma de eventos de tecnologia em Angola. Publica, descobre e
            participa nos melhores eventos tech do país.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a
              href="https://linkedin.com/company/annita"
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-design-2 hover:border-design-2/40 transition-colors"
            >
              <RiLinkedinFill className="size-8" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-medium text-sm mb-4">Navegação</h4>
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="text-[15px] text-zinc-600 dark:text-zinc-400 hover:text-design-2 dark:hover:text-design-1 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="font-medium text-sm mb-4">Contacto</h4>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:ola@annita.co"
                className="text-[15px] text-zinc-600 dark:text-zinc-400 hover:text-design-2 dark:hover:text-design-1 transition-colors"
              >
                ola@annita.co
              </a>
            </li>
            <li>
              <a
                href="tel:+244900000000"
                className="text-[15px] text-zinc-600 dark:text-zinc-400 hover:text-design-2 dark:hover:text-design-1 transition-colors"
              >
                +244 900 000 000
              </a>
            </li>
          </ul>
          <h4 className="font-medium text-sm mb-4 mt-8">Legal</h4>
          <ul className="space-y-3">
            {policies.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-[15px] text-zinc-600 dark:text-zinc-400 hover:text-design-2 dark:hover:text-design-1 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="font-medium text-sm mb-4">Newsletter</h4>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            Recebe as novidades e eventos directamente no teu email.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <Button
              type="submit"
              className="shrink-0 text-white bg-design-2 hover:bg-design-2/90"
            >
              Subscrever
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-zinc-700/50">
        <p className="max-w-7xl mx-auto w-full text-center text-sm text-zinc-400 dark:text-zinc-400 py-6 px-4">
          &copy; {new Date().getFullYear()} annita. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
