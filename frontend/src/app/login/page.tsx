"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 라우터
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RiKakaoTalkFill, RiGoogleFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import api from "@/lib/axios"; // 방금 만든 axios instance
import { useAuthStore } from "@/store/useAuthStore";

import { useModal } from "@/app/context/ModalContext"; // ★ Global Modal Hook

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login); // Zustand Action
  const { showAlert } = useModal(); // ★ 훅 사용

  // 유효성 검사 함수
  const validateInputs = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    // 1. 이메일 검증
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
      isValid = false;
    } else if (email.length > 50) {
      newErrors.email = "이메일은 50자 이내여야 합니다.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
      isValid = false;
    }

    // 2. 비밀번호 검증
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
      isValid = false;
    } else if (password.length > 20) {
      newErrors.password = "비밀번호는 20자 이내여야 합니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 1. 일반 로그인 (LOCAL Provider)
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 보안: 입력값 트림 처리
    const sanitizedEmail = email.trim();
    setEmail(sanitizedEmail);

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      // 백엔드 호출
      const response = await api.post("/auth/signin", {
        email: sanitizedEmail,
        password,
      });

      // HttpOnly 쿠키 방식으로 마이그레이션됨
      // 토큰은 백엔드에서 Set-Cookie로 자동 전송됨
      // 사용자 정보만 store에 저장
      login({ email: sanitizedEmail, name: "사용자", id: undefined });

      // ★ Native Alert 대체 -> Global Modal
      showAlert({
        title: "로그인 성공",
        message: "관리자 페이지로 이동합니다.",
        variant: "SUCCESS",
        onConfirm: () => router.push("/admin/dashboard") // 확인 누르면 이동
      });

    } catch (error: unknown) {
      console.error("Login Failed:", error);

      const errorMessage = (error && typeof error === 'object' && 'response' in error)
        ? (error.response as { data?: { message?: string } })?.data?.message || "이메일이나 비밀번호를 확인하세요."
        : "이메일이나 비밀번호를 확인하세요.";

      // ★ Native Alert 대체 -> Global Modal
      showAlert({
        title: "로그인 실패",
        message: errorMessage,
        variant: "DANGER"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 소셜 로그인 핸들러
  const handleSocialLogin = (provider: string) => {
    console.log(`Social Login Attempt: ${provider}`);
    // TODO: 백엔드 OAuth2 리다이렉트 URL로 이동
    // window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
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
        <CardContent className="space-y-4">

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleLocalLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="investor@billim.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                maxLength={50} // HTML 레벨 제한
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  비밀번호 찾기
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                maxLength={20} // HTML 레벨 제한
                className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-4 py-2">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-500">또는 소셜 계정으로 계속</span>
            <Separator className="flex-1" />
          </div>

          {/* 소셜 로그인 버튼 영역 */}
          <div className="grid grid-cols-1 gap-3">
            {/* 카카오 */}
            <Button
              variant="outline"
              className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-none relative h-11"
              onClick={() => handleSocialLogin("kakao")}
            >
              <RiKakaoTalkFill className="absolute left-4 w-6 h-6" />
              카카오로 시작하기
            </Button>

            {/* 네이버 */}
            <Button
              variant="outline"
              className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white border-none relative h-11"
              onClick={() => handleSocialLogin("naver")}
            >
              <SiNaver className="absolute left-4 w-4 h-4" />
              네이버로 시작하기
            </Button>

            {/* 구글 */}
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 relative h-11"
              onClick={() => handleSocialLogin("google")}
            >
              <RiGoogleFill className="absolute left-4 w-6 h-6 text-gray-600" />
              Google로 시작하기
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            계정이 없으신가요?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              이메일로 회원가입
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
