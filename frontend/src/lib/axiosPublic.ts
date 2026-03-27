import axios from 'axios';

// 인증 없이 사용하는 공개 API용 axios 인스턴스
const publicApi = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default publicApi;
