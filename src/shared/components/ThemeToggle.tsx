import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Sun
        className={`absolute size-4 transition-all duration-300 ${
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute size-4 transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      />
    </button>
  )
}
