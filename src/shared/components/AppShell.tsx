import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/features/auth/services/authService'
import { useAuth } from '@/shared/hooks/useAuth'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'

export function AppShell({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const nome = session?.user?.user_metadata?.nome as string | undefined
  const displayName = nome || session?.user?.email || 'Usuário'
  const inicial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-svh flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border p-4">
        <span className="font-medium">Venda.ai</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
              <Avatar size="sm">
                <AvatarFallback>{inicial}</AvatarFallback>
              </Avatar>
              {displayName}
              <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
