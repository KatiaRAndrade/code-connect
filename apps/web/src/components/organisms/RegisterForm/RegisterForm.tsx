import { useState } from 'react'
import { Button } from '../../atoms/Button'
import { Checkbox } from '../../atoms/Checkbox'
import { Divider } from '../../atoms/Divider'
import { TextLink } from '../../atoms/TextLink'
import { FormField } from '../../molecules/FormField'
import { SocialLoginGroup } from '../../molecules/SocialLoginGroup'

const SOCIAL_PROVIDERS = [
  { iconSrc: '/github.svg', alt: 'GitHub', label: 'Github' },
  { iconSrc: '/google.svg', alt: 'Google', label: 'Gmail' },
]

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ name, email, password, remember })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-foreground">Cadastro</h1>
        <p className="text-sm text-muted">Olá! Preencha seus dados.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          id="name"
          label="Nome"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
        />

        <FormField
          id="email"
          label="Email"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
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

        <Checkbox
          id="remember"
          label="Lembrar-me"
          checked={remember}
          onChange={setRemember}
        />

        <Button type="submit" rightIcon="→">
          Cadastrar
        </Button>
      </form>

      <Divider>ou entre com outras contas</Divider>

      <SocialLoginGroup providers={SOCIAL_PROVIDERS} />

      <p className="text-center text-sm text-muted">
        Já tem conta?{' '}
        <TextLink to="/login" variant="brand">
          Faça seu login!
        </TextLink>
      </p>
    </div>
  )
}
