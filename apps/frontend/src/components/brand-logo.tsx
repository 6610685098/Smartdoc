import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function BrandLogo({ size = 'md', showSubtitle = true }: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-3">
        {/* Emblem / Seal Icon representing Thai Government Document System */}
        <div
          className={`${iconSizes[size]} flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400/30`}
          aria-hidden="true"
        >
          <svg
            className="w-3/5 h-3/5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Government seal / crest / quill motif */}
            <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25c5.25-1.1 9-6 9-11.25V7L12 2z" />
            <path d="M12 6.5v11" />
            <path d="M8 11.5l4-3.5l4 3.5" />
            <path d="M9 15.5h6" />
          </svg>
        </div>

        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className={`${titleSizes[size]} tracking-tight text-slate-900 dark:text-white`}>
              Smartdoc
            </span>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-blue-800 uppercase dark:bg-blue-900/50 dark:text-blue-300">
              สารบรรณ AI
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            ระบบงานสารบรรณและเอกสารราชการ
          </p>
        </div>
      </div>

      {showSubtitle && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ
        </p>
      )}
    </div>
  );
}
