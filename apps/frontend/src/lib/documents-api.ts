import type { DocumentDto, DocumentListQuery } from '@smartdoc/types';

export class DocumentsApiError extends Error {
  statusCode: number;
  details?: string[];

  constructor(message: string, statusCode: number = 500, details?: string[]) {
    super(message);
    this.name = 'DocumentsApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Returns the sanitized base URL for backend API calls.
 */
function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  return url.replace(/\/$/, '');
}

/**
 * Parses HTTP error payload from NestJS API and extracts a Thai error message.
 */
function parseErrorMessage(data: unknown, status: number): string {
  if (typeof data === 'object' && data !== null) {
    const errorObj = data as Record<string, unknown>;

    if (errorObj.message) {
      if (Array.isArray(errorObj.message)) {
        return errorObj.message.map((m) => String(m)).join(', ');
      }
      return String(errorObj.message);
    }

    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }
  }

  switch (status) {
    case 401:
      return 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง';
    case 403:
      return 'คุณไม่มีสิทธิ์ในการเข้าถึงเอกสารนี้';
    case 404:
      return 'ไม่พบรายการเอกสารที่ร้องขอ';
    case 500:
    default:
      return 'เกิดข้อผิดพลาดจากระบบในการโหลดเอกสาร กรุณาลองใหม่อีกครั้ง';
  }
}

/**
 * Retrieve user's document list.
 * Calls GET /documents with credentials: 'include' (cookie auth).
 */
export async function listDocuments(query?: DocumentListQuery): Promise<DocumentDto[]> {
  const baseUrl = getApiBaseUrl();
  const searchParams = new URLSearchParams();

  if (query?.status) {
    searchParams.set('status', query.status);
  }
  if (query?.search) {
    searchParams.set('search', query.search);
  }

  const queryString = searchParams.toString();
  const url = `${baseUrl}/documents${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage = parseErrorMessage(data, response.status);
      throw new DocumentsApiError(errorMessage, response.status);
    }

    return (data ?? []) as DocumentDto[];
  } catch (error) {
    if (error instanceof DocumentsApiError) {
      throw error;
    }

    throw new DocumentsApiError(
      'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือสถานะเซิร์ฟเวอร์',
      0
    );
  }
}
