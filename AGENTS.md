# AGENTS.md — Developer & AI Agent Operating Instructions

> **Notice to AI Assistants & Agents**:  
> You are working on **Smartdoc**, an AI-powered system for creating, editing, managing, and reviewing Thai official government documents (ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ).  
> Before generating backend modules, Prisma schemas, database migrations, or frontend editors, you **MUST** follow the documentation routing and golden constraints below.

---

## 1. Context Router (Read Before Coding)

Depending on your task, you are **strictly required** to read the relevant specification file before writing code:

| Your Current Task | Required Reading |
| :--- | :--- |
| **Database, Schema, Migrations, Prisma, JSONB, SQL Indexes** | [`docs/specs/data-model.md`](docs/specs/data-model.md) |
| **System Architecture, API Design, AI Chat/Inline Flow, ADRs, Security** | [`docs/specs/architecture.md`](docs/specs/architecture.md) |
| **Starting a new feature or module** | Read **BOTH** [`docs/specs/architecture.md`](docs/specs/architecture.md) and [`docs/specs/data-model.md`](docs/specs/data-model.md) |

---

## 2. Core Architectural Invariants (Golden Rules)

These invariants were established through formal architectural review. **DO NOT violate them without explicit user instruction:**

1. **Pure User-Centric Tenancy for MVP (No Organizations)**:
   * Do **NOT** create an `Organization`, `Department`, or `Tenant` table for the MVP.
   * Documents are owned directly by individual `User` accounts (`Document.userId`).
   * Collaboration is handled via `DocumentShareLink` (token-based sharing like Google Docs/Word Online).
2. **Hybrid Content Model (JSONB AST, NOT Relational Blocks)**:
   * Do **NOT** normalize document blocks into a `DocumentBlock` or `Block` table.
   * Document content is an AST block array stored directly in `Document.content` (`JSONB`).
   * Blocks have persistent, client-generated `block_id` strings (UUIDs/nanoids) that survive edits.
3. **Variable Snapshot Pattern**:
   * Form variables (e.g., `เลขที่หนังสือ`, `วันที่`, `เรื่อง`, `เรียน`) are defined in `Template.variableDefinitions`.
   * When a document is created, the variable definitions and initial values are **frozen** into `Document.variables` (`JSONB`).
   * Existing documents must **NEVER** depend dynamically on live template changes.
4. **Document Lifecycle**:
   * The lifecycle is strictly 3 states: `DRAFT` $\rightarrow$ `FINAL` $\rightarrow$ `ARCHIVED`.
   * Soft-deletion moves documents to `TRASH` by setting `deletedAt = now()` and `status = TRASH`.
   * Permanent hard-deletion cascades cleanly to versions, share links, chat sessions, and suggestions.
5. **AI Suggestions / Track Changes**:
   * AI-generated revisions targeting a specific `block_id` must use the dedicated `DocumentSuggestion` table with statuses `PENDING`, `ACCEPTED`, or `REJECTED`.
6. **AI Telemetry & Multi-Session Chat**:
   * Support multiple `AiConversation` sessions per document.
   * Individual `AiMessage` rows record `target_block_id`, `selected_text`, and telemetry (`input_tokens`, `output_tokens`, `model`, `latency_ms`).
7. **Document Export**:
   * DOCX and PDF exports are generated on-the-fly via streaming controllers. Do **NOT** create database tables or object storage buckets for exports in MVP.

---

## 3. Technology Stack & Directory Conventions

* **Primary Runtime & Package Manager**: **Bun** is strictly used across the entire workspace.
  * Always use `bun <command>` (e.g., `bun install`, `bun dev`, `bun test`, `bunx prisma`).
  * **DO NOT** use `npm`, `yarn`, or `pnpm`.
* **Workspace Architecture**: Monorepo managed via Bun Workspaces (`apps/*`, `packages/*`).

```text
optimistic-mendel/
├── AGENTS.md                 # Master Agent Instructions (This file)
├── package.json              # Bun Workspaces Root Configuration
├── docs/
│   └── specs/
│       ├── architecture.md   # ADRs, System Flows, Security Architecture
│       └── data-model.md     # ERD, Prisma Schema, Data Dictionary, JSONB Specs
├── apps/
│   ├── backend/              # NestJS Backend API (Bun)
│   │   ├── prisma/           # schema.prisma, migrations, seeds
│   │   └── src/
│   │       ├── modules/      # auth, documents, templates, ai, export
│   └── frontend/             # Next.js App Router (Bun) (split-screen docx-editor + AI chat)
└── packages/
    └── types/                # Shared TypeScript types, DTOs, AST Block definitions
```

---

## 4. Coding Standards

### Runtime & Tooling (Bun)
* All scripts and dependencies are managed through Bun. Run tests with `bun test` and Prisma migrations with `bunx prisma migrate dev`.
* Never use `npm`, `pnpm`, or `yarn`.

### Backend (NestJS & Prisma)
* **Naming**: In TypeScript use `camelCase`. In PostgreSQL use `snake_case` mapped via `@map("column_name")` and `@@map("table_names")`.
* **Primary Keys**: Always use UUID v4 with `@id @default(uuid()) @db.Uuid`.
* **Timestamps**: Always use `@db.Timestamptz` for PostgreSQL timestamp fields.
* **Validation**: Every incoming request payload must use a DTO with strict `class-validator` and `class-transformer` decorators.
* **Transactions**: Use `prisma.$transaction(...)` when accepting AI suggestions, updating block content, and recording version snapshots.

### Frontend (Next.js & Editor)
* Maintain client-side block IDs when inserting, splitting, or reordering blocks in `docx-editor.dev`.
* Send `targetBlockId` and `selectedText` in payloads to the NestJS AI endpoints.

---

## 5. Verification Checklist Before Finishing Any Task
* [ ] Did you check `docs/specs/data-model.md` for accurate table/column names?
* [ ] Did you preserve the Snapshot Pattern for document variables?
* [ ] Did you verify that no unneeded `Organization` dependencies were introduced?
* [ ] Are all foreign keys indexed with appropriate cascade behaviors?
* [ ] Is error handling and logging in place for AI Gemini API calls?
