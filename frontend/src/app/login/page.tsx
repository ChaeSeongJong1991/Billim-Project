"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiGoogleFill } from "react-icons/ri";
import publicApi from "@/lib/axiosPublic";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { useModal } from "@/app/context/ModalContext";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { showAlert, showToast } = useModal();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('expired') === 'true') {
        showToast('로그인 세션이 만료로 로그아웃되었습니다.', 'DANGER');
        // URL 파라미터 제거 (새로고침 시 중복 노출 방지)
        window.history.replaceState({}, '', '/login');
      }
    }
  }, [showToast]);

  // ── 공통: 백엔드 소셜 로그인 호출 ─────────────────────────────────────────

  const callSocialLogin = async (
    idToken: string,
    provider: "GOOGLE",
    userName: string,
    userEmail: string
  ) => {
    const response = await publicApi.post<{ accessToken: string; tokenType: string }>(
      "/auth/social",
      { idToken, provider }
    );

    const { accessToken } = response.data;
    login({ email: userEmail, name: userName }, accessToken);

    showAlert({
      title: "로그인 성공",
      message: "관리자 페이지로 이동합니다.",
      variant: "SUCCESS",
      onConfirm: () => router.push("/admin/dashboard"),
    });
  };

  // ── Google 로그인 ──────────────────────────────────────────────────────────

  const handleGoogleLogin = async () => {
    setLoadingProvider("google");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const userName = result.user.displayName ?? "사용자";
      const userEmail = result.user.email ?? "";

      await callSocialLogin(idToken, "GOOGLE", userName, userEmail);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      const code = firebaseError?.code ?? "";

      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;

      // auth/unauthorized-domain: Firebase Console에서 localhost 허용 필요
      const friendlyMessage =
        code === "auth/unauthorized-domain"
          ? "Firebase Console에서 localhost를 승인된 도메인에 추가해주세요."
          : code === "auth/popup-blocked"
          ? "팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요."
          : firebaseError?.message ?? "Google 로그인 중 오류가 발생했습니다.";

      console.error("[Google Login Error]", code, firebaseError?.message);
      showAlert({
        title: `Google 로그인 실패 (${code || "unknown"})`,
        message: friendlyMessage,
        variant: "DANGER",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Billim</CardTitle>
          <CardDescription>
            임대 관리의 시작, 빌림에 오신 것을 환영합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-center text-sm text-gray-500 pb-2">
            소셜 계정으로 간편하게 시작하세요
          </p>

          {/* 구글 */}
          <Button
            variant="outline"
            className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 relative h-11"
            onClick={handleGoogleLogin}
            disabled={loadingProvider !== null}
          >
            <RiGoogleFill className="absolute left-4 w-6 h-6 text-gray-600" />
            {loadingProvider === "google" ? "로그인 중..." : "Google로 시작하기"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
