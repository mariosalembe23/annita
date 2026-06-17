<div align="center">
  <img src="/public/img-logo/white-logo.svg" alt="Annita" width="200" />
  <p><strong>A plataforma de eventos de tecnologia em Angola.</strong></p>
  <p>Publica, descobre e participa nos melhores eventos tech do país.</p>
</div>

---

## Sobre

**Annita** é uma plataforma angolana de descoberta e publicação de eventos de tecnologia. O objectivo é centralizar tudo o que acontece no ecossistema tech de Angola — hackathons, workshops, conferências, meetups, bootcamps e muito mais — num só lugar.

### Funcionalidades actuais

- **Navegar eventos** — grid de eventos com busca e filtros
- **Ver detalhes** — modal com descrição completa, data, local, imagens
- **Criar eventos** — formulário multi-campo com categorias, modalidade, tipo, imagens
- **Galeria de imagens** — visualizador full-screen com navegação
- **Compromisso de veracidade** — modal de confirmação antes de publicar

---

## Tech Stack

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript 5 (strict) |
| **UI** | React 19 + shadcn/ui + Radix UI |
| **Estilos** | Tailwind CSS v4 |
| **Animação** | Framer Motion |
| **Gráficos** | Three.js (shader art) |
| **Ícones** | Remixicon + Lucide |
| **Package manager** | pnpm |

---

## Primeiros passos

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) no teu browser.

---

## Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia servidor de desenvolvimento (Turbopack) |
| `pnpm build` | Faz build de produção |
| `pnpm start` | Inicia servidor de produção |
| `pnpm lint` | Correr ESLint |

---

## Projecto

```
annita/
├── app/                  # Páginas (Next.js App Router)
│   ├── page.tsx          # Home / Landing page
│   ├── events/           # Listagem e criação de eventos
│   ├── signin/           # Autenticação (UI)
│   └── signup/           # Registo (UI)
├── components/           # Componentes React
│   ├── EventCard.tsx     # Card de evento
│   ├── EventDetailModal.tsx
│   ├── EventActionsDropdown.tsx
│   ├── PublishConfirmationModal.tsx
│   ├── Nav.tsx / Footer.tsx
│   └── ColorBends.tsx    # Arte generativa Three.js
├── data/
│   └── events.ts         # Dados mockados + interfaces
└── public/
    └── img-logo/         # Logótipos
```

---

## Estado

🔄 **MVP — Frontend.** A plataforma está numa fase inicial de desenvolvimento.
Ainda não tem backend, base de dados nem autenticação funcional.

### Próximos passos

- [ ] Backend e API
- [ ] Autenticação (NextAuth / lucia / Clerk)
- [ ] Base de dados (PostgreSQL + Prisma)
- [ ] Sistema de denúncias e moderação
- [ ] Painel para moderadores

---

<div align="center">
  <p>Feito com 💙 para a comunidade tech angolana</p>
</div>
