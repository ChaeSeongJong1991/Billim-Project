// app/layout.tsx
import './globals.css';
import { ModalProvider } from './context/ModalContext'; // ★ 추가됨

import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google"; // Changed font

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Added weights from HTML
});

export const metadata: Metadata = {
  title: "Billim - 임대 관리 플랫폼", // Updated title
  description: "임대인과 임차인을 위한 통합 관리 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={notoSansKr.className}>
        {/* 모달 공급자로 전체 앱을 감싸줍니다 */}
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
