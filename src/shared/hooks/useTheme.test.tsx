import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, useTheme } from './useTheme'

function wrapperComPath(path = '/') {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[path]}>
        <ThemeProvider>{children}</ThemeProvider>
      </MemoryRouter>
    )
  }
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

afterEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('useTheme', () => {
  it('inicia em light quando não há preferência salva nem do sistema', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperComPath() })
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('lê o tema salvo no localStorage', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperComPath() })
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme alterna entre light e dark, atualizando classe e localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperComPath() })

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('lança erro quando usado fora do ThemeProvider', () => {
    const { result } = renderHook(() => {
      try {
        return useTheme()
      } catch (err) {
        return err
      }
    })
    expect(result.current).toBeInstanceOf(Error)
  })

  it('força modo claro na tela de login mesmo com tema dark salvo', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperComPath('/login') })
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('força modo claro na tela de cadastro mesmo com tema dark salvo', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme(), { wrapper: wrapperComPath('/cadastro') })
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
