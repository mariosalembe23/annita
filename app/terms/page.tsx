import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Termos e Condições",
  description:
    "Termos e Condições da plataforma Annita. Leia as regras de utilização para publicar e explorar eventos de tecnologia em Angola.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
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
          Termos e Condições
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Última atualização: 8 de Julho de 2026
        </p>

        <div className="space-y-6 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p>
            Bem-vindo à <strong>Annita</strong>. Ao aceder ou utilizar a nossa
            plataforma, concorda em ficar vinculado a estes Termos e Condições
            de Uso. Por favor, leia-os com atenção antes de continuar a utilizar
            os nossos serviços.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            1. Aceitação dos Termos
          </h2>
          <p>
            Ao utilizar a Annita, declara ter capacidade jurídica para consentir
            estes termos. Se não concordar com qualquer parte destes termos, não
            deverá aceder nem utilizar a plataforma.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            2. Registo de Conta e Segurança
          </h2>
          <p>
            Para aceder a certas funcionalidades (como publicar eventos, votar
            ou efetuar denúncias), é necessário criar uma conta de utilizador.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              O utilizador é responsável por fornecer dados verdadeiros, exatos
              e atualizados durante o registo.
            </li>
            <li>
              O utilizador é inteiramente responsável por manter a
              confidencialidade das credenciais de acesso da sua conta.
            </li>
            <li>
              Deve notificar-nos imediatamente sobre qualquer uso não autorizado
              ou suspeito da sua conta.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            3. Publicação de Conteúdo e Regras de Conduta
          </h2>
          <p>
            Ao publicar um evento na Annita, assume total responsabilidade pelo
            conteúdo do mesmo. Ao submeter informações, o utilizador concorda
            que:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Não publicará informações falsas, enganosas, fraudulentas ou que
              promovam atividades ilegais.
            </li>
            <li>
              Não publicará eventos que contenham publicidade abusiva, spam,
              assédio, ou linguagem ofensiva/discriminatória.
            </li>
            <li>
              Possui todos os direitos intelectuais e autorizações necessárias
              sobre as imagens e textos carregados.
            </li>
            <li>
              A Annita reserva-se o direito de remover qualquer evento ou banir
              contas de utilizadores que violem estas diretrizes de comunidade,
              sem aviso prévio.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            4. Propriedade Intelectual
          </h2>
          <p>
            Todos os logótipos, design do site, código-fonte e marcas registadas
            pertencem à Annita e aos seus respetivos criadores. O uso não
            autorizado de qualquer material da marca é estritamente proibido.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            5. Limitação de Responsabilidade
          </h2>
          <p>
            A Annita é uma plataforma agregadora de eventos. Não organizamos os
            eventos listados e não assumimos qualquer responsabilidade pela
            veracidade das informações fornecidas pelos utilizadores, nem por
            quaisquer danos, cancelamentos ou imprevistos ocorridos nos eventos
            anunciados. O utilizador participa em qualquer evento de tecnologia
            por sua conta e risco.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            6. Alterações aos Termos
          </h2>
          <p>
            Podemos atualizar estes Termos e Condições periodicamente para
            refletir alterações nos nossos serviços ou por motivos legais. A
            continuação da utilização da plataforma após as alterações constitui
            aceitação dos novos Termos.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            7. Contacto
          </h2>
          <p>
            Para esclarecer qualquer dúvida sobre estes Termos, envie um e-mail
            para:{" "}
            <a
              href="mailto:geral.annita@gmail.com"
              className="text-design-2 dark:text-design-1 hover:underline"
            >
              geral.annita@gmail.com
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
