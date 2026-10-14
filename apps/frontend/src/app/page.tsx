'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
