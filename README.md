<div align="center">
  <img src="https://raw.githubusercontent.com/mariosalembe23/annita/main/public/img-logo/white-logo.svg" alt="Annita" width="200" />
  <p><strong>A plataforma de eventos de tecnologia em Angola.</strong></p>
  <p>Publica, descobre e participa nos melhores eventos tech do país.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/pnpm-package%20manager-F69220?logo=pnpm" alt="pnpm" />
  </p>
</div>

---

## Sobre

**Annita** é uma plataforma angolana de descoberta e publicação de eventos de tecnologia. O objectivo é centralizar tudo o que acontece no ecossistema tech de Angola — hackathons, workshops, conferências, meetups, bootcamps e muito mais — num só lugar, facilitando a ligação entre organizadores e a comunidade.

### Funcionalidades

- **Autenticação completa** — registo e login com email/username + token JWT
- **Verificação de email** — envio e confirmação de código de verificação
- **Sessão persistente** — token armazenado em cookies com `Secure; SameSite=Lax`
- **Força de palavra-passe** — indicador visual em tempo real
- **Notificações toast** — feedback centralizado para erro, sucesso e info
- **Navegar eventos** — grid de eventos com busca por texto e filtros (categoria, modalidade, tipo)
- **Ver detalhes** — modal com descrição completa, data, local, link e galeria de imagens
- **Criar eventos** — formulário multi-campo com categorias, modalidade, tipo e imagem de capa
- **Galeria de imagens** — visualizador full-screen com navegação por teclado
- **Votar em eventos** — sistema de upvote/downvote por utilizadores registados
- **Denunciar eventos** — sistema de reporte com razão textual
- **Newsletter** — subscrição com preferências de categorias
- **Notificações** — sino de notificações com contagem e listagem
- **Painel de Administração** — gestão de eventos (aprovar, rejeitar, eliminar), utilizadores, categorias e newsletter
- **Perfil do utilizador** — página de perfil com os seus eventos, denúncias e configurações
- **Modo escuro/claro** — suporte a tema com preferência guardada
- **Responsivo** — experiência optimizada de mobile a desktop

---

## Tech Stack

| Camada              | Tecnologia                      |
| ------------------- | ------------------------------- |
| **Framework**       | Next.js 16 (App Router)         |
| **Linguagem**       | TypeScript 5 (strict)           |
| **UI**              | React 19 + shadcn/ui + Radix UI |
| **Estilos**         | Tailwind CSS v4                 |
| **Animação**        | Framer Motion                   |
| **Gráficos**        | Three.js (shader art)           |
| **Ícones**          | Remixicon + Lucide              |
| **HTTP**            | Axios                           |
| **Data Fetching**   | TanStack Query v5               |
| **Estado global**   | Zustand                         |
| **Formulários**     | react-hook-form                 |
| **Package manager** | pnpm                            |

---

## Primeiros passos

### Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) no teu browser.

### Variáveis de ambiente

Copia `.env.example` para `.env` e preenche:

```bash
cp .env.example .env
```

| Variável              | Descrição                                         |
| --------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base da API (ex: `http://localhost:8080/api`) |

---

## Scripts

| Comando      | Descrição                                        |
| ------------ | ------------------------------------------------ |
| `pnpm dev`   | Inicia servidor de desenvolvimento (Turbopack)   |
| `pnpm build` | Faz build de produção                            |
| `pnpm start` | Inicia servidor de produção                      |
| `pnpm lint`  | Executa ESLint                                   |

---

## Fluxo de autenticação

1. O utilizador faz **login** ou **registo** via `/signin` ou `/signup`
2. A API devolve um **token JWT**
3. Se o email não estiver verificado, abre-se um modal para **confirmar o código de verificação**
4. Após verificação, o token é **guardado num cookie** (`token`) com `Secure; SameSite=Lax`
5. Nas requisições seguintes, o token é enviado no header `Authorization: Bearer <token>`
6. O hook `useUser()` descodifica o token, faz fetch via `GET /api/users/{id}` e expõe `{ user, isLoggedIn, isLoading }`
7. Se o token estiver expirado ou inválido, o utilizador é redirecionado para `/signin`

---

## Estrutura do projecto

