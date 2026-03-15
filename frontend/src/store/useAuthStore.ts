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
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setToken: (token: string) => void
  setUser: (user: User | null) => void
}

/**
 * AuthStore: 사용자 인증 상태 관리
 *
 * HttpOnly 쿠키 방식 마이그레이션:
 * - JWT 토큰은 백엔드에서 HttpOnly 쿠키로 전송
 * - 브라우저에서는 자동으로 쿠키에 포함됨 (axios withCredentials 설정)
 * - localStorage는 사용자 정보만 저장
 * - 새로고침 시 API 호출로 사용자 정보 재조회
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          token: 'authenticated', // 토큰은 쿠키에 저장되므로 표시용
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
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({
        // 사용자 정보만 localStorage에 저장 (토큰은 쿠키에 저장)
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
