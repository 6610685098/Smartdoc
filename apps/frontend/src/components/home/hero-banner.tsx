'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { AuthUser } from '@smartdoc/types';
import { Button } from '@/components/ui/button';
import { HeroArtwork } from './hero-artwork';

export interface HeroBannerProps {
  user: AuthUser;
}

export function HeroBanner({ user }: HeroBannerProps) {
  return (
    <section
      aria-label="แบนเนอร์ยินดีต้อนรับ"
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs"
      style={{
        backgroundImage: 'radial-gradient(#DCE5F2 1.2px, transparent 1.2px)',
        backgroundSize: '18px 18px',
        backgroundPosition: 'right top',
      }}
    >
      {/* Decorative background ring matching prototype */}
      <div
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full border-[36px] border-accent/10"
        aria-hidden="true"
      />

      <div className="relative z-1 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left column: Text & Actions */}
        <div className="flex flex-col items-start lg:col-span-7 xl:col-span-8">
          {/* Badge / Chip */}
          <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-[#066A7A]">
            Smart Back Office สำหรับงานเอกสาร
          </span>

          {/* Greeting & Headline */}
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl lg:text-4xl leading-snug">
            สวัสดี คุณ{user.fullName}
            <span className="mt-1 block text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              วันนี้อยากเริ่มประกาศเรื่องอะไร
            </span>
          </h1>

          {/* Description */}
          <p className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            บอกข้อเท็จจริงสำคัญ แล้วให้ AI ช่วยร่างเนื้อหาประกาศภาษาไทย คุณตรวจทานและแก้ไขได้เองก่อนส่งออก
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Create Announcement Button (Disabled in this phase) */}
            <div className="relative">
              <Button
                type="button"
                disabled
                aria-disabled="true"
                aria-describedby="hero-create-desc"
                title="ฟังก์ชันสร้างประกาศยังอยู่นอกขอบเขตในรอบนี้"
                className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-xs opacity-60 cursor-not-allowed hover:bg-primary"
              >
                <Plus className="h-4 w-4 mr-1 shrink-0" aria-hidden="true" />
                <span>สร้างประกาศใหม่</span>
              </Button>
              <span id="hero-create-desc" className="sr-only">
                ฟังก์ชันสร้างประกาศใหม่ยังไม่อยู่ในขอบเขตการทำงานรอบนี้
              </span>
            </div>

            {/* View My Documents Link */}
            <Link
              href="/documents"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-5 text-sm font-semibold text-accent shadow-2xs hover:bg-accent-soft hover:border-accent/40 transition-colors"
            >
              <span>ดูเอกสารของฉัน</span>
              <span aria-hidden="true" className="font-bold">↓</span>
            </Link>
          </div>

          {/* 3 Step Guide */}
          <ul
            aria-label="ขั้นตอนการทำงาน 3 ขั้นตอน"
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-muted-foreground"
          >
            <li className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-2xs"
                aria-hidden="true"
              >
                1
              </span>
              <span>เลือกเทมเพลต</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-2xs"
                aria-hidden="true"
              >
                2
              </span>
              <span>กรอกข้อมูล</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-2xs"
                aria-hidden="true"
              >
                3
              </span>
              <span>ตรวจทานและบันทึก</span>
            </li>
          </ul>
        </div>

        {/* Right column: 3D Artwork Illustration */}
        <div className="hidden lg:col-span-5 xl:col-span-4 lg:flex lg:justify-center lg:items-center">
          <HeroArtwork />
        </div>
      </div>
    </section>
  );
}
