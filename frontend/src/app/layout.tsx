// app/layout.tsx
import './globals.css';
import Providers from './providers';
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
