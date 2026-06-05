import { useState } from 'react'
import { Button } from '../../atoms/Button'
import { Divider } from '../../atoms/Divider'
import { TextLink } from '../../atoms/TextLink'
import { FormField } from '../../molecules/FormField'
import { RememberMeRow } from '../../molecules/RememberMeRow'
import { SocialLoginGroup } from '../../molecules/SocialLoginGroup'
import { useAuth } from '../../../context/AuthContext'
import { getErrorMessage } from '../../../api/client'

const SOCIAL_PROVIDERS = [
  { iconSrc: '/github.svg', alt: 'GitHub', label: 'Github' },
  { iconSrc: '/google.svg', alt: 'Google', label: 'Gmail' },
]

export function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)
    try {
      await signIn({ email, password })
      setSuccess(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
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

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-brand">
            Login realizado com sucesso!
          </p>
        )}

        <Button type="submit" disabled={submitting} rightIcon={submitting ? undefined : '→'}>
          {submitting ? 'Entrando...' : 'Login'}
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
