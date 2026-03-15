import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  email: string
  name: string
  id?: string
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setToken: (token: string) => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setToken: (token: string) => set({ token }),
      setUser: (user: User | null) => {
        if (user) {
          set({ user, isAuthenticated: true })
        } else {
          set({ user: null, isAuthenticated: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
