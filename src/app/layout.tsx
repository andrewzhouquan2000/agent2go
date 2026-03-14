import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import CustomerServiceButton from "@/components/CustomerServiceButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent2Go - AI 员工雇佣平台",
  description: "组建您的 AI 员工团队，释放无限可能。雇佣 CEO、研究员、工程师等专业 AI 角色，完成各类任务。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <SessionProvider>
            <Sidebar />
            {children}
            <CustomerServiceButton />
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
