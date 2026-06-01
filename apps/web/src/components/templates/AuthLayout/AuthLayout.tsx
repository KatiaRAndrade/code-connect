import type { ReactNode } from 'react'

interface AuthLayoutProps {
  banner: ReactNode
  children: ReactNode
}

export function AuthLayout({ banner, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-bg p-4">
      <div className="flex w-full max-w-3xl overflow-hidden rounded-2xl bg-surface-card shadow-2xl">
        <div className="hidden w-[300px] shrink-0 md:block">
          {banner}
        </div>
        <div className="flex flex-1 flex-col justify-center p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
