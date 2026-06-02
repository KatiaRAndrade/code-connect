import { AuthLayout } from '../../components/templates/AuthLayout'
import { RegisterForm } from '../../components/organisms/RegisterForm'

export function RegisterPage() {
  return (
    <>
      <title>Cadastro — Code Connect</title>
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
    </>
  )
}
