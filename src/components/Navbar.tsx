"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/scenarios", label: "AI 梦之队" },
    { href: "/templates", label: "场景模板" },
    { href: "/pricing", label: "价格" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with enhanced styling */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            Agent2Go
          </span>
        </Link>

        {/* Desktop Navigation with enhanced hover effects */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full transition-all duration-200 hover:bg-accent/50 ${
                pathname === link.href
                  ? "text-foreground bg-accent/70"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {status === 'loading' ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : session?.user ? (
            <>
              <Link href="/agents/new">
                <Button size="sm" className="gap-1">
                  <span>➕</span> 创建 Agent
                </Button>
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
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

        {/* Mobile Menu Button with enhanced styling */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent/50 transition-all duration-200 active:scale-95"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu with enhanced styling */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl animate-slide-up">
          <div className="container py-6 space-y-6">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium py-3 px-4 rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? "text-foreground bg-accent/70"
                      : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons - Mobile with better spacing */}
            <div className="pt-6 border-t flex flex-col space-y-3">
              {status === 'loading' ? (
                <div className="h-11 bg-muted animate-pulse rounded-full" />
              ) : session?.user ? (
                <>
                  <Link href="/agents/new" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-11 text-base shadow-lg">
                      <span className="mr-2">➕</span> 创建 Agent
                    </Button>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-center text-sm font-medium text-muted-foreground py-3 hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {session.user.name || session.user.email?.split('@')[0]}
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-11">仪表板</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-11">登录</Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-11 shadow-lg">免费注册</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
