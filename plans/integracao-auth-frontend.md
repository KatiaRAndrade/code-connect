# Integração do frontend (web) com a API de autenticação

## Contexto

O backend `apps/api` (NestJS, porta 3000) já expõe Swagger (`/docs`) e os endpoints de
autenticação sob o prefixo `v1/auth`. O frontend `apps/web` (React 19 + Vite) já tem as telas
de Login e Cadastro prontas (`LoginForm`, `RegisterForm`), mas os `handleSubmit` apenas fazem
`console.log` — nenhuma chamada HTTP, nenhum cliente HTTP instalado, nenhuma camada de serviço.

O objetivo é conectar os formulários ao backend usando **axios**: enviar registro/login,
guardar o `access_token`, expor o usuário autenticado via um `AuthContext`, e dar feedback de
loading/erro nos formulários.

### Endpoints da API (confirmados)

- `POST /v1/auth/register` → body `{ name, email, password }` → `201 { data: { id, name, email } }`; `409` se email já existe.
- `POST /v1/auth/login` → body `{ email, password }` → `200 { data: { access_token } }`; `401` se inválido.
- `GET /v1/auth/me` → header `Authorization: Bearer <token>` → `200 { data: { id, name, email } }`; `401` sem token.

### Decisões

- **Conexão dev:** proxy do Vite (sem mexer no backend, sem CORS).
- **Token:** `localStorage` + `AuthContext` (estado global do usuário via `/v1/auth/me`).
- **Pós-login:** sem redirect — apenas mensagem de sucesso/erro nos formulários.

## Implementação

### 1. Instalar axios no web
- `pnpm --filter web add axios`

### 2. Proxy do Vite → backend
Arquivo: `apps/web/vite.config.ts`. Adicionar `server.proxy` encaminhando `/v1` para
`http://localhost:3000` (com `changeOrigin: true`). Assim o axios usa caminho relativo `/v1` e
o navegador não vê cross-origin em dev.

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/v1': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  test: { /* ...inalterado... */ },
})
```

### 3. Cliente axios + tipos — `apps/web/src/api/`
Criar `apps/web/src/api/client.ts`:
- `axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/v1' })`.
- **Interceptor de request**: lê o token de `localStorage` (chave `cc.token`) e injeta
  `Authorization: Bearer <token>` quando presente.
- Exportar um helper `getErrorMessage(error)` que extrai `error.response.data.message`
  (mensagens do Nest, ex.: "Email já cadastrado", "Credenciais inválidas") com fallback genérico.

Criar `apps/web/src/api/auth.ts` (camada de serviço — única responsável por chamar a API,
respeitando a regra de Atomic Design de que só páginas/estado global tocam a API):
- `register({ name, email, password })` → `POST /auth/register`, retorna `data.data`.
- `login({ email, password })` → `POST /auth/login`, retorna `data.data.access_token`.
- `me()` → `GET /auth/me`, retorna `data.data`.
- Tipos: `PublicUser { id: number; name: string; email: string }`, `RegisterPayload`, `LoginPayload`.

Criar `apps/web/src/vite-env.d.ts` (se não existir) declarando `VITE_API_URL` em
`ImportMetaEnv` para tipagem. Adicionar `apps/web/.env.example` documentando `VITE_API_URL` (opcional; default `/v1`).

### 4. AuthContext — `apps/web/src/context/AuthContext.tsx`
- Estado: `user: PublicUser | null`, `token: string | null`, `loading: boolean`.
- Inicialização: ao montar, se houver token no `localStorage`, chama `auth.me()` para hidratar
  `user` (e limpa o token se a chamada falhar com 401).
- Métodos expostos via hook `useAuth()`:
  - `signIn(payload)`: chama `auth.login`, salva token no `localStorage` + estado, chama `me()` para popular `user`.
  - `signUp(payload)`: chama `auth.register` (mantém simples: apenas registra e retorna o usuário).
  - `signOut()`: limpa token do `localStorage` e zera estado.
