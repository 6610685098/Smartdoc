import React from 'react';
import type { DocumentStatus } from '@smartdoc/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; variant: 'default' | 'secondary' | 'accent' | 'destructive' | 'success' | 'warning' | 'outline' }
> = {
  DRAFT: {
    label: 'ฉบับร่าง',
    variant: 'warning',
  },
  FINAL: {
    label: 'ฉบับจริง',
    variant: 'success',
  },
  ARCHIVED: {
    label: 'จัดเก็บแล้ว',
    variant: 'secondary',
  },
  TRASH: {
    label: 'ถังขยะ',
    variant: 'destructive',
  },
};

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    variant: 'outline',
  };

  return (
    <Badge variant={config.variant} className={cn('text-xs font-medium', className)}>
      {config.label}
    </Badge>
  );
}
