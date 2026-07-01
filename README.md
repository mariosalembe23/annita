<div align="center">
  <img src="/public/img-logo/white-logo.svg" alt="Annita" width="200" />
  <p><strong>A plataforma de eventos de tecnologia em Angola.</strong></p>
  <p>Publica, descobre e participa nos melhores eventos tech do país.</p>
</div>

---

## Sobre

**Annita** é uma plataforma angolana de descoberta e publicação de eventos de tecnologia. O objectivo é centralizar tudo o que acontece no ecossistema tech de Angola — hackathons, workshops, conferências, meetups, bootcamps e muito mais — num só lugar.

### Funcionalidades actuais

- **Autenticação** — registo e login com email/username + token JWT
- **Verificação de email** — envio e confirmação de código de verificação
- **Sessão persistente** — token armazenado em cookies, reconhecido entre páginas
- **Força de palavra-passe** — indicador visual em tempo real enquanto o utilizador digita
- **Notificações toast** — feedback centralizado com ícones para erro, sucesso e info
- **Navegar eventos** — grid de eventos com busca e filtros
- **Ver detalhes** — modal com descrição completa, data, local, imagens
- **Criar eventos** — formulário multi-campo com categorias, modalidade, tipo, imagens
- **Galeria de imagens** — visualizador full-screen com navegação
- **Compromisso de veracidade** — modal de confirmação antes de publicar

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
| **HTTP**            | Axios (com `withCredentials`)   |
| **Data Fetching**   | TanStack Query (React Query)    |
| **Formulários**     | react-hook-form                 |
| **Package manager** | pnpm                            |

---

## Primeiros passos

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) no teu browser.

### Variáveis de ambiente

Copia `.env.example` para `.env.local` e preenche:

```bash
cp .env.example .env.local
```

| Variável              | Descrição                                         |
| --------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base da API (ex: `http://localhost:8080/api`) |

---

## Scripts

| Comando      | Descrição                                      |
| ------------ | ---------------------------------------------- |
| `pnpm dev`   | Inicia servidor de desenvolvimento (Turbopack) |
| `pnpm build` | Faz build de produção                          |
| `pnpm start` | Inicia servidor de produção                    |
| `pnpm lint`  | Correr ESLint                                  |

---

## Fluxo de autenticação

1. O utilizador faz **login** ou **registo** através dos formulários em `/signin` ou `/signup`
2. A API devolve um **token JWT**
3. Se o email ainda não estiver verificado, o token fica pendente e abre-se um modal para **enviar e confirmar o código de verificação**
4. Após verificação (ou se já estiver verificado), o token é **guardado num cookie** (`token`) com `Secure; SameSite=Lax`
5. Nas requisições seguintes, o token é enviado no header `Authorization: Bearer <token>`
6. O hook `useUser()` descodifica o token, faz fetch dos dados do utilizador via `GET /api/users/{id}` e expõe `{ user, isLoggedIn, isLoading, ... }`
7. Se o token estiver expirado ou for inválido, o `isLoggedIn` fica `false` e o utilizador vê o botão **Entrar**

---

## Projecto

```
annita/
├── app/                       # Páginas (Next.js App Router)
│   ├── page.tsx               # Home / Landing page
│   ├── layout.tsx             # Layout global com Providers
│   ├── events/
│   │   ├── page.tsx           # Listagem de eventos
│   │   └── create/page.tsx    # Criar evento
│   ├── signin/page.tsx        # Login
│   └── signup/page.tsx        # Registo
├── components/
│   ├── ui/
│   │   ├── toast.tsx          # Componente de toast individual
│   │   └── toaster.tsx        # Contentor de toasts
│   ├── Nav.tsx                # Navbar com avatar/dropdown/logout
│   ├── Footer.tsx
│   ├── EventCard.tsx
│   ├── EventDetailModal.tsx
│   ├── EventActionsDropdown.tsx
│   ├── EmailVerificationModal.tsx
│   ├── NotificationPreferenceModal.tsx
│   ├── PublishConfirmationModal.tsx
│   ├── ImageViewerModal.tsx
│   ├── ColorBends.tsx         # Arte generativa Three.js
│   └── Providers.tsx          # QueryClient + ToastProvider
├── hooks/
│   ├── use-toast.tsx          # Hook + contexto de toasts
│   └── use-user.ts            # Hook de sessão do utilizador
├── lib/
│   ├── api.ts                 # Instância Axios configurada
│   ├── utils.ts               # cn(), decodeToken, cookies
│   └── api/
│       └── auth.ts            # Funções da API de autenticação
├── data/
│   └── events.ts              # Dados mockados + interfaces
├── public/
│   ├── img-logo/              # Logótipos
│   └── img/                   # Imagens (avatar, google, etc.)
├── .env.example               # Exemplo de variáveis de ambiente
└── docs/
    └── SEGURANCA-E-MODERACAO.md
```

---

## Categorias de eventos (seed para a API)

Para a API funcionar correctamente com o formulário de criação de eventos, precisas de registar as seguintes categorias no endpoint `POST /api/categories` (ou via seed no backend):

Exemplo de payload para `POST /api/categories`:

```json
{
  "name": "Hackathon",
  "groupName": "Competição & Inovação"
}
```

---

## Estado

🔄 **MVP em desenvolvimento.** A plataforma já conta com autenticação funcional com backend real e está a evoluir continuamente.

### Próximos passos

- [ ] Perfil do utilizador (/profile)
- [ ] Página de configurações (/settings)
- [ ] Upload de foto de perfil
- [ ] Painel para moderadores
- [ ] Sistema de denúncias
- [ ] Gestão de eventos (editar, cancelar)

---

<div align="center">
  <p>Feito com 💙 para a comunidade tech angolana</p>
</div>
