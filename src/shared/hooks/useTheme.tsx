import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type Theme = 'light' | 'dark'

const PAGINAS_SEMPRE_CLARAS = ['/login', '/cadastro']

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'theme'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const { pathname } = useLocation()
  const forcaClaro = PAGINAS_SEMPRE_CLARAS.includes(pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark' && !forcaClaro)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme, forcaClaro])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
