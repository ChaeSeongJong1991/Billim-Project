import axios, { AxiosResponse, AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * 표준화된 API 응답 형식
 */
export interface ApiResponse<T = unknown> {
  code: string
  message: string
  data?: T
  errors?: Record<string, string[]>
  timestamp?: string
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HttpOnly 쿠키 자동 포함
})

/**
 * 요청 인터셉터: JWT 토큰 추가 (쿠키가 없을 경우 localStorage에서 사용)
 */
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

/**
 * 응답 인터셉터: 응답 형식 검증 및 에러 처리
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 형식 검증
    if (!response.data?.code) {
      console.error('Invalid API response format:', response.data)
      throw new Error('API 응답 형식이 올바르지 않습니다')
    }

    // 에러 코드 확인
    if (response.data.code !== '200' && response.data.code !== 'OK') {
      console.warn('API error response:', response.data)
      const error = new Error(response.data.message || 'API 요청 실패')
      throw error
    }

    return response
  },
  (error: AxiosError) => {
    // 401 Unauthorized: 로그아웃 처리
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        // 쿠키도 자동으로 제거됨 (backend에서 Set-Cookie 처리)
        window.location.href = '/login'
      }
    }

    // 403 Forbidden: 권한 없음
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data)
    }

    // 5xx 에러: 서버 에러
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response.status, error.response.data)
    }

    return Promise.reject(error)
  }
)

export default api
