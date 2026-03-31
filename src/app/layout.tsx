import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESG 수준진단 Tool",
  description: "중소기업중앙회 ESG 수준진단 Tool 웹 버전",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
