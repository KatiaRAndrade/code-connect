import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

interface NavItemProps {
  to: string
  icon: string
  label: string
  onClick?: () => void
}

function NavItem({ to, icon, label, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1.5 px-4 py-2 rounded-md text-center text-xs transition-colors w-full ${
          isActive ? 'text-foreground' : 'text-muted hover:text-foreground-light'
        }`
      }
    >
      <span className="material-icons text-3xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/login')
  }

  return (
    <aside className="w-44 shrink-0 bg-surface-sidebar flex flex-col items-center gap-20 py-10 px-4 rounded-lg my-14 ml-8">
      <NavLink to="/feed" aria-label="Code Connect — ir para o feed">
        <img src="/favicon.svg" alt="" className="h-10 w-auto" />
      </NavLink>

      <nav className="flex flex-col items-center gap-10 w-full">
        {user && (
          <NavLink
            to="/nova-publicacao"
            className="flex w-full items-center justify-center rounded-lg border border-brand px-4 py-3 text-brand text-base transition-colors hover:bg-brand/10"
          >
            Publicar
          </NavLink>
        )}

        <div className="flex flex-col items-center gap-10 w-full">
          <NavItem to="/feed" icon="feed" label="Feed" />
          <NavItem to="/perfil" icon="account_circle" label="Perfil" />
          <NavItem to="/sobre" icon="info" label="Sobre nós" />

          {user ? (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center gap-1.5 px-4 py-2 text-muted hover:text-foreground-light transition-colors text-xs w-full"
            >
              <span className="material-icons text-3xl">logout</span>
              <span>Sair</span>
            </button>
          ) : (
            <NavItem to="/login" icon="login" label="Login" />
          )}
        </div>
      </nav>
    </aside>
  )
}
