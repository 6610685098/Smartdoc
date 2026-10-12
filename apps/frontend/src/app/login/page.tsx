'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthApiError } from '@/lib/auth-api';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'กรุณากรอกอีเมล';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      }
    }

    if (!password) {
      errors.password = 'กรุณากรอกรหัสผ่าน';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: email.trim(),
        password,
      });
      // Redirect handled by auth context
    } catch (err: unknown) {
      if (err instanceof AuthApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#0f2d59] border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">กำลังตรวจสอบข้อมูลผู้ใช้งาน...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <header className="mb-6 lg:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2d59] tracking-tight">
          เข้าสู่ระบบ
        </h2>
        <p className="mt-1 text-sm text-[#64748b]">
          กรอกอีเมลและรหัสผ่านของหน่วยงาน
        </p>
      </header>

      {/* Error Message Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
        >
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-[#0f2d59]"
          >
            อีเมล
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@example.com"
              className={`block w-full h-11 lg:h-12 rounded-xl border bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-[#dce5f2] focus:border-[#009bb3] focus:ring-[#009bb3]/20'
              }`}
              disabled={isSubmitting}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-semibold text-[#0f2d59]"
          >
            รหัสผ่าน
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              className={`block w-full h-11 lg:h-12 rounded-xl border bg-white pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                fieldErrors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-[#dce5f2] focus:border-[#009bb3] focus:ring-[#009bb3]/20'
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPassword ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-11 lg:h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f2d59] px-4 text-sm sm:text-base font-semibold text-white shadow-sm transition hover:bg-[#0c2447] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2d59] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>กำลังเข้าสู่ระบบ...</span>
            </>
          ) : (
            <span>เข้าสู่ระบบ</span>
          )}
        </button>
      </form>

      {/* Demo Account Hint Box */}
      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            setEmail('demo@ncsa.go.th');
            setPassword('Demo1234');
            setFieldErrors({});
          }}
          className="w-full rounded-xl bg-[#edf2f9] px-3.5 py-2.5 text-xs text-[#475569] text-center transition-colors hover:bg-[#e2eaf5] cursor-pointer"
          title="คลิกเพื่อกรอกข้อมูลบัญชีทดลอง"
        >
          บัญชีทดลอง: <strong className="text-[#0f2d59]">demo@ncsa.go.th</strong> / <strong className="text-[#0f2d59]">Demo1234</strong>
        </button>

        {/* Register Link */}
        <div className="text-center pt-1">
          <p className="text-xs sm:text-sm text-slate-500">
            ยังไม่มีบัญชีผู้ใช้งาน?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#009bb3] hover:text-[#008296] hover:underline"
            >
              ลงทะเบียนเข้าใช้งาน
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
