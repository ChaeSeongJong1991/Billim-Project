import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // 백엔드 주소
    headers: {
        'Content-Type': 'application/json',
    },
});

// [요청 인터셉터] 요청이 나가기 전, 토큰이 있다면 헤더에 끼워넣기
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// [응답 인터셉터] 401(인증 실패) 발생 시 로그아웃 처리 (선택 사항)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 토큰 만료 등의 이유로 401이 뜨면 강제 로그아웃 시킬 수 있음
            useAuthStore.getState().logout();
            // window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        }
        return Promise.reject(error);
    }
);

export default api;
