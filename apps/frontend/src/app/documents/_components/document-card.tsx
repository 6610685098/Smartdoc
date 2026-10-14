import React from 'react';
import { Clock, Eye, FileText } from 'lucide-react';
import type { DocumentDto } from '@smartdoc/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentStatusBadge } from '@/components/documents/document-status-badge';

export interface DocumentCardProps {
  document: DocumentDto;
}

/**
 * Format ISO date string into readable Thai date/time format.
 * Example: "14 ต.ค. 2569 16:30 น."
 */
function formatThaiDateTime(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return (
      new Intl.DateTimeFormat('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date) + ' น.'
    );
  } catch {
    return dateString;
  }
}

/**
 * Read-only card component representing a single document item.
 * STRICT REQUIREMENT: Read-only presentation only — no onClick, no editor links, no open buttons.
 */
export function DocumentCard({ document }: DocumentCardProps) {
  const documentTypeName = document.documentType?.nameTh || 'ประกาศ';
  const lastUpdatedThai = formatThaiDateTime(document.updatedAt || document.createdAt);

  return (
    <Card
      tabIndex={0}
      aria-label={`เอกสาร: ${document.title || 'ไม่มีชื่อเอกสาร'} (${documentTypeName})`}
      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 border border-border bg-card transition-shadow hover:shadow-xs focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
    >
      {/* Left: Icon and Document Info */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        {/* Document Icon */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary shadow-2xs mt-0.5 sm:mt-0"
          aria-hidden="true"
        >
          <FileText className="h-5 w-5" />
        </div>

        {/* Title & Metadata */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <h2
            className="text-base font-bold text-foreground leading-snug break-words"
            title={document.title}
          >
            {document.title || 'เอกสารไม่มีชื่อ'}
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Document Type Badge */}
            <Badge
              variant="outline"
              className="bg-accent-soft text-accent border-accent/30 font-semibold"
            >
              {documentTypeName}
            </Badge>

            {/* Status Badge */}
            <DocumentStatusBadge status={document.status} />

            {/* Version Indicator */}
            {document.currentVersionNumber ? (
              <span className="text-[11px] font-mono text-muted-foreground/80 font-medium">
                v{document.currentVersionNumber}
              </span>
            ) : null}

            {/* Last Modified Date */}
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span>บันทึกล่าสุด {lastUpdatedThai}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Explicit Read-only indicator (No interactive open button or link) */}
      <div className="flex items-center justify-end shrink-0 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
        <span
          className="inline-flex items-center gap-1.5 rounded-lg bg-muted/80 px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border/60"
          aria-label="เอกสารนี้อยู่ในโหมดอ่านอย่างเดียว"
        >
          <Eye className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span>อ่านอย่างเดียว</span>
        </span>
      </div>
    </Card>
  );
}
