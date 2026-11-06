'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import { AppShell } from '@/components/app-shell/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function NewDocumentPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" role="status">
        <p className="text-sm text-muted-foreground">กำลังตรวจสอบสิทธิ์การใช้งาน...</p>
      </div>
    );
  }

  const breadcrumb = (
    <nav aria-label="แถบนำทางตำแหน่ง" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-primary">
        <Home className="h-4 w-4" aria-hidden="true" />
        <span>หน้าหลัก</span>
      </Link>
      <span aria-hidden="true">/</span>
      <span className="font-bold text-foreground" aria-current="page">สร้างเอกสารใหม่</span>
    </nav>
  );

  return (
    <AppShell active="documents" title="สร้างเอกสารใหม่" breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-primary">สร้างเอกสารใหม่</h1>
          <ol aria-label="ขั้นตอนการสร้างเอกสาร" className="mt-5 flex items-center gap-4 text-sm">
            <li aria-current="step" className="flex items-center gap-2 font-semibold text-primary">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">1</span>
              เลือกเทมเพลต
            </li>
            <li className="flex items-center gap-4 text-muted-foreground">
              <span className="h-px w-8 bg-border sm:w-12" aria-hidden="true" />
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold">2</span>
                กรอกข้อมูล
              </span>
            </li>
          </ol>
        </header>

        <section aria-label="เทมเพลตเอกสาร">
          <Card className="grid gap-6 p-6 sm:grid-cols-[224px_1fr] sm:gap-8">
            <div
              role="img"
              aria-label="ตัวอย่างเอกสารเปล่า ยังไม่มีเนื้อหาหรือรูปแบบที่กำหนดไว้"
              className="mx-auto aspect-[210/297] w-full max-w-56 rounded-md border border-border bg-white shadow-md"
            />
            <div className="flex flex-col items-start justify-center py-1">
              <Badge variant="accent" className="rounded-md">เริ่มต้นใหม่</Badge>
              <h2 className="mt-3 text-xl font-bold text-foreground">เอกสารเปล่า</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                เริ่มต้นเอกสารฉบับใหม่จากหน้ากระดาษเปล่า แล้วจัดวางเนื้อหาในแบบของคุณ
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>ไม่มีข้อความหรือเนื้อหาที่กำหนดไว้ล่วงหน้า</li>
                <li>เหมาะสำหรับเริ่มร่างเอกสารด้วยตนเอง</li>
              </ul>
              <div className="mt-6 space-y-2">
                <Button type="button" disabled aria-describedby="blank-template-availability">
                  ใช้เทมเพลตนี้
                </Button>
                <p id="blank-template-availability" className="text-xs leading-relaxed text-muted-foreground">
                  เร็ว ๆ นี้ — การใช้งานเทมเพลตยังไม่เปิดให้บริการ
                </p>
              </div>
            </div>
          </Card>
        </section>

        <Link href="/documents" className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          กลับไปเอกสารของฉัน
        </Link>
      </div>
    </AppShell>
  );
}
