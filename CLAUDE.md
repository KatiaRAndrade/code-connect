# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`code-connect` is a pnpm monorepo with two apps:
- `apps/api` — NestJS REST API (TypeScript), runs on port 3000
- `apps/web` — React 19 + Vite frontend (TypeScript)

## Commands

All commands are run from the repo root using pnpm workspaces.

### Development

```sh
pnpm dev              # run both apps in parallel (web + api)
pnpm web:dev          # web only (Vite HMR)
pnpm api:dev          # api only (NestJS --watch)
```

### Build

```sh
pnpm web:build        # tsc + vite build
pnpm api:build        # nest build → dist/
pnpm api:start        # run compiled api (node dist/main)
```

### Lint & Format

```sh
# Web
pnpm --filter web lint

# API
pnpm --filter api lint      # eslint --fix
pnpm --filter api format    # prettier --write
```

### Tests (API)

```sh
pnpm api:test                           # all unit tests
pnpm --filter api test:watch            # watch mode
pnpm --filter api test:cov             # coverage
pnpm --filter api test:e2e             # e2e (test/jest-e2e.json)
# Run a single test file:
pnpm --filter api test -- --testPathPattern=app.controller
```

## Architecture

### API (`apps/api`)

Standard NestJS module structure:
- `AppModule` → imports controllers and providers
- `AppController` → route handlers (decorators: `@Get`, `@Post`, etc.)
- `AppService` → business logic, injected via constructor DI
- `main.ts` → bootstraps with `NestFactory.create(AppModule)`, listens on `PORT` env var (default 3000)

Add features by creating new modules (`nest generate module <name>`) and importing them in `AppModule`.

#### REST Principles

Follow these rules for every endpoint:

- **Resource-based URLs**: nouns, plural, no verbs — `/v1/users`, `/v1/users/:id/orders`.
- **HTTP verbs carry intent**: `GET` read, `POST` create, `PUT`/`PATCH` update, `DELETE` remove.
- **Correct status codes**: `200 OK`, `201 Created` (with `Location` header), `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `500 Internal Server Error`.
- **Consistent response envelope**: collections → `{ data: [...], meta: { total, page, limit } }`; single resource → `{ data: {...} }`; errors → `{ error: { code, message } }`.
- **Stateless**: no server-side session; auth via JWT/Bearer token in `Authorization` header.
- **Versioning**: prefix all routes with `/v1/` from the start.
- **Filtering, sorting, pagination** via query params: `?page=1&limit=20&sort=createdAt:desc&filter[status]=active`.

### Web (`apps/web`)

Single-page React app scaffolded with Vite:
- Entry: `src/main.tsx` → mounts `<App />` into `#root`
- `src/App.tsx` — root component
- No router yet; add `react-router-dom` if navigation is needed

#### Atomic Design

Components live under `src/components/` organized by atomic level:

```
src/components/
  atoms/        # smallest units: Button, Input, Label, Icon
  molecules/    # groups of atoms: FormField, SearchBar, Card
  organisms/    # complex sections: Header, ProductList, LoginForm
  templates/    # page layouts (no data, only structure)
src/pages/      # full pages — compose templates + organisms, fetch data
```

Rules:
- An atom must not import from molecules/organisms/templates.
- A molecule may only import atoms.
- An organism may import atoms and molecules.
- Templates are layout-only; they receive data via props and never fetch it.
- Pages are the only layer allowed to call APIs or hold global state.

#### Styling

- Use **Tailwind CSS** exclusively. Do not write custom CSS classes for layout or spacing.
- Tailwind config lives at `apps/web/tailwind.config.ts`; extend the theme there (colors, fonts, etc.) instead of hardcoding values inline.

#### Component Tests

Every component must have a co-located test file (`ComponentName.test.tsx`) covering its essential use case. Use **Vitest** + **React Testing Library**.

```
src/components/atoms/Button/
  Button.tsx
  Button.test.tsx   ← required
```

Run web tests:
```sh
pnpm --filter web test              # all tests
pnpm --filter web test Button       # single file
pnpm --filter web test:coverage     # coverage report
```

### Workspace

- `pnpm-workspace.yaml` defines `apps/*` as packages
- Filter commands with `--filter web` or `--filter api` to target a single app
- Install a dep in one app: `pnpm --filter api add <pkg>`

## Git — Conventional Commits

All commits in both apps must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

**Scopes:** use the app name or feature area — `web`, `api`, `button`, `users`, `auth`, etc.

Examples:
```
feat(web): add Button atom with primary and secondary variants
fix(api): return 404 when user is not found
test(web): add FormField molecule tests
refactor(api): extract pagination logic into shared helper
chore: update pnpm lockfile
```

Breaking changes: append `!` after the type/scope and add `BREAKING CHANGE:` in the footer.
