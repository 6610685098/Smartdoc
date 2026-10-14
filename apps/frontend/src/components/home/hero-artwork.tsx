'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export function HeroArtwork() {
  return (
    <div
      className="relative h-[260px] w-full max-w-[340px] select-none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes heroFloat {
          0%, 100% {
            transform: translateX(-50%) translateY(0) rotate(-4deg);
          }
          50% {
            transform: translateX(-50%) translateY(-8px) rotate(-4deg);
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .animate-hero-float {
            animation: heroFloat 4s ease-in-out infinite;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-float {
            transform: translateX(-50%) rotate(-4deg);
          }
        }
      `}</style>

      {/* Platform glowing base (Platform 1) */}
      <div
        className="absolute bottom-2.5 left-1/2 h-14 w-56 -translate-x-1/2 rounded-[50%]"
        style={{
          background: 'radial-gradient(ellipse at center, #7fdcea 0%, #00A6BF 60%, #123B7A 100%)',
          boxShadow: '0 0 42px rgba(0, 166, 191, 0.45)',
        }}
      />

      {/* Secondary inner platform (Platform 2) */}
      <div
        className="absolute bottom-6 left-1/2 h-11 w-44 -translate-x-1/2 rounded-[50%] bg-[#EAF6FA]"
      />

      {/* Floating 3D Document Sheet */}
      <div
        className="animate-hero-float absolute bottom-12 left-1/2 h-44 w-36 -translate-x-1/2 rounded-xl border border-border bg-white p-4 shadow-[0_14px_34px_rgba(18,59,122,0.22)]"
      >
        {/* AI Shield / Badge */}
        <div className="absolute -left-3.5 -top-3.5 flex items-center justify-center rounded-tl-xl rounded-tr-md rounded-br-2xl rounded-bl-2xl bg-gradient-to-br from-primary to-accent px-2.5 py-1 text-xs font-black text-white shadow-md">
          AI
        </div>

        {/* Text line representations */}
        <div className="mt-3 space-y-2.5">
          <div className="h-1.5 w-full rounded-full bg-[#C9D8EE]" />
          <div className="h-1.5 w-full rounded-full bg-[#C9D8EE]" />
          <div className="h-1.5 w-3/5 rounded-full bg-[#C9D8EE]" />
          <div className="h-1.5 w-5/6 rounded-full bg-[#C9D8EE]" />
          <div className="h-1.5 w-2/3 rounded-full bg-[#C9D8EE]" />
        </div>
      </div>

      {/* Floating Badge 1 (Top right: ✓ ตรวจทานแล้ว) */}
      <div className="absolute right-1 top-8 flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-[0_6px_18px_rgba(18,59,122,0.12)]">
        <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" aria-hidden="true" />
        <span>ตรวจทานแล้ว</span>
      </div>

      {/* Floating Badge 2 (Bottom left: ✨ ร่างด้วย AI) */}
      <div className="absolute left-1 bottom-16 flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-[0_6px_18px_rgba(18,59,122,0.12)]">
        <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" aria-hidden="true" />
        <span>ร่างด้วย AI</span>
      </div>
    </div>
  );
}
