import { Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/shared/hooks/useAuth'
import { ThemeProvider } from '@/shared/hooks/useTheme'
import { RequireAuth } from '@/shared/components/RequireAuth'
import { Login } from '@/pages/Login'
import { Cadastro } from '@/pages/Cadastro'
import { Home } from '@/pages/Home'
import { FalarHoje } from '@/pages/FalarHoje'
import { Configuracoes } from '@/pages/Configuracoes'
import { Agenda } from '@/pages/Agenda'
import { Dashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/funil"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/falar-hoje"
            element={
              <RequireAuth>
                <FalarHoje />
              </RequireAuth>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <RequireAuth>
                <Configuracoes />
              </RequireAuth>
            }
          />
          <Route
            path="/agenda"
            element={
              <RequireAuth>
                <Agenda />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
