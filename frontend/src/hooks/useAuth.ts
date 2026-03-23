'use client'

import { useMutation } from '@tanstack/react-query'
import { useAuthStore, type User } from '@/store/useAuthStore'
import { api } from '@/lib/api'

export type { User }

interface LoginData {
  email: string
  password: string
}

interface SignupData {
  email: string
  password: string
  name: string
}

interface AuthResponse {
  code: string
  message: string
  data?: {
    user: User
  }
}

/**
 * useAuth: 사용자 인증 관리 훅
 *
 * HttpOnly 쿠키 방식:
 * - 로그인 시 백엔드에서 Set-Cookie 헤더로 HttpOnly JWT 토큰 전송
 * - 모든 API 요청에 자동으로 쿠키 포함 (axios withCredentials 설정)
 * - 로그아웃 시 백엔드에서 쿠키 제거 (Set-Cookie with empty value)
 */
export function useAuth() {
  const { user, login, logout: storeLogout, isLoading, setLoading } =
    useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>('/api/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      if (data.data?.user) {
        // 토큰은 HttpOnly 쿠키에 자동 저장됨
        login(data.data.user, '')
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await api.post<AuthResponse>('/api/auth/signup', data)
      return response.data
    },
    onSuccess: (data) => {
      if (data.data?.user) {
        // 토큰은 HttpOnly 쿠키에 자동 저장됨
        login(data.data.user, '')
      }
    },
    onError: (error) => {
      console.error('Signup failed:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // 백엔드에서 쿠키 제거 처리
      await api.post('/api/auth/logout')
    },
    onSuccess: () => {
      // localStorage에서 사용자 정보 제거
      storeLogout()
      // localStorage의 authToken 제거 (마이그레이션 중 호환성)
      localStorage.removeItem('authToken')
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // 에러 발생 시에도 로컬 상태 초기화
      storeLogout()
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: handleLogout,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending,
    error:
      loginMutation.error || signupMutation.error || logoutMutation.error,
  }
}
