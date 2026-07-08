import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Política de Cookies — Annita",
  description:
    "Política de Cookies da plataforma Annita. Saiba como usamos cookies para melhorar o seu acesso aos eventos tech em Angola.",
};

export default function CookiesPage() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-white dark:bg-background text-zinc-800 dark:text-zinc-200">
      <Nav
        links={[
          { name: "Início", href: "/" },
          { name: "Eventos", href: "/events" },
          {
            name: "Contribuir",
            href: "https://github.com/mariosalembe23/annita",
          },
        ]}
      />

      <main className="pt-32 pb-24 max-w-3xl mx-auto px-5">
        <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
          Política de Cookies
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Última atualização: 8 de Julho de 2026
        </p>

        <div className="space-y-6 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p>
            Na <strong>Annita</strong>, acreditamos ser transparente sobre a
            forma como recolhemos e utilizamos dados que lhe dizem respeito.
            Esta Política de Cookies explica detalhadamente o que são cookies,
            como os utilizamos e como pode controlá-los.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            1. O que são Cookies?
          </h2>
          <p>
            Cookies são pequenos ficheiros de texto armazenados no seu
            computador ou dispositivo móvel através do navegador web quando
            visita um website. Permitem ao site reconhecer o seu dispositivo,
            guardar as suas preferências de navegação e melhorar a sua
            experiência global.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            2. Como Usamos os Cookies?
          </h2>
          <p>
            Utilizamos cookies para assegurar o correto funcionamento da
            plataforma e compreender o uso geral do nosso serviço. Os cookies
            que usamos dividem-se em:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Cookies Estritamente Necessários:</strong> Essenciais para
              permitir a navegação na plataforma e aceder a áreas seguras (como
              o início de sessão no Perfil de Utilizador). Sem estes cookies, a
              plataforma não funcionará corretamente.
            </li>
            <li>
              <strong>Cookies de Funcionalidade:</strong> Permitem que a
              plataforma se lembre das suas opções (como o seu tema preferido -
              Claro ou Escuro) e personalize a sua experiência.
            </li>
            <li>
              <strong>Cookies de Análise e Desempenho:</strong> Recolhem dados
              anónimos sobre como os utilizadores interagem com o site (por
              exemplo, quais os eventos mais visualizados). Estes dados
              ajudam-nos a melhorar a navegação e a estrutura da plataforma.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            3. Os Cookies que Definimos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-zinc-200 dark:border-zinc-700 text-sm mt-4">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800">
                  <th className="p-3 border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-200">
                    Nome do Cookie
                  </th>
                  <th className="p-3 border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-200">
                    Propósito
                  </th>
                  <th className="p-3 border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-700 dark:text-zinc-200">
                    Duração
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700 font-mono">
                    token
                  </td>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700">
                    Armazena o token de sessão seguro (JWT) para manter o
                    utilizador ligado.
                  </td>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700">
                    Sessão / 7 dias
                  </td>
                </tr>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/30">
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700 font-mono">
                    theme
                  </td>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700">
                    Guarda a preferência do tema do ecrã (light ou dark).
                  </td>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700">
                    Persistente
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700 font-mono">
                    cookie-consent
                  </td>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700">
                    Guarda a sua aceitação desta Política de Cookies.
                  </td>
                  <td className="p-3 border border-zinc-200 dark:border-zinc-700">
                    1 ano
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            4. Como Controlar os Cookies?
          </h2>
          <p>
            O utilizador tem o direito de aceitar ou recusar cookies. Pode
            alterar as definições de cookies no banner inicial de consentimento
            da Annita. Além disso, a maioria dos navegadores de internet permite
            gerir, bloquear ou eliminar cookies nas preferências do próprio
            browser.
          </p>
          <p>
            Note que desativar cookies necessários pode impedir o início de
            sessão ou a utilização de certas funcionalidades básicas na nossa
            plataforma.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            5. Contacto
          </h2>
          <p>
            Se tiver dúvidas ou comentários sobre esta Política de Cookies, por
            favor contacte-nos pelo e-mail:{" "}
            <a
              href="mailto:ola@annita.co"
              className="text-design-2 dark:text-design-1 hover:underline"
            >
              ola@annita.co
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
