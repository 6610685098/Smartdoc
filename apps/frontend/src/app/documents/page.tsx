'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Plus } from 'lucide-react';
import type { DocumentDto } from '@smartdoc/types';
import { AppShell } from '@/components/app-shell/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/documents/page-header';
import { LoadingState } from '@/components/documents/loading-state';
import { ErrorState } from '@/components/documents/error-state';
import { EmptyState } from '@/components/documents/empty-state';
import { listDocuments, DocumentsApiError } from '@/lib/documents-api';
import { useAuth } from '@/hooks/use-auth';
import { DocumentList } from './_components/document-list';

export default function DocumentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [documents, setDocuments] = useState<DocumentDto[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Initial fetch effect with clean async lifecycle (avoids synchronous setState in effect body)
  useEffect(() => {
    if (!isAuthenticated) return;

    let ignore = false;

    listDocuments()
      .then((data) => {
        if (!ignore) {
          setDocuments(data);
          setIsLoadingDocs(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          if (err instanceof DocumentsApiError) {
            setErrorMessage(err.message);
          } else if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage('เกิดข้อผิดพลาดในการโหลดรายการเอกสาร กรุณาลองใหม่อีกครั้ง');
          }
          setIsLoadingDocs(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  // Manual retry handler (invoked by user click, outside effect)
  const handleRetry = useCallback(async () => {
    try {
      setIsLoadingDocs(true);
      setErrorMessage(null);
      const data = await listDocuments();
      setDocuments(data);
    } catch (err: unknown) {
      if (err instanceof DocumentsApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการโหลดรายการเอกสาร กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  // Combined loading indicator
  const isOverallLoading = isAuthLoading || (isLoadingDocs && !errorMessage && documents.length === 0);

  // Breadcrumb navigation back to Home (/)
  const breadcrumbNode = (
    <nav aria-label="แถบนำทางตำแหน่ง" className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/"
        className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        <span>หน้าหลัก</span>
      </Link>
      <span aria-hidden="true" className="text-muted-foreground/50">/</span>
      <span className="font-bold text-foreground" aria-current="page">
        เอกสารของฉัน
      </span>
    </nav>
  );

  return (
    <AppShell active="documents" title="เอกสารของฉัน" breadcrumb={breadcrumbNode}>
      <div className="space-y-6">
        {/* Page Header with Total Count and Accessible Disabled 'Create Announcement' button */}
        <PageHeader
          title="เอกสารของฉัน"
          description="รายการเอกสารราชการและประกาศทั้งหมดของคุณในระบบสารบรรณ"
          badge={
            isOverallLoading ? (
              <Badge variant="outline" className="text-xs animate-pulse">
                กำลังโหลด...
              </Badge>
            ) : errorMessage ? null : (
              <Badge
                variant="secondary"
                className="px-2.5 py-0.5 text-xs font-semibold"
                aria-label={`จำนวนเอกสารทั้งหมด ${documents.length} รายการ`}
              >
                {documents.length} รายการ
              </Badge>
            )
          }
          action={
            <div className="flex flex-col items-stretch sm:items-end gap-1">
              <Button
                type="button"
                disabled
                aria-disabled="true"
                aria-describedby="action-create-announcement-desc"
                className="gap-2 cursor-not-allowed opacity-60 shadow-xs"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>สร้างประกาศใหม่</span>
              </Button>
              <span
                id="action-create-announcement-desc"
                className="text-[11px] text-muted-foreground text-center sm:text-right"
              >
                (ฟังก์ชันสร้างประกาศยังไม่อยู่ในขอบเขตการทำงานรอบนี้)
              </span>
            </div>
          }
        />

        {/* Content States: Loading, Error, Empty, and Populated List */}
        {isOverallLoading ? (
          <LoadingState count={4} message="กำลังโหลดรายการเอกสารของคุณ..." />
        ) : errorMessage ? (
          <ErrorState message={errorMessage} onRetry={handleRetry} />
        ) : documents.length === 0 ? (
          <EmptyState
            title="ยังไม่มีเอกสารในระบบ"
            description="คุณยังไม่มีเอกสารราชการหรือประกาศที่สร้างไว้ เอกสารจะปรากฏที่นี่เมื่อเริ่มสร้าง"
            showCreateButton={true}
          />
        ) : (
          <DocumentList documents={documents} />
        )}
      </div>
    </AppShell>
  );
}
