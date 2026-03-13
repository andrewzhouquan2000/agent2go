"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/templates", label: "场景模板" },
    { href: "/pricing", label: "价格" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">Agent2Go</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {status === 'loading' ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : session?.user ? (
            <>
              <Link
                href="/agents/new"
                className="hidden sm:inline-flex"
              >
                <Button size="sm" className="gap-1">
                  <span>➕</span> 创建 Agent
                </Button>
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground mr-2 sm:mr-4"
              >
                {session.user.name || session.user.email?.split('@')[0]}
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">仪表板</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">登录</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">免费注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
