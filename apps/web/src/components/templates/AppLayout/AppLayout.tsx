import type { ReactNode } from 'react'
import { Sidebar } from '../../organisms/Sidebar/Sidebar'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface-bg">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-y-auto py-14 px-8">
        {children}
      </main>
    </div>
  )
}
