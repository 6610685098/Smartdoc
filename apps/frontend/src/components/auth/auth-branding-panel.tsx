'use client';

import React from 'react';
import Image from 'next/image';

export function AuthBrandingPanel() {
  return (
    <>
      {/* Desktop & Tablet Left Hero Section */}
      <section
        className="relative hidden md:flex flex-col justify-between p-8 lg:p-10 overflow-hidden select-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 85% 0%, rgba(255, 255, 255, 0.85) 0%, rgba(225, 243, 253, 0.65) 45%, rgba(188, 227, 250, 0.95) 100%), linear-gradient(160deg, #eaf6fd 0%, #d4effc 50%, #b8e3fa 100%)',
        }}
      >
        {/* Background Dot Pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 155, 179, 0.3) 1.5px, transparent 1.6px)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden="true"
        />

        {/* Decorative Translucent Rings */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full border-[32px] border-white/35 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full border-[24px] border-white/20 pointer-events-none"
          aria-hidden="true"
        />

        {/* Brand Logo Text */}
        <div className="relative z-10 flex flex-col leading-none" aria-label="NCSA Smartdoc">
          <span className="text-5xl lg:text-6xl font-black tracking-tight text-[#0f2d59]">
            NCSA
          </span>
          <span className="text-3xl lg:text-4xl font-bold text-[#009bb3] -mt-1 lg:-mt-2">
            Smartdoc
          </span>
        </div>

        {/* 3D Illustration Asset */}
        <div className="relative z-10 flex justify-center items-center py-4 my-auto">
          <Image
            src="/ai-document.png"
            alt="NCSA Smartdoc AI Document"
            width={1024}
            height={1024}
            priority
            unoptimized
            className="w-56 sm:w-64 lg:w-72 h-auto object-contain select-none"
          />
        </div>

        {/* Welcome Text */}
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0f2d59] tracking-tight">
            ยินดีต้อนรับ
          </h1>
          <p className="mt-1 text-sm lg:text-base font-semibold text-[#0f2d59]">
            เข้าสู่ระบบเพื่อใช้งาน NCSA Smartdoc
          </p>
          <p className="mt-2 text-xs lg:text-sm text-[#475569]">
            Smart Back Office สำหรับงานเอกสาร
          </p>
        </div>
      </section>

      {/* Mobile Header Branding (visible only on small screens) */}
      <div
        className="md:hidden flex flex-col items-center text-center p-6 relative overflow-hidden select-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 85% 0%, rgba(255, 255, 255, 0.85) 0%, rgba(225, 243, 253, 0.65) 45%, rgba(188, 227, 250, 0.95) 100%), linear-gradient(160deg, #eaf6fd 0%, #d4effc 50%, #b8e3fa 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 155, 179, 0.3) 1.5px, transparent 1.6px)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col leading-none">
          <span className="text-4xl font-black tracking-tight text-[#0f2d59]">NCSA</span>
          <span className="text-2xl font-bold text-[#009bb3] -mt-1">Smartdoc</span>
        </div>
        <div className="relative z-10 my-3">
          <Image
            src="/ai-document.png"
            alt="NCSA Smartdoc AI Document"
            width={1024}
            height={1024}
            priority
            unoptimized
            className="w-36 h-auto object-contain select-none"
          />
        </div>
        <p className="relative z-10 text-xs font-semibold text-[#0f2d59]">
          Smart Back Office สำหรับงานเอกสาร
        </p>
      </div>
    </>
  );
}
