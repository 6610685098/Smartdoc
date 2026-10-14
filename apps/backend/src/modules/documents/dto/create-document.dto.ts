import { IsArray, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import type { AstBlock, CreateDocumentRequest, DocumentVariables } from '@smartdoc/types';

export class CreateDocumentDto implements CreateDocumentRequest {
  @IsUUID('4', { message: 'รหัสประเภทเอกสารต้องเป็น UUID v4' })
  documentTypeId!: string;

  @IsOptional()
  @IsUUID('4', { message: 'รหัสเทมเพลตต้องเป็น UUID v4' })
  templateId?: string;

  @IsOptional()
  @IsString({ message: 'ชื่อเอกสารต้องเป็นข้อความ' })
  @MaxLength(500, { message: 'ชื่อเอกสารต้องไม่เกิน 500 ตัวอักษร' })
  title?: string;

  @IsOptional()
  @IsArray({ message: 'เนื้อหาเอกสาร (content) ต้องเป็น Array ของ AST Blocks' })
  content?: AstBlock[];

  @IsOptional()
  @IsObject({ message: 'ตัวแปรเอกสาร (variables) ต้องเป็น Object ตามแบบแผน' })
  variables?: DocumentVariables;
}
