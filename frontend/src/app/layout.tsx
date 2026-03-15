// app/layout.tsx
import './globals.css';
import Providers from './providers';
import Script from 'next/script';

import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Billim - 임대 관리 플랫폼",
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
        {/* Kakao JavaScript SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onLoad={() => {
            const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
            if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
              window.Kakao.init(kakaoKey);
            }
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
