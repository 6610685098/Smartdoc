'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { AppShell } from '@/components/app-shell/app-shell';
import { HeroBanner, RecentAnnouncements } from '@/components/home';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user) {
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

  // Breadcrumb navigation for Home (/)
  const breadcrumbNode = (
    <nav aria-label="แถบนำทางตำแหน่ง" className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/"
        className="flex items-center gap-1.5 font-bold hover:text-primary transition-colors text-foreground"
        aria-current="page"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        <span>หน้าหลัก</span>
      </Link>
    </nav>
  );

  // Authenticated Home Dashboard
  return (
    <AppShell active="home" title="หน้าหลัก" breadcrumb={breadcrumbNode}>
      <div className="space-y-8">
        <HeroBanner user={user} />
        <RecentAnnouncements />
      </div>
    </AppShell>
  );
}