```
annita/
├── app/                          # Páginas (Next.js App Router)
│   ├── layout.tsx                # Layout global com metadados SEO e Providers
│   ├── page.tsx                  # Home / Landing page
│   ├── sitemap.ts                # Sitemap XML dinâmico
│   ├── robots.ts                 # Regras para crawlers
│   ├── globals.css               # Estilos globais + breakpoints
│   ├── events/
│   │   ├── page.tsx              # Listagem de eventos
│   │   ├── EventsList.tsx        # Grid de eventos com filtros
│   │   └── create/page.tsx       # Criar evento
│   ├── event/[id]/page.tsx       # Detalhe de evento
│   ├── dashboard/
│   │   ├── layout.tsx            # Layout do dashboard (noindex)
│   │   ├── page.tsx              # Entrada do painel
│   │   ├── dashboard-client.tsx  # Shell do painel com tabs
│   │   ├── sidebar.tsx           # Navegação lateral
│   │   ├── dashboard-content.tsx # Métricas e visão geral
│   │   ├── eventos-content.tsx   # Gestão de eventos
│   │   ├── usuarios-content.tsx  # Gestão de utilizadores
│   │   ├── categorias-content.tsx# Gestão de categorias
│   │   ├── newsletter-content.tsx# Gestão de newsletter
│   │   ├── event-card.tsx        # Card de evento no dashboard
│   │   ├── event-details-dialog.tsx # Detalhe de evento no dashboard
│   │   └── edit-event-sheet.tsx  # Sheet de edição de evento
│   ├── profile/
│   │   ├── layout.tsx            # Layout do perfil (noindex)
│   │   ├── page.tsx              # Página de perfil
│   │   ├── ProfileEvents.tsx     # Aba de eventos do utilizador
│   │   ├── ProfileReports.tsx    # Aba de denúncias
│   │   └── ProfileSettings.tsx   # Aba de configurações
│   ├── signin/
│   │   ├── layout.tsx            # Metadados de SEO
│   │   └── page.tsx              # Login
│   ├── signup/
│   │   ├── layout.tsx            # Metadados de SEO
│   │   └── page.tsx              # Registo
│   ├── newsletter/
│   │   ├── layout.tsx            # Metadados de SEO
│   │   └── page.tsx              # Subscrição de newsletter
│   ├── privacy/page.tsx          # Política de privacidade
│   ├── terms/page.tsx            # Termos e condições
│   └── cookies/page.tsx          # Política de cookies
├── components/
│   ├── ui/                       # Componentes primitivos (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── Nav.tsx                   # Navbar com dropdown de avatar
│   ├── Footer.tsx
│   ├── EventCard.tsx             # Card de evento (suporte a status badge)
│   ├── NotificationsBell.tsx     # Sino de notificações
│   ├── CookieConsent.tsx         # Banner de consentimento de cookies
│   ├── ColorBends.tsx            # Arte generativa Three.js (hero)
│   ├── EmailVerificationModal.tsx
│   ├── PublishConfirmationModal.tsx
│   └── Providers.tsx             # QueryClient + ToastProvider
├── hooks/
│   ├── use-toast.tsx
│   ├── use-user.ts
│   └── use-theme.ts
├── lib/
│   ├── api.ts                    # Instância Axios configurada
│   ├── utils.ts                  # cn(), decodeToken, cookies
│   ├── store/
│   │   └── dashboard-store.ts    # Estado global do dashboard (Zustand)
│   └── api/
│       ├── auth.ts
│       ├── events.ts
│       ├── categories.ts
│       ├── metrics.ts
│       ├── newsletter.ts
│       └── notifications.ts
├── data/
│   └── events.ts                 # Utilitários e tipos de eventos
├── public/
│   ├── img-logo/                 # Logótipos (SVG)
│   └── img/                      # Imagens estáticas
├── docs/
│   └── SEGURANCA-E-MODERACAO.md
├── .env.example
└── next.config.ts
```

---

## Categorias de eventos (seed)

Para a API funcionar correctamente com o formulário de criação, regista as categorias no endpoint `POST /api/categories`:

```json
{ "name": "Hackathon", "groupName": "Competição & Inovação" }
{ "name": "Workshop", "groupName": "Formação" }
{ "name": "Conferência", "groupName": "Formação" }
{ "name": "Meetup", "groupName": "Networking" }
{ "name": "Bootcamp", "groupName": "Formação" }
```

---

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faz **fork** do repositório
2. Cria uma branch para a tua funcionalidade: `git checkout -b feat/minha-feature`
3. Faz **commit** das alterações: `git commit -m "feat: adiciona X"`
4. Faz **push** para a branch: `git push origin feat/minha-feature`
5. Abre um **Pull Request**

Por favor, segue o estilo de código existente (TypeScript strict, Tailwind v4, convenções do App Router).

---

## Estado

✅ **Plataforma activa com backend real.** As funcionalidades principais estão implementadas e em produção.

### Em desenvolvimento

- [ ] Upload de foto de perfil
- [ ] Página pública de perfil (`/u/:username`)
- [ ] Modo de visualização em lista vs. grid
- [ ] Internacionalização (i18n)

---

<div align="center">
  <p>Feito com 💙 para a comunidade tech angolana</p>
</div>
