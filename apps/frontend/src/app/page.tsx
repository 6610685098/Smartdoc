'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { BrandLogo } from '@/components/brand-logo';
import HealthStatus from './health-status';

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
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

  const formatThaiDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-blue-700 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            กำลังตรวจสอบสิทธิ์การใช้งานระบบสารบรรณ...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show landing / login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/50 to-blue-50/30 flex flex-col">
        {/* Top bar */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <BrandLogo size="sm" showSubtitle={false} />
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition"
              >
                ลงทะเบียน
              </Link>
            </div>
          </div>
        </header>

        {/* Hero & Prompt */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-800 mb-6">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Smartdoc ระบบสารบรรณและเอกสารราชการอัจฉริยะ
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              ระบบสร้าง ตรวจทาน และร่างหนังสือราชการด้วยปัญญาประดิษฐ์ (AI)
              พร้อมระบบระบุตัวตนและแยกเอกสารตามเจ้าของ (FR-ACC-01)
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-xl bg-blue-700 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-800 transition"
              >
                เข้าสู่ระบบเพื่อใช้งาน
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
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

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Authenticated Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <BrandLogo size="sm" showSubtitle={false} />
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-slate-800">
                  {user.fullName}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    user.role === 'SYSTEM_ADMIN'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {user.role === 'SYSTEM_ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งานทั่วไป'}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{user.email}</span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-sm font-bold text-white shadow-xs">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition disabled:opacity-50"
              title="ออกจากระบบ"
            >
              {isLoggingOut ? (
                <span>กำลังออก...</span>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>ออกจากระบบ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Card & FR-ACC-01 Status */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  ยินดีต้อนรับ, {user.fullName}
                </h1>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                เข้าสู่ระบบจัดการเอกสารราชการไทยและผู้ช่วยปัญญาประดิษฐ์งานสารบรรณ
              </p>
            </div>

            {/* FR-ACC-01 Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs font-medium text-blue-900">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>
                <strong>FR-ACC-01:</strong> ระบบระบุตัวตนและแยกเอกสารตามเจ้าของ
                พร้อมใช้งาน
              </span>
            </div>
          </div>

          {/* User Account Snapshot */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-xs font-medium text-slate-500">ชื่อผู้ใช้งาน</span>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {user.fullName}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-xs font-medium text-slate-500">อีเมลในระบบ</span>
              <p className="mt-1 text-sm font-semibold text-slate-800 truncate font-mono">
                {user.email}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-xs font-medium text-slate-500">ระดับสิทธิ์ (Role)</span>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {user.role === 'SYSTEM_ADMIN' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งานทั่วไป (User)'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-xs font-medium text-slate-500">วันที่ลงทะเบียน</span>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatThaiDate(user.createdAt)}
              </p>
            </div>
          </div>
        </section>

        {/* Official Document Templates Preview */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              ประเภทเอกสารราชการตามระเบียบงานสารบรรณ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              รองรับแบบฟอร์มมาตรฐาน 15 ประเภท พร้อมระบบ Snapshot Pattern และ AI Side-Chat
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-xs transition bg-slate-50/30">
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>หนังสือภายนอก</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  หนังสือติดต่อราชการที่เป็นแบบพิธี ใช้ติดต่อระหว่างส่วนราชการ หรือส่วนราชการมีถึงบุคคลภายนอก มีตราครุฑ
                </p>
              </div>
              <span className="mt-4 text-[11px] font-medium text-slate-400">
                พร้อมเทมเพลตมาตรฐาน
              </span>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-xs transition bg-slate-50/30">
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span>บันทึกข้อความ (หนังสือภายใน)</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  หนังสือติดต่อราชการภายในกระทรวง ทบวง กรม หรือส่วนราชการเดียวกัน ไม่เป็นแบบพิธีเท่าหนังสือภายนอก
                </p>
              </div>
              <span className="mt-4 text-[11px] font-medium text-slate-400">
                พร้อมระบบตัวแปรฟอร์ม
              </span>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-xs transition bg-slate-50/30">
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>คำสั่ง / ประกาศ / ระเบียบ</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  หนังสือที่หัวหน้าส่วนราชการหรือผู้มีอำนาจสั่งการให้ปฏิบัติ สั่งการฝ่ายบริหาร หรือแถลงความชัดเจน
                </p>
              </div>
              <span className="mt-4 text-[11px] font-medium text-slate-400">
                ตรวจทานภาษาราชการด้วย AI
              </span>
            </div>
          </div>
        </section>

        {/* Backend Connectivity Status */}
        <div className="w-full">
          <HealthStatus />
        </div>
      </main>
    </div>
  );
}
