import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/shared/hooks/useAuth'
import { RequireAuth } from '@/shared/components/RequireAuth'
import { Login } from '@/pages/Login'
import { Cadastro } from '@/pages/Cadastro'
import { Home } from '@/pages/Home'
import { FalarHoje } from '@/pages/FalarHoje'
import { Configuracoes } from '@/pages/Configuracoes'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/"
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
