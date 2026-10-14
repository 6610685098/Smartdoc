'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, FileText, Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AppShellProps {
  children: React.ReactNode;
  active: 'home' | 'documents';
  title?: string;
  breadcrumb?: React.ReactNode;
}

export function AppShell({
  children,
  active,
  title,
  breadcrumb,
}: AppShellProps) {
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitial = user?.fullName ? user.fullName.trim().charAt(0) : 'U';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar"
        aria-label="เมนูหลัก"
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white font-bold text-sm shadow-xs">
              N
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-base tracking-tight text-primary">
                NCSA <span className="text-accent font-bold">Smartdoc</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                ระบบสารบรรณอัจฉริยะ
              </span>
            </div>
          </Link>
        </div>

        {/* Action & Navigation */}
        <div className="flex flex-1 flex-col gap-1 p-3 overflow-y-auto">
          {/* Create Announcement Button (Disabled in this phase) */}
          <div className="mb-3 px-1">
            <Button
              type="button"
              disabled
              aria-disabled="true"
              title="ฟังก์ชันสร้างประกาศยังไม่อยู่ในขอบเขตการทำงานรอบนี้"
              className="w-full justify-start gap-2.5 bg-primary text-primary-foreground font-semibold shadow-xs opacity-60 cursor-not-allowed hover:bg-primary"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>สร้างประกาศ</span>
            </Button>
            <p className="mt-1 text-[11px] text-muted-foreground px-1 leading-tight">
              (ยังไม่เปิดให้บริการในรอบนี้)
            </p>
          </div>

          <nav className="flex flex-col gap-1" aria-label="แถบนำทาง">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                active === 'home'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-2xs'
                  : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
              )}
            >
              <Home
                className={cn('h-4 w-4 shrink-0', active === 'home' ? 'text-accent' : 'text-muted-foreground')}
                aria-hidden="true"
              />
              <span>หน้าหลัก</span>
            </Link>

            <Link
              href="/documents"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                active === 'documents'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-2xs'
                  : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
              )}
            >
              <FileText
                className={cn('h-4 w-4 shrink-0', active === 'documents' ? 'text-accent' : 'text-muted-foreground')}
                aria-hidden="true"
              />
              <span>เอกสารของฉัน</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground/80 mb-0.5">ระเบียบสารบรรณ AI</p>
          <p className="text-[11px]">AI ช่วยร่างได้ แต่ต้องตรวจทานก่อนใช้งานทุกครั้ง</p>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-xs z-10">
          {/* Breadcrumb or Title */}
          <div className="min-w-0 flex-1">
            {breadcrumb ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                {breadcrumb}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground">
                  {title ?? (active === 'home' ? 'หน้าหลัก' : 'เอกสารของฉัน')}
                </span>
              </div>
            )}
          </div>

          {/* User Account Bar & Logout */}
          <div className="flex items-center gap-4 shrink-0">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right leading-tight">
                  <span className="text-sm font-bold text-foreground">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground font-mono">{user.email}</span>
                </div>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-2xs"
                  aria-hidden="true"
                >
                  {userInitial}
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut || isLoading}
              className="gap-1.5 border-border hover:bg-destructive-soft hover:text-destructive hover:border-destructive/30 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isLoggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 min-w-0">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
