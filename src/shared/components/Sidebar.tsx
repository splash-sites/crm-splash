import { Kanban, LayoutDashboard, MessageCircle, PhoneCall, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Funil de leads', icon: Kanban, to: '/funil' },
  { label: 'Falar hoje', icon: PhoneCall, to: '/falar-hoje' },
  { label: 'Conversas', icon: MessageCircle, to: null },
] as const

const BOTTOM_NAV_ITEMS = [
  { label: 'Configurações', icon: Settings, to: '/configuracoes' },
] as const

function NavItem({
  label,
  icon: Icon,
  to,
}: {
  label: string
  icon: typeof Kanban
  to: string | null
}) {
  if (!to) {
    return (
      <span
        aria-disabled="true"
        title="Em breve"
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground/50"
      >
        <Icon className="size-4" />
        {label}
        <span className="ml-auto rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-white">
          Em breve
        </span>
      </span>
    )
  }

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-border p-3">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}
      <div className="flex-1" />
      <div className="flex flex-col gap-1 border-t border-border pt-2">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </div>
    </nav>
  )
}
