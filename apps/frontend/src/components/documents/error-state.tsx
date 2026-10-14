import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'เกิดข้อผิดพลาดในการโหลดรายการเอกสาร กรุณาลองใหม่อีกครั้ง',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Card
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center border-destructive-soft bg-destructive-soft/30',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive-soft text-destructive mb-3">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h4 className="text-base font-bold text-destructive mb-1">
        ไม่สามารถโหลดเอกสารได้
      </h4>
      <p className="text-sm text-muted-foreground max-w-md mb-5">
        {message}
      </p>

      {onRetry && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="gap-2 border-border hover:bg-card"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>ลองใหม่อีกครั้ง</span>
        </Button>
      )}
    </Card>
  );
}
