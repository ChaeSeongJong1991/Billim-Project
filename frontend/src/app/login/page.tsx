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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const login = useAuthStore((state) => state.login); // Zustand Action

  // 1. 일반 로그인 (LOCAL Provider)
  // 1. 일반 로그인 (LOCAL Provider)
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 백엔드 호출
      const response = await api.post("/auth/signin", {
        email,
        password,
      });

      const { accessToken } = response.data;

      // Zustand Store에 저장 (User 정보는 일단 이메일로 임시 저장)
      login(accessToken, { email, name: "사용자" });

      alert("로그인 성공!");
      router.push("/dashboard"); // 대시보드로 이동
    } catch (error: any) {
      console.error("Login Failed:", error);
      alert("로그인 실패: 이메일이나 비밀번호를 확인하세요.");
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
              로그인
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
