const REMEMBER_KEY = 'auth-remember-me'

function activeStorage(): Storage {
  return localStorage.getItem(REMEMBER_KEY) === 'false' ? sessionStorage : localStorage
}

export function setRememberMe(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, String(remember))
}

export const authStorage = {
  getItem: (key: string) => activeStorage().getItem(key),
  setItem: (key: string, value: string) => activeStorage().setItem(key, value),
  removeItem: (key: string) => activeStorage().removeItem(key),
}
