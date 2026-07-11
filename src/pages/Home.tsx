import { AppShell } from '@/shared/components/AppShell'
import { KanbanBoard } from '@/features/leads/components/KanbanBoard'

export function Home() {
  return (
    <AppShell>
      <KanbanBoard />
    </AppShell>
  )
}
