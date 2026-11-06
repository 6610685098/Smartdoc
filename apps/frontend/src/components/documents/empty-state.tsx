import React from 'react';
import { FileText } from 'lucide-react';
import { CreateAnnouncementLink } from '@/components/documents/create-announcement-link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  showCreateButton?: boolean;
  className?: string;
}

export function EmptyState({
  title = 'ยังไม่มีเอกสารในระบบ',
  description = 'เอกสารของคุณจะปรากฏที่นี่เมื่อมีการสร้างเอกสารฉบับใหม่',
  showCreateButton = true,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-border/80 bg-card/60',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary mb-4 shadow-xs">
        <FileText className="h-8 w-8" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {showCreateButton && (
        <CreateAnnouncementLink />
      )}
    </Card>
  );
}
