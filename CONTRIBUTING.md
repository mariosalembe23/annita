# Contribuir para a Annita

Obrigado pelo teu interesse em contribuir para a **Annita**! 🎉  
Este é um projeto open source criado de desenvolvedores para desenvolvedores em Angola.  
Qualquer contribuição é bem-vinda — desde correções de bugs a novas funcionalidades.

---

## Índice

- [Código de Conduta](#código-de-conduta)
- [Como posso contribuir?](#como-posso-contribuir)
- [Configuração do ambiente local](#configuração-do-ambiente-local)
- [Fluxo de trabalho com Git](#fluxo-de-trabalho-com-git)
- [Convenções de commits](#convenções-de-commits)
- [Processo de Pull Request](#processo-de-pull-request)

---

## Código de Conduta

Ao participar neste projeto, concordas em manter um ambiente respeitoso e inclusivo para todos.  
Comportamentos como assédio, discriminação ou linguagem ofensiva não serão tolerados.

---

## Como posso contribuir?

### 🐛 Reportar Bugs
Usa o template de **Bug Report** ao abrir uma issue.  
Inclui sempre: passos para reproduzir, comportamento esperado e comportamento atual.

### 💡 Sugerir Funcionalidades
Usa o template de **Feature Request** ao abrir uma issue.  
Explica o problema que a funcionalidade resolve e o valor que traz.

### 🔧 Contribuir com Código
1. Verifica as [issues abertas](https://github.com/mariosalembe23/annita/issues) para encontrar algo onde possas ajudar.
2. Comenta na issue para avisar que vais trabalhar nisso.
3. Segue o fluxo de trabalho descrito abaixo.

---

## Configuração do ambiente local

### Pré-requisitos

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- **Git**

### Passos

```bash
# 1. Faz fork do repositório no GitHub

# 2. Clona o teu fork
git clone https://github.com/<teu-utilizador>/annita.git
cd annita

# 3. Adiciona o repositório original como upstream
git remote add upstream https://github.com/mariosalembe23/annita.git

# 4. Instala as dependências
pnpm install

# 5. Copia as variáveis de ambiente
cp .env.example .env.local
# Preenche as variáveis necessárias no .env.local

# 6. Inicia o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Fluxo de trabalho com Git

```bash
# 1. Sincroniza com o upstream antes de começar
git fetch upstream
git checkout main
git merge upstream/main

# 2. Cria uma branch para a tua contribuição
git checkout -b feat/nome-da-funcionalidade
# ou
git checkout -b fix/nome-do-bug

# 3. Faz as tuas alterações e commits
git add .
git commit -m "feat: adicionar funcionalidade X"

# 4. Faz push para o teu fork
git push origin feat/nome-da-funcionalidade

# 5. Abre um Pull Request no GitHub
```

---

## Convenções de commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Alterações na documentação |
| `style:` | Formatação, espaçamento (sem alteração de lógica) |
| `refactor:` | Refatoração de código |
| `perf:` | Melhorias de performance |
| `test:` | Adição ou correção de testes |
| `chore:` | Tarefas de manutenção (deps, configs) |

**Exemplo:**
```
feat: adicionar filtro por categoria nos eventos
fix: corrigir validação do NIF no formulário de empresa
docs: atualizar guia de instalação no README
```

---

## Processo de Pull Request

1. Garante que o teu código **não quebra** funcionalidades existentes.
2. Preenche o template do PR completamente.
3. A branch `main` está protegida — todos os PRs precisam de **aprovação do maintainer** antes do merge.
4. PRs com conflitos não serão revistos até serem resolvidos.
5. Sê paciente — revisamos assim que possível. 🙏

---

## Contacto

Tens dúvidas? Abre uma [Discussion](https://github.com/mariosalembe23/annita/discussions) ou envia um email para [geral.annita@gmail.com](mailto:geral.annita@gmail.com).
