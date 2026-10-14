'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import type { DocumentDto } from '@smartdoc/types';
import { listDocuments, DocumentsApiError } from '@/lib/documents-api';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/documents/loading-state';
import { ErrorState } from '@/components/documents/error-state';
import { EmptyState } from '@/components/documents/empty-state';

/**
 * Format timestamp into standard Thai date-time display
 * (e.g., "1 ต.ค. 2569 09:15 น.")
 */
function formatThaiDateTime(dateString?: string | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const formatted = new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
    return `${formatted} น.`;
  } catch {
    return dateString;
  }
}

export function RecentAnnouncements() {
  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await listDocuments();
        if (active) {
          setDocuments(data);
          setError(null);
        }
      } catch (err: unknown) {
        console.error('Error fetching recent announcements:', err);
        if (active) {
          if (err instanceof DocumentsApiError) {
            setError(err.message);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('เกิดข้อผิดพลาดในการโหลดรายการเอกสาร กรุณาลองใหม่อีกครั้ง');
          }
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  // Sort by updatedAt or createdAt descending
  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });
  }, [documents]);

  return (
    <section id="recent-announcements" aria-label="ประกาศล่าสุด" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          ประกาศล่าสุด
        </h2>
        {!isLoading && !error && (
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            {documents.length} รายการ
          </span>
        )}
      </div>

      {/* Content States */}
      {isLoading && (
        <LoadingState count={3} message="กำลังโหลดเอกสาร..." />
      )}

      {!isLoading && error && (
        <ErrorState message={error} onRetry={handleRetry} />
      )}

      {!isLoading && !error && sortedDocuments.length === 0 && (
        <EmptyState
          title="ยังไม่มีประกาศ"
          description="เริ่มสร้างประกาศฉบับแรกของคุณได้เลย"
          showCreateButton={true}
        />
      )}

      {!isLoading && !error && sortedDocuments.length > 0 && (
        <div className="space-y-3" role="feed" aria-label="รายการประกาศล่าสุด">
          {sortedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs transition-shadow hover:shadow-xs"
              role="article"
              aria-label={`ประกาศ: ${doc.title}`}
            >
              {/* Left: Document Icon & Details */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div
                  className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary font-bold shadow-2xs"
                  aria-hidden="true"
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h3
                    className="text-sm sm:text-base font-bold text-foreground truncate"
                    title={doc.title}
                  >
                    {doc.title || 'เอกสารไม่มีชื่อ'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-[#066A7A]">
                      {doc.documentType?.nameTh || 'ประกาศ'}
                    </span>

                    <span className="text-muted-foreground font-normal">
                      บันทึกล่าสุด {formatThaiDateTime(doc.updatedAt || doc.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Read-only disabled action button with accessible explanation */}
              <div className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  aria-disabled="true"
                  aria-describedby={`desc-open-${doc.id}`}
                  title="ฟังก์ชันเปิดเอกสารยังไม่อยู่ในขอบเขตการทำงานรอบนี้"
                  className="gap-1.5 opacity-60 cursor-not-allowed hover:bg-card text-xs font-semibold"
                >
                  <span>เปิดเอกสาร</span>
                  <span aria-hidden="true">→</span>
                </Button>
                <span id={`desc-open-${doc.id}`} className="sr-only">
                  ฟังก์ชันเปิดเอกสารยังไม่อยู่ในขอบเขตการทำงานรอบนี้
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
