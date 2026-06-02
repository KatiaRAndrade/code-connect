import { AuthLayout } from '../../components/templates/AuthLayout'
import { LoginForm } from '../../components/organisms/LoginForm'

export function LoginPage() {
  return (
    <>
      <title>Entrar — Code Connect</title>
      <AuthLayout
        banner={
          <img
            src="/banner-login.png"
            alt="Desenvolvedora trabalhando com redes de conexão ao fundo"
            className="h-full w-full object-cover"
          />
        }
      >
        <LoginForm />
      </AuthLayout>
    </>
  )
}
