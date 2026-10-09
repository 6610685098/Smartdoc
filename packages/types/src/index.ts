// ====================================================
// ENUMS (Matching Prisma Schema & Domain Specs)
// ====================================================

export type UserRole = 'SYSTEM_ADMIN' | 'USER';

export type DocumentStatus = 'DRAFT' | 'FINAL' | 'ARCHIVED' | 'TRASH';

export type SharePermission = 'VIEWER' | 'COMMENTER' | 'EDITOR';

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export type AiActionType =
  | 'GENERAL_CHAT'
  | 'INITIAL_GENERATION'
  | 'INLINE_EXPAND'
  | 'INLINE_SHORTEN'
  | 'INLINE_REWRITE'
  | 'FORMAL_GOVERNMENT_POLISH'
  | 'GRAMMAR_CHECK';

export type AiExecutionStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export type SuggestionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// ====================================================
// AST BLOCK SPECIFICATIONS (docx-editor.dev & Gemini)
// ====================================================

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'table'
  | 'image'
  | 'list_item'
  | 'signature'
  | 'divider';

export interface BlockAttributes {
  level?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  indent?: number;
  rows?: number;
  cols?: number;
  borders?: boolean;
  [key: string]: unknown;
}

export interface TableCell {
  id: string;
  content: string;
  attributes?: BlockAttributes;
}

export interface AstBlock {
  id: string; // Persistent client-generated UUID / nanoid
  type: BlockType;
  content: string | TableCell[][];
  attributes?: BlockAttributes;
}

// ====================================================
// DYNAMIC FORM VARIABLES (Snapshot Pattern)
// ====================================================

export type VariableDataType =
  | 'STRING'
  | 'TEXT'
  | 'NUMBER'
  | 'DATE'
  | 'DATETIME'
  | 'BOOLEAN'
  | 'SELECT';

export interface VariableDefinition {
  key: string;
  label: string;
  type: VariableDataType;
  required: boolean;
  defaultValue?: string | number | boolean;
  placeholder?: string;
  options?: string[]; // For SELECT type
}

export interface DocumentVariables {
  definitions: VariableDefinition[];
  values: Record<string, string | number | boolean | null>;
}
