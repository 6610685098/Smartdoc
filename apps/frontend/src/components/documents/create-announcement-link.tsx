import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CreateAnnouncementLink({ className }: { className?: string }) {
  return (
    <Link href="/documents/new" className={cn(buttonVariants(), className)}>
      <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>สร้างเอกสารใหม่</span>
    </Link>
  );
}
