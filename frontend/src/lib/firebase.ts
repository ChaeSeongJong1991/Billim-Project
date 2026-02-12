import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjYWb6leVvREU8JKZVZvDP8gAPz7jONhQ",
    authDomain: "billim-4b5ab.firebaseapp.com",
    projectId: "billim-4b5ab",
    storageBucket: "billim-4b5ab.firebasestorage.app",
    messagingSenderId: "338041163128",
    appId: "1:338041163128:web:c5a2baf7a461416d884c8d",
    measurementId: "G-9GCE6622NH"
};

// Initialize Firebase
// 앱이 이미 초기화되었는지 확인 (Next.js Hot Reloading 대응)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics는 브라우저 환경에서만 초기화 (SSR 문제 방지)
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics };
