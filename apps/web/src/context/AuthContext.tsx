import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { PublicUser, RegisterPayload, LoginPayload } from '../api/auth'

interface AuthState {
  user: PublicUser | null
  loading: boolean
  signIn: (payload: LoginPayload) => Promise<void>
  signUp: (payload: RegisterPayload) => Promise<PublicUser>
  signOut: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cc.token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem('cc.token'))
      .finally(() => setLoading(false))
  }, [])

  async function signIn(payload: LoginPayload) {
    const token = await authApi.login(payload)
    localStorage.setItem('cc.token', token)
    const profile = await authApi.me()
    setUser(profile)
  }

  async function signUp(payload: RegisterPayload) {
    const newUser = await authApi.register(payload)
    return newUser
  }

  function signOut() {
    localStorage.removeItem('cc.token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
