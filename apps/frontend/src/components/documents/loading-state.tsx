import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  count?: number;
  message?: string;
  className?: string;
}

export function LoadingState({
  count = 3,
  message = 'กำลังโหลดรายการเอกสาร...',
  className,
}: LoadingStateProps) {
  return (
    <div className={cn('space-y-3', className)} role="status" aria-busy="true" aria-label={message}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>{message}</span>
      </div>

      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5 rounded-md" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-3.5 w-16 rounded-full" />
              <Skeleton className="h-3.5 w-32 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full shrink-0" />
        </Card>
      ))}
    </div>
  );
}
