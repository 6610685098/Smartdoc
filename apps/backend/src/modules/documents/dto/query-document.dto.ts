import { IsEnum, IsOptional, IsString } from 'class-validator';
import type { DocumentListQuery, DocumentStatus } from '@smartdoc/types';

const DOCUMENT_STATUSES: DocumentStatus[] = ['DRAFT', 'FINAL', 'ARCHIVED', 'TRASH'];

export class QueryDocumentDto implements DocumentListQuery {
  @IsOptional()
  @IsEnum(DOCUMENT_STATUSES, {
    message: 'สถานะเอกสารต้องเป็น DRAFT, FINAL, ARCHIVED หรือ TRASH',
  })
  status?: DocumentStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