- Envolver `<App />` com `<AuthProvider>` em `apps/web/src/main.tsx`.

### 5. Ligar os formulários
`apps/web/src/components/organisms/LoginForm/LoginForm.tsx`:
- Trocar `console.log` por `await signIn({ email, password })` do `useAuth()`.
- Adicionar estados locais `submitting` e `error`; desabilitar o `Button` (`disabled={submitting}`)
  e trocar o texto para "Entrando..." durante a chamada.
- Em sucesso: limpar erro e mostrar mensagem de sucesso (sem redirect). Em falha: setar `error`
  com `getErrorMessage`.
- Renderizar o erro num `<p role="alert" className="text-sm text-red-400">` (acessível — os testes usam jest-axe).
- O campo continua "Email ou usuário" mas o valor é enviado como `email` (backend exige email).

`apps/web/src/components/organisms/RegisterForm/RegisterForm.tsx`:
- Mesmo padrão com `await signUp({ name, email, password })`, estados `submitting`/`error`,
  botão "Cadastrando...", mensagem de sucesso/erro com `role="alert"`.

> Observação: hoje os organisms são chamados sem props pelas páginas. Como a decisão foi
> **sem redirect**, os organisms podem consumir `useAuth()` diretamente (consistente com o
> `AuthProvider` no topo). Mantém as páginas inalteradas.

### 6. Testes (Vitest + RTL)
Os testes atuais de `LoginForm`/`RegisterForm` afirmam que `console.log` é chamado — vão quebrar.
Atualizar:
- Mockar a camada `src/api/auth.ts` (`vi.mock`) e renderizar dentro do `AuthProvider` (estender
  o helper `src/test/render.tsx` ou envolver manualmente).
- Casos: submit chama `auth.login`/`auth.register` com o payload correto; estado de loading
  desabilita o botão; mensagem de erro aparece quando a promise rejeita; checagem jest-axe mantida.
- Co-locar um teste novo para `src/api/auth.ts` mockando o axios client se viável.

## Arquivos

**Novos:**
- `apps/web/src/api/client.ts`
- `apps/web/src/api/auth.ts`
- `apps/web/src/context/AuthContext.tsx`
- `apps/web/src/vite-env.d.ts` (se ausente), `apps/web/.env.example`

**Modificados:**
- `apps/web/package.json` (axios) e `pnpm-lock.yaml`
- `apps/web/vite.config.ts` (proxy)
- `apps/web/src/main.tsx` (AuthProvider)
- `apps/web/src/components/organisms/LoginForm/LoginForm.tsx` + `.test.tsx`
- `apps/web/src/components/organisms/RegisterForm/RegisterForm.tsx` + `.test.tsx`

**Backend:** nenhuma alteração (proxy resolve o CORS em dev).

## Verificação

1. `pnpm --filter web add axios` e instalar dependências.
2. Subir os dois apps: `pnpm dev` (api na 3000, web na 5173).
3. **Cadastro:** abrir `/cadastro`, preencher nome/email/senha (senha ≥ 6) e enviar → ver
   mensagem de sucesso; reenviar o mesmo email → ver "Email já cadastrado".
4. **Login:** em `/login`, usar as credenciais criadas → sucesso e `cc.token` salvo no
   `localStorage` (DevTools → Application). Credenciais erradas → "Credenciais inválidas".
5. Confirmar no DevTools → Network que as requisições vão para `/v1/auth/*` (via proxy) e que,
   após login, requisições autenticadas levam o header `Authorization: Bearer ...`.
6. Recarregar a página com token salvo → `AuthContext` hidrata o usuário via `/v1/auth/me`.
7. `pnpm --filter web test` → todos os testes passam (incluindo jest-axe).
8. Conferir o Swagger em `http://localhost:3000/docs` se precisar inspecionar contratos.
