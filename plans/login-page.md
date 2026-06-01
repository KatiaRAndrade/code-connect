# Plano — Página de Login (code-connect)

## Contexto

O `apps/web` é um projeto Vite + React 19 recém-inicializado. Hoje ele só tem o boilerplate do template Vite (`App.tsx` com contador) e **não possui** Tailwind, Vitest, react-router, nem a pasta `src/components/`. O `CLAUDE.md` exige Tailwind exclusivo, Atomic Design e testes co-localizados com Vitest + RTL.

A meta é entregar a tela de Login fiel ao mock fornecido (card central com banner à esquerda + formulário à direita, fundo escuro), preparando a base do app para reutilização imediata na futura página de Cadastro (mesmo layout, banner e campos diferentes).

**Decisões já alinhadas com a usuária:**
- Submit do form: apenas `console.log` (sem API).
- Routing: instalar `react-router-dom` agora (`/login` e `/cadastro` placeholder).
- Ornamentos de fundo (correntes/elos): pular nesta iteração.
- Tailwind: **v4** (CSS-first, sem `tailwind.config.ts`).

---

## 1. Setup de infraestrutura (uma vez)

### 1.1 Tailwind v4 (CSS-first)
Instalar em `apps/web` como dev deps: `tailwindcss@^4` e `@tailwindcss/vite`. **Não precisa** de `postcss`, `autoprefixer` nem `tailwind.config.ts` — v4 é configurado em CSS via diretiva `@theme`.

- Adicionar o plugin em [apps/web/vite.config.ts](apps/web/vite.config.ts):
  ```ts
  import tailwindcss from '@tailwindcss/vite'
  export default defineConfig({ plugins: [react(), tailwindcss()] })
  ```
- Reescrever [apps/web/src/index.css](apps/web/src/index.css):
  ```css
  @import "tailwindcss";

  @theme {
    --color-brand: #9BE875;          /* verde do botão/links — ajustar do mock */
    --color-brand-hover: #87d164;
    --color-surface-bg: #0F1217;     /* fundo da página */
    --color-surface-card: #1A1D24;   /* card */
    --color-surface-input: #2B2F38;  /* input */
    --color-surface-divider: #3A3F4A;
    --color-foreground: #FFFFFF;
    --color-muted: #B8BCC4;
    --font-sans: 'Inter', system-ui, sans-serif;
  }

  @layer base {
    body { @apply bg-surface-bg text-foreground font-sans; }
  }
  ```
  Os tokens definidos em `@theme` viram automaticamente classes utilitárias (`bg-surface-bg`, `text-brand`, `font-sans` etc.) — esse é o padrão idiomático em v4. As cores serão refinadas com base nas amostras do mock durante a implementação.

- Deletar [apps/web/src/App.css](apps/web/src/App.css) (não é usado pela nova `App`).

> **Nota sobre o CLAUDE.md**: o documento atual menciona `apps/web/tailwind.config.ts` (sintaxe v3). Em v4 o tema vive em CSS via `@theme`. Quando a implementação estiver pronta, vale propor atualizar o trecho do CLAUDE.md para refletir o novo padrão.

### 1.2 Vitest + React Testing Library
Instalar: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@types/node`.

- Adicionar bloco `test` em [apps/web/vite.config.ts](apps/web/vite.config.ts) (`environment: 'jsdom'`, `globals: true`, `setupFiles: './src/test/setup.ts'`).
- Criar [apps/web/src/test/setup.ts](apps/web/src/test/setup.ts) com `import '@testing-library/jest-dom'`.
- Em [apps/web/package.json](apps/web/package.json) adicionar scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`. Isso satisfaz os comandos documentados no `CLAUDE.md` (`pnpm --filter web test`).
- Adicionar `"types": ["vitest/globals", "@testing-library/jest-dom"]` em `tsconfig.app.json` (ou `tsconfig.json` apropriado) para tipagem.

### 1.3 React Router
Instalar `react-router-dom`. Atualizar [apps/web/src/main.tsx](apps/web/src/main.tsx) para envolver `<App />` com `<BrowserRouter>`.

---

## 2. Estrutura de pastas (Atomic Design)

```
apps/web/src/
├── components/
│   ├── atoms/
│   │   ├── Button/{Button.tsx, Button.test.tsx, index.ts}
│   │   ├── Input/{Input.tsx, Input.test.tsx, index.ts}
│   │   ├── Label/{Label.tsx, Label.test.tsx, index.ts}
│   │   ├── Checkbox/{Checkbox.tsx, Checkbox.test.tsx, index.ts}
│   │   ├── TextLink/{TextLink.tsx, TextLink.test.tsx, index.ts}
│   │   ├── Divider/{Divider.tsx, Divider.test.tsx, index.ts}
│   │   └── SocialIconButton/{SocialIconButton.tsx, SocialIconButton.test.tsx, index.ts}
│   ├── molecules/
│   │   ├── FormField/{FormField.tsx, FormField.test.tsx, index.ts}
│   │   ├── RememberMeRow/{RememberMeRow.tsx, RememberMeRow.test.tsx, index.ts}
│   │   └── SocialLoginGroup/{SocialLoginGroup.tsx, SocialLoginGroup.test.tsx, index.ts}
│   ├── organisms/
│   │   └── LoginForm/{LoginForm.tsx, LoginForm.test.tsx, index.ts}
│   └── templates/
│       └── AuthLayout/{AuthLayout.tsx, AuthLayout.test.tsx, index.ts}
├── pages/
│   ├── LoginPage/{LoginPage.tsx, LoginPage.test.tsx, index.ts}
│   └── RegisterPage/RegisterPage.tsx   ← placeholder "em construção"
└── App.tsx   ← define <Routes>
```

### Especificação resumida de cada componente

**Atoms**
- **Button**: `props { variant?: 'primary'; type?; children; onClick?; rightIcon? }`. Estilo `bg-brand text-black font-semibold rounded-md py-3 px-4 w-full hover:brightness-95`. Renderiza `children` + `rightIcon` (ex.: seta) à direita.
- **Input**: `props { id; type?; name?; value; onChange; placeholder?; ariaLabel? }`. Estilo `bg-surface-input text-foreground rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand/40`.
- **Label**: simples `<label htmlFor>` com `text-sm text-foreground mb-1 block`.
- **Checkbox**: `props { id; checked; onChange; label }`. Um `<input type="checkbox">` estilizado + label inline (`accent-brand`).
- **TextLink**: `props { to?; href?; children; variant?: 'muted'|'brand'; rightIcon? }`. Se `to` usa `react-router-dom` `<Link>`; senão `<a>`. `variant="brand"` → `text-brand font-medium`; `muted` → `text-foreground underline`.
- **Divider**: `props { children? }`. Renderiza linha + texto centralizado entre dois `<hr>` quando há `children`.
- **SocialIconButton**: `props { iconSrc; alt; label; onClick? }`. `<button>` com `<img>` redonda + `<span>` label embaixo.

**Molecules**
- **FormField**: `props { id; label; type?; value; onChange; placeholder?; name? }`. Compõe `Label` + `Input` em `flex flex-col gap-1`.
- **RememberMeRow**: `props { checked; onChange; forgotHref? }`. `Checkbox` à esquerda + `TextLink` "Esqueci a senha" à direita, em `flex justify-between items-center`.
- **SocialLoginGroup**: `props { providers: { iconSrc; alt; label; onClick? }[] }`. Lista de `SocialIconButton` em `flex justify-center gap-8`.

**Organisms**
- **LoginForm**: contém todo o lado direito do card — 2 `FormField` (email/usuário, senha), `RememberMeRow`, `Button` ("Login →"), `Divider` ("ou entre com outras contas"), `SocialLoginGroup` (GitHub + Google), e um rodapé com texto "Ainda não tem conta?" + `TextLink` "Crie seu cadastro! 📋" (`to="/cadastro"`, variante brand). Mantém estado local (`useState`) para email, senha e remember. `onSubmit` → `console.log`.

**Templates**
- **AuthLayout**: `props { banner: ReactNode; children: ReactNode }`. Container `min-h-screen flex items-center justify-center bg-surface-bg p-4`, com card `bg-surface-card rounded-2xl p-6 flex gap-8 max-w-4xl w-full`. Coluna esquerda renderiza `banner`; coluna direita renderiza `children`. Esta separação é o ponto-chave de reuso: a futura `RegisterPage` usa o **mesmo** `AuthLayout` passando outro banner + `RegisterForm`.

**Pages**
- **LoginPage**: `<AuthLayout banner={<img src="/banner-login.png" alt="..." className="rounded-xl object-cover h-full" />}><LoginForm /></AuthLayout>`.
- **RegisterPage**: placeholder com `<AuthLayout banner={<div />}><p>Em breve</p></AuthLayout>` só para validar a rota; será substituído quando construirmos o cadastro.

### Rotas em `App.tsx`
```tsx
<Routes>
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/cadastro" element={<RegisterPage />} />
</Routes>
```

---

## 3. Testes (essencial por componente)

Para cumprir o `CLAUDE.md` ("Every component must have a co-located test file covering its essential use case"), cada arquivo `*.test.tsx` deve ter **um teste essencial** focado no comportamento principal:

- Atoms: render do conteúdo + reação ao evento principal (ex.: `Button` chama `onClick`; `Input` propaga `onChange`; `Checkbox` alterna; `TextLink` usa `to`/`href`).
- Molecules: render dos sub-componentes esperados (ex.: `FormField` renderiza label associada ao input por `htmlFor`).
- Organisms: `LoginForm` — digitar email/senha, clicar em Login e verificar `console.log` (mockando `console.log` com `vi.spyOn`).
- Template: `AuthLayout` renderiza `banner` e `children` slots.
- Page: `LoginPage` renderiza heading "Login" (smoke test envolto em `MemoryRouter`).

Helper opcional: `src/test/render.tsx` exportando um `renderWithRouter` que envolve em `<MemoryRouter>` para reuso nos testes que precisam de routing.

---

## 4. Verificação end-to-end

1. `pnpm install` na raiz após adicionar dependências em `apps/web/package.json`.
2. `pnpm web:dev` → abrir `http://localhost:5173/login` → confirmar visualmente:
   - Card centralizado, fundo escuro.
   - Banner à esquerda exibindo `banner-login.png`.
   - Formulário à direita com título "Login", subtítulo, dois campos, "Lembrar-me" + "Esqueci a senha", botão verde "Login →", divisor "ou entre com outras contas", ícones GitHub/Google, rodapé "Ainda não tem conta? Crie seu cadastro!".
   - Digitar nos campos atualiza estado; clicar em Login imprime `{ email, password, remember }` no console.
   - Clicar em "Crie seu cadastro!" navega para `/cadastro` (placeholder).
3. `pnpm --filter web lint` → sem erros.
4. `pnpm --filter web test` → todos os testes verdes.
5. `pnpm web:build` → build de produção sem erros TS.

---

## 5. O que NÃO faz parte desta entrega (escopo deferido)
- Ornamentos de fundo (correntes/elos cinza).
- Validação de campos e mensagens de erro.
- Integração com API NestJS (`/v1/auth/login`).
- Implementação da página de Cadastro em si — apenas placeholder de rota; a estrutura (`AuthLayout`, atoms, molecules) já estará pronta para reuso quando construirmos.
