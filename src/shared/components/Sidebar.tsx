import { CalendarDays, Kanban, MessageCircle, PhoneCall, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Funil de leads', icon: Kanban, to: '/' },
  { label: 'Falar hoje', icon: PhoneCall, to: '/falar-hoje' },
  { label: 'Agenda de visitas', icon: CalendarDays, to: null },
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
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-border p-3">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}
      <div className="flex-1" />
      {BOTTOM_NAV_ITEMS.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}
    </nav>
  )
}
