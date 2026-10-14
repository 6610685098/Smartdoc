import { IsArray, IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import type { AstBlock, DocumentStatus, DocumentVariables, UpdateDocumentRequest } from '@smartdoc/types';

const DOCUMENT_STATUSES: DocumentStatus[] = ['DRAFT', 'FINAL', 'ARCHIVED', 'TRASH'];

export class UpdateDocumentDto implements UpdateDocumentRequest {
  @IsOptional()
  @IsString({ message: 'ชื่อเอกสารต้องเป็นข้อความ' })
  @MaxLength(500, { message: 'ชื่อเอกสารต้องไม่เกิน 500 ตัวอักษร' })
  title?: string;

  @IsOptional()
  @IsEnum(DOCUMENT_STATUSES, {
    message: 'สถานะเอกสารต้องเป็น DRAFT, FINAL, ARCHIVED หรือ TRASH',
  })
  status?: DocumentStatus;

  @IsOptional()
  @IsArray({ message: 'เนื้อหาเอกสาร (content) ต้องเป็น Array ของ AST Blocks' })
  content?: AstBlock[];

  @IsOptional()
  @IsObject({ message: 'ตัวแปรเอกสาร (variables) ต้องเป็น Object ตามแบบแผน' })
  variables?: DocumentVariables;
}
