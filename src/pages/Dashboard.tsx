import { AppShell } from '@/shared/components/AppShell'
import { DashboardPanel } from '@/features/dashboard/components/DashboardPanel'

export function Dashboard() {
  return (
    <AppShell>
      <DashboardPanel />
    </AppShell>
  )
}
