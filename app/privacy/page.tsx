import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Política de Privacidade — Annita",
  description:
    "Política de Privacidade da plataforma Annita. Saiba como recolhemos, processamos e protegemos os seus dados pessoais.",
};

export default function PrivacyPage() {
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
          Política de Privacidade
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Última atualização: 8 de Julho de 2026
        </p>

        <div className="space-y-6 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          <p>
            Bem-vindo à <strong>Annita</strong>. A privacidade e a segurança dos
            seus dados pessoais são de extrema importância para nós. Esta
            Política de Privacidade explica como recolhemos, utilizamos,
            processamos e protegemos os seus dados ao utilizar a nossa
            plataforma.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            1. Informações que Recolhemos
          </h2>
          <p>
            Recolhemos dados para fornecer e melhorar os nossos serviços. As
            informações recolhidas podem incluir:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Dados de Conta:</strong> Quando se regista na nossa
              plataforma, recolhemos o seu nome de utilizador e endereço de
              e-mail.
            </li>
            <li>
              <strong>Dados de Subscrição:</strong> Se optar por subscrever a
              nossa newsletter, recolhemos o seu nome, e-mail e preferências de
              categorias para lhe enviar resumos de eventos.
            </li>
            <li>
              <strong>Eventos Publicados:</strong> Qualquer informação que
              forneça ao criar um evento, incluindo título, descrição, link do
              evento, modalidade, localização e imagem de capa.
            </li>
            <li>
              <strong>Informações de Interação:</strong> Registamos votos
              (upvote/downvote) e denúncias efetuadas por si para garantir a
              qualidade da plataforma.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            2. Como Utilizamos as Suas Informações
          </h2>
          <p>
            Utilizamos as informações recolhidas para os seguintes propósitos:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Fornecer, manter e melhorar a plataforma de eventos Annita;</li>
            <li>
              Personalizar a sua experiência com base nas suas categorias de
              interesse;
            </li>
            <li>
              Enviar newsletters e notificações de novos eventos de tecnologia
              em Angola (caso tenha dado o seu consentimento);
            </li>
            <li>
              Garantir a moderação do conteúdo e investigar potenciais infrações
              de segurança ou denúncias.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            3. Partilha de Dados
          </h2>
          <p>
            A Annita não comercializa nem aluga os seus dados pessoais a
            terceiros. Os seus dados poderão ser partilhados apenas nas
            seguintes circunstâncias:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Com prestadores de serviços de confiança que operam no suporte
              técnico e infraestrutura da plataforma;
            </li>
            <li>
              Quando exigido por lei, ordens judiciais ou para cooperar com
              autoridades governamentais de Angola.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            4. Segurança dos Seus Dados
          </h2>
          <p>
            Implementamos medidas técnicas e organizacionais de segurança
            apropriadas para proteger os seus dados contra acessos não
            autorizados, alteração, divulgação ou destruição acidental. No
            entanto, lembre-se que nenhum método de transmissão de dados pela
            internet é 100% seguro.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            5. Os Seus Direitos
          </h2>
          <p>Em conformidade com a legislação aplicável, tem o direito de:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Aceder, atualizar ou retificar os seus dados pessoais a qualquer
              momento através das definições do seu Perfil;
            </li>
            <li>
              Eliminar a sua conta de forma permanente (o que apagará
              imediatamente as suas informações pessoais e os seus eventos
              criados);
            </li>
            <li>
              Cancelar a subscrição de newsletters ou comunicações promocionais
              a qualquer momento.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-4">
            6. Contacto
          </h2>
          <p>
            Se tiver alguma dúvida sobre esta Política de Privacidade ou sobre o
            tratamento dos seus dados, entre em contacto connosco através do
            e-mail:{" "}
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
