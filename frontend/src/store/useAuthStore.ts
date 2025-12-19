import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    email: string;
    name: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

// persist 미들웨어를 사용하여 새로고침해도 로그인이 풀리지 않게 합니다 (LocalStorage 저장)
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => set({ token: null, user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage', // LocalStorage Key 이름
        }
    )
);
