'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { BrandLogo } from '@/components/brand-logo';
import { AppShell } from '@/components/app-shell/app-shell';
import { HeroBanner, RecentAnnouncements } from '@/components/home';
import HealthStatus from './health-status';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            กำลังตรวจสอบสิทธิ์การใช้งานระบบสารบรรณ...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show landing / login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-slate-100/50 to-blue-50/30 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <BrandLogo size="sm" showSubtitle={false} />
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition"
              >
                ลงทะเบียน
              </Link>
            </div>
          </div>
        </header>

        {/* Hero & Prompt */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Smartdoc ระบบสารบรรณและเอกสารราชการอัจฉริยะ
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              ระบบสร้าง ตรวจทาน และร่างหนังสือราชการด้วยปัญญาประดิษฐ์ (AI)
              พร้อมระบบระบุตัวตนและแยกเอกสารตามเจ้าของ (FR-ACC-01)
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary-hover transition"
              >
                เข้าสู่ระบบเพื่อใช้งาน
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-xl border border-border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-xs hover:bg-secondary transition"
              >
                สร้างบัญชีผู้ใช้งานใหม่
              </Link>
            </div>
          </div>

          <div className="mt-16 w-full max-w-xl">
            <HealthStatus />
          </div>
        </main>
      </div>
    );
  }

  // Authenticated Home Dashboard
  return (
    <AppShell active="home" title="หน้าหลัก">
      <div className="space-y-8">
        <HeroBanner user={user} />
        <RecentAnnouncements />
      </div>
    </AppShell>
  );
}
