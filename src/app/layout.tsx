import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PRmate — 한국어 AI 코드 리뷰",
    template: "%s · PRmate",
  },
  description:
    "GitHub PR이 열리면 자동으로 한국어로 코드 리뷰 코멘트를 게시합니다. 우아한테크코스, 네이버 Hackday, 토스 Frontend Fundamentals 등 공식 공개 자료 기반 컨벤션 프리셋 내장.",
  metadataBase: new URL("https://prmate.me"),
  openGraph: {
    images: [{ url: "/og-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
