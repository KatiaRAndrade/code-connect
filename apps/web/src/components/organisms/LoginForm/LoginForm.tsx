import { useState } from 'react'
import { Button } from '../../atoms/Button'
import { Divider } from '../../atoms/Divider'
import { TextLink } from '../../atoms/TextLink'
import { FormField } from '../../molecules/FormField'
import { RememberMeRow } from '../../molecules/RememberMeRow'
import { SocialLoginGroup } from '../../molecules/SocialLoginGroup'

const SOCIAL_PROVIDERS = [
  { iconSrc: '/github.svg', alt: 'GitHub', label: 'Github' },
  { iconSrc: '/google.svg', alt: 'Google', label: 'Gmail' },
]

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ email, password, remember })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-foreground">Login</h1>
        <p className="text-sm text-muted">Boas-vindas! Faça seu login.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          id="email"
          label="Email ou usuário"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario123"
        />

        <FormField
          id="password"
          label="Senha"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
        />

        <RememberMeRow checked={remember} onChange={setRemember} />

        <Button type="submit" rightIcon="→">
          Login
        </Button>
      </form>

      <Divider>ou entre com outras contas</Divider>

      <SocialLoginGroup providers={SOCIAL_PROVIDERS} />

      <p className="text-center text-sm text-muted">
        Ainda não tem conta?{' '}
        <TextLink to="/cadastro" variant="brand">
          Crie seu cadastro! 📋
        </TextLink>
      </p>
    </div>
  )
}
