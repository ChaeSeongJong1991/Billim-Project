import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBjYWb6leVvREU8JKZVZvDP8gAPz7jONhQ",
    authDomain: "billim-4b5ab.firebaseapp.com",
    projectId: "billim-4b5ab",
    storageBucket: "billim-4b5ab.firebasestorage.app",
    messagingSenderId: "338041163128",
    appId: "1:338041163128:web:c5a2baf7a461416d884c8d",
    measurementId: "G-9GCE6622NH"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics (브라우저 전용)
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics };
