# Plano — Página de Cadastro (`/cadastro`)

## Contexto

O app `apps/web` já tem a página de **Login** implementada em Atomic Design, com todos os
átomos e moléculas necessários e um **stub** de `RegisterPage` já roteado em `/cadastro`
(`apps/web/src/App.tsx`). Vamos implementar a página de **Cadastro** seguindo o layout do
Figma (node `155:3469`), reaproveitando ao máximo os componentes existentes — o trabalho é
essencialmente espelhar o `LoginForm` num novo organism `RegisterForm` e plugar no `RegisterPage`.

O Figma do Cadastro contém: título "Cadastro", subtítulo "Olá! Preencha seus dados.", campos
**Nome** (placeholder "Nome completo"), **Email** ("Digite seu email") e **Senha**, checkbox
"Lembrar-me" (sem link "Esqueci a senha"), botão **Cadastrar** (com seta →), divisor "ou entre
com outras contas", grupo social Github/Gmail, e rodapé "Já tem conta? **Faça seu login!**"
→ rota `/login`.

Decisão: **atualizar o token de marca para `#81FE88`** (Verde destaque do Figma), o que também
alinha o Login ao Figma.

## Componentes reaproveitados (sem alteração)

- Template `AuthLayout` — `apps/web/src/components/templates/AuthLayout/AuthLayout.tsx`
- Molécula `FormField` — `apps/web/src/components/molecules/FormField/FormField.tsx` (Nome/Email/Senha)
- Molécula `SocialLoginGroup` — `apps/web/src/components/molecules/SocialLoginGroup/SocialLoginGroup.tsx`
- Átomos `Button`, `Checkbox`, `Divider`, `TextLink` — `apps/web/src/components/atoms/*`

> Nota de reuso: **não** usar `RememberMeRow` aqui — ela força o link "Esqueci a senha" e
> `justify-between`, que não existem no Figma do Cadastro. Usar o átomo `Checkbox` direto.

## Mudanças

### 1. Atualizar token de marca — `apps/web/src/index.css`
- `--color-brand: #9BE875` → `#81FE88`
- `--color-brand-hover: #87d164` → tom levemente mais escuro (ex.: `#6fe376`). Não é referenciado
  pelos componentes auth atuais (Button usa `hover:brightness-95`), mas mantém o token coerente.

### 2. Novo organism `RegisterForm` — `apps/web/src/components/organisms/RegisterForm/`
Espelhar `LoginForm`. Arquivos: `RegisterForm.tsx`, `RegisterForm.test.tsx`, `index.ts`.

Conteúdo do `RegisterForm.tsx` (estado via `useState`, igual ao LoginForm):
- Estado: `name`, `email`, `password`, `remember`
- `<h1>Cadastro</h1>` + subtítulo "Olá! Preencha seus dados."
- 3× `FormField`: `name` (label "Nome", placeholder "Nome completo"),
  `email` (label "Email", type `text`, placeholder "Digite seu email"),
  `password` (label "Senha", type `password`, placeholder "••••••")
- `Checkbox` id="remember" label="Lembrar-me" (direto, sem RememberMeRow)
- `Button type="submit" rightIcon="→"` → "Cadastrar"
- `Divider`: "ou entre com outras contas"
- `SocialLoginGroup` com a mesma constante `SOCIAL_PROVIDERS` (Github/Gmail) do LoginForm
- Rodapé: `Já tem conta?` + `TextLink to="/login" variant="brand"` → "Faça seu login!"
- `handleSubmit`: `e.preventDefault()` + `console.log({ name, email, password, remember })`
  (mesmo padrão atual do LoginForm — sem backend ainda)

### 3. Implementar a página — `apps/web/src/pages/RegisterPage/RegisterPage.tsx`
Substituir o stub para usar `AuthLayout` + `RegisterForm`, reaproveitando o banner do login
(`/banner-login.png`, único banner em `public/` e visualmente equivalente ao Figma):

```tsx
import { AuthLayout } from '../../components/templates/AuthLayout'
import { RegisterForm } from '../../components/organisms/RegisterForm'

export function RegisterPage() {
  return (
    <AuthLayout
      banner={
        <img
          src="/banner-login.png"
          alt="Desenvolvedora trabalhando com redes de conexão ao fundo"
          className="h-full w-full object-cover"
        />
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}
```
- Garantir `apps/web/src/pages/RegisterPage/index.ts` exportando `RegisterPage`.
- Ajustar o import no `App.tsx` para `./pages/RegisterPage` (em vez de `./pages/RegisterPage/RegisterPage`),
  alinhando ao padrão usado pelo `LoginPage`.

### 4. Testes (Vitest + RTL, seguindo padrões existentes)
- `RegisterForm.test.tsx`: preenche Nome/Email/Senha, clica em "Cadastrar", espera
  `console.log` com `{ name, email, password, remember: false }` (espelha o teste do LoginForm;
  usar `MemoryRouter`).
- `apps/web/src/pages/RegisterPage/RegisterPage.test.tsx`: `renderWithRouter(<RegisterPage />)`
  e espera `heading { name: 'Cadastro' }` (helper em `apps/web/src/test/render.tsx`).

## Ajustes finos vs. Figma (cobertos pelo reuso)
- Cor de marca `#81FE88` → resolvido no token (item 1).
- Tipografia/raio/espaçamentos: herdados dos átomos existentes (consistência com o Login já
  aprovado). Sem CSS custom — só Tailwind, conforme CLAUDE.md.

## Verificação
1. `pnpm --filter web test` — todos os testes passam (incluindo os novos).
2. `pnpm --filter web lint` — sem erros.
3. `pnpm web:dev` e abrir `/cadastro`: conferir título, subtítulo, 3 campos, checkbox
   "Lembrar-me", botão "Cadastrar →", divisor, ícones Github/Gmail e o link "Faça seu login!"
   navegando para `/login`. Comparar com o screenshot do Figma.
4. Confirmar que `/login` continua íntegro com o novo verde `#81FE88`.
