# Code Connect

Plataforma de conexão entre desenvolvedores. Monorepo com API REST e frontend React.

## Estrutura

```
code-connect/
├── apps/
│   ├── api/   # NestJS REST API — porta 3000
│   └── web/   # React 19 + Vite — porta 5173
└── package.json
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 8+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (banco de dados PostgreSQL)

## Instalação

```sh
pnpm install
```

## Banco de dados (PostgreSQL via Docker)

```sh
# Sobe o Postgres em segundo plano
docker compose up -d

# Verifica se o container está saudável
docker compose ps

# Popula o banco com usuários e posts de exemplo
pnpm api:seed

# Para o container
docker compose down
```

## Desenvolvimento

```sh
# 1. Suba o banco (se ainda não estiver rodando)
docker compose up -d

# 2. Roda web e API em paralelo
pnpm dev

# Ou separadamente:
pnpm web:dev   # apenas o frontend (http://localhost:5173)
pnpm api:dev   # apenas a API (http://localhost:3000)
```

## Build

```sh
pnpm web:build   # tsc + vite build
pnpm api:build   # nest build → dist/
pnpm api:start   # executa a API compilada
```

## Testes

```sh
# Frontend (Vitest + React Testing Library + jest-axe)
pnpm --filter web test
pnpm --filter web test:watch
pnpm --filter web test:coverage

# API (Jest)
pnpm api:test
pnpm --filter api test:e2e
```

### E2E (Playwright)

Pré-requisito: banco de dados rodando e populado (`docker compose up -d` + `pnpm api:seed`), e idealmente `pnpm dev` já em execução — o Playwright reaproveita o servidor ativo ou sobe um novo automaticamente.

```sh
# Roda todos os testes e2e (headless)
pnpm web:test:e2e
# equivalente a: pnpm --filter web test:e2e

# Modo UI interativo (timeline, replay, debug visual)
pnpm --filter web test:e2e:ui

# Modo headed — abre o navegador na tela
pnpm --filter web exec playwright test --headed

# Modo debug passo a passo (Playwright Inspector)
pnpm --filter web exec playwright test --debug

# Abre o relatório HTML do último run
pnpm --filter web exec playwright show-report
```

## Lint e formatação

```sh
pnpm --filter web lint
pnpm --filter api lint
pnpm --filter api format
```

---

## Frontend (`apps/web`)

React 19 + Vite + TypeScript + Tailwind CSS v4.

### Estrutura de componentes — Atomic Design

```
src/
├── components/
│   ├── atoms/        # Button, Input, Label, Checkbox, TextLink, Divider, SocialIconButton
│   ├── molecules/    # FormField, RememberMeRow, SocialLoginGroup
│   ├── organisms/    # LoginForm, RegisterForm
│   └── templates/    # AuthLayout
├── pages/            # LoginPage, RegisterPage
└── test/             # setup.ts, render.tsx
```

### Acessibilidade

O projeto segue **WCAG 2 Nível AA**. Todos os componentes possuem testes automatizados com [`jest-axe`](https://github.com/nickcolley/jest-axe), co-localizados com cada componente (`ComponentName.test.tsx`).

Implementações presentes:

- `lang="pt-BR"` no elemento `<html>`
- Títulos de página descritivos por rota via `<title>` nativo do React 19
- Landmark `<main>` no template `AuthLayout`
- Skip link "Pular para o conteúdo" acessível via teclado

### Tokens de design (Tailwind v4)

Definidos em `apps/web/src/index.css` via bloco `@theme`.

| Token | Uso |
|---|---|
| `bg-brand` | Botões primários, links ativos |
| `bg-surface-bg` | Fundo da página |
| `bg-surface-card` | Fundo de cards e painéis |
| `bg-surface-input` | Fundo de campos de formulário |
| `text-foreground` | Texto primário |
| `text-muted` | Texto secundário e placeholders |
| `border-surface-divider` | Linhas divisórias e bordas |

---

## API (`apps/api`)

NestJS 11 + TypeScript. Escuta na porta `3000` (configurável via variável de ambiente `PORT`).

### Convenções REST

- URLs baseadas em recursos, no plural: `/v1/users`, `/v1/users/:id`
- Verbos HTTP expressam intenção: `GET` / `POST` / `PUT` / `PATCH` / `DELETE`
- Envelope de resposta padrão: `{ data: {...} }` ou `{ data: [...], meta: { total, page, limit } }`
- Erros: `{ error: { code, message } }`
- Autenticação via Bearer token (`Authorization` header)
- Todas as rotas prefixadas com `/v1/`

---

## Convenção de commits

O projeto segue [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição curta>
```

**Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Escopos:** `web`, `api`, ou nome do componente/feature (`button`, `auth`, `users`…)
