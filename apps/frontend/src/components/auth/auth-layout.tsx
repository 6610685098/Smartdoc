'use client';

import React from 'react';
import { Sarabun } from 'next/font/google';
import { AuthBrandingPanel } from './auth-branding-panel';

const sarabun = Sarabun({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  display: 'swap',
});

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f0f4f9] text-[#172b4d] ${sarabun.className}`}
      style={{
        backgroundImage:
          'radial-gradient(1200px 600px at 85% -10%, rgba(200, 234, 251, 0.45), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(191, 227, 249, 0.45), transparent 60%)',
      }}
    >
      <div className="w-full max-w-4xl lg:max-w-5xl bg-white rounded-3xl border border-[#dce5f2] shadow-[0_8px_30px_rgba(18,59,122,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <AuthBrandingPanel />
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-white">
          {children}
        </section>
      </div>
    </div>
  );
}
