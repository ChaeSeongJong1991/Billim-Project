"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useModal } from "@/app/context/ModalContext";

function NaverCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const { showAlert } = useModal();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      showAlert({
        title: "로그인 실패",
        message: "Naver 인증 정보가 올바르지 않습니다.",
        variant: "DANGER",
        onConfirm: () => router.push("/login"),
      });
      return;
    }

    const handleNaverCallback = async () => {
      try {
        const response = await api.post<{ accessToken: string }>("/auth/social/naver", {
          code,
          state,
        });

        const { accessToken } = response.data;
        login({ email: "", name: "네이버 사용자" }, accessToken);

        router.push("/admin/dashboard");
      } catch {
        showAlert({
          title: "Naver 로그인 실패",
          message: "네이버 로그인 중 오류가 발생했습니다.",
          variant: "DANGER",
          onConfirm: () => router.push("/login"),
        });
      }
    };

    handleNaverCallback();
  }, [searchParams, login, router, showAlert]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">네이버 로그인 처리 중...</p>
    </div>
  );
}

export default function NaverCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>로딩중...</p></div>}>
      <NaverCallbackContent />
    </Suspense>
  );
}
