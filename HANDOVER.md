# Smartdoc — Developer Handover & Context Document

> **สำหรับ AI Agent บนเครื่องใหม่**: กรุณาอ่านเอกสารนี้และ [`AGENTS.md`](./AGENTS.md) ให้ละเอียดก่อนเริ่มงานต่อ

---

## 📌 1. บริบทโปรเจกต์ & สิ่งที่ทำเสร็จแล้ว (Current State)

* **โปรเจกต์**: **Smartdoc** — ระบบสร้างและจัดการเอกสารราชการไทยอัจฉริยะ (ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ)
* **การ์ด Trello ปัจจุบัน**: `[FR-ACC-01] ระบบระบุตัวตนและแยกเอกสารตามเจ้าของ` (Board: Smartdoc | List: MVP | Priority: Must-Have)
* **Architecture Rules (ต้องยึดถืออย่างเคร่งครัดตาม `AGENTS.md`)**:
  * ใช้ **Bun** เท่านั้น (`bun install`, `bun dev`, `bun test`, `bun run prisma ...`) **ห้ามใช้ npm/yarn/pnpm**
  * User-Centric Multi-Tenancy (ไม่มีตาราง Organization/Department ใน MVP)
  * ใช้ **PostgreSQL (Local Docker Compose)** ร่วมกับ Prisma 7
  * Session จัดการผ่าน **HTTP-Only Cookie (`smartdoc_token`)** ห้ามเก็บใน LocalStorage
  * CORS ระหว่าง Backend (Port 3001) และ Frontend (Port 3000) เปิด `credentials: true`

### สิ่งที่ทำเสร็จแล้วบน Branch `main`:
1. **Database & Infrastructure**:
   * มี [`docker-compose.yml`](./docker-compose.yml) สำหรับ PostgreSQL 16 (Port 5432, DB: `smartdoc`, User: `postgres`, Pass: `postgrespassword`)
   * Prisma schema ใน [`apps/backend/prisma/schema.prisma`](./apps/backend/prisma/schema.prisma) พร้อมโมเดล `User`, `DocumentType`, `Template`, `Document` ฯลฯ ตรงตาม [`docs/specs/data-model.md`](./docs/specs/data-model.md)
   * รัน Migration `init_auth_and_documents` เข้า DB เรียบร้อย
2. **Backend (NestJS @ Port 3001)**:
   * `AuthModule` ใน [`apps/backend/src/modules/auth/`](./apps/backend/src/modules/auth/) รองรับ:
     * `POST /api/auth/register` (hash รหัสผ่านด้วย bcrypt + Set Cookie `smartdoc_token`)
     * `POST /api/auth/login` (ตรวจสอบ bcrypt + Set Cookie `smartdoc_token`)
     * `POST /api/auth/logout` (เคลียร์ Cookie)
     * `GET /api/auth/me` (ป้องกันด้วย `JwtAuthGuard`, ดึง User ผ่าน `@CurrentUser()`)
   * ติดตั้ง `cookie-parser` และ Global `ValidationPipe` ใน `main.ts`
   * Unit tests ใน backend ผ่าน 100% (11 tests passed)
3. **Frontend (Next.js App Router @ Port 3000)**:
   * Shared Types เชื่อมโยงกับ [`packages/types/`](./packages/types/)
   * API Client ใน [`apps/frontend/src/lib/auth-api.ts`](./apps/frontend/src/lib/auth-api.ts) รองรับ `credentials: 'include'`
   * `AuthProvider` และ hook `useAuth()` ใน [`apps/frontend/src/contexts/auth-context.tsx`](./apps/frontend/src/contexts/auth-context.tsx) เช็ค session อัตโนมัติเมื่อเปิดเว็บ
   * หน้า `/login`, `/register`, และ Dashboard `/` พร้อมปุ่ม Logout และการแสดงข้อมูลโปรไฟล์
   * Build ของระบบทั้ง Frontend และ Backend ผ่านเรียบร้อย (`bun run build` สำเร็จ 0 errors)

---

## 🎯 2. งานที่ต้องทำต่อทันที (Next Tasks)

เมื่อเริ่มทำงานบนเครื่องใหม่ มี 2 เรื่องหลักที่ต้องทำต่อ:

### ⚠️ เรื่องที่ 1: การทำ UI ใหม่ (Design Update) — **ต้องถามผู้ใช้ก่อนเริ่มทำ!**
* **Context**: ผู้ใช้มีตัวอย่าง UI จริงที่ต้องการใช้ แต่ยังไม่ได้ส่งให้ในรอบนี้
* **ข้อกำหนดสำหรับ Agent**: **ห้ามเดาทำ UI ใหม่เองเด็ดขาด** ให้เริ่มบทสนทนาโดย **"ถามผู้ใช้ขอตัวอย่าง UI / Reference ภาพหรือรูปแบบที่ต้องการก่อนเริ่มลงมือทำ"**
* เมื่อผู้ใช้ส่งตัวอย่าง UI ให้แล้ว จึงค่อยปรับแก้หน้า `/login`, `/register` หรือ Dashboard ให้ตรงตามตัวอย่างที่ผู้ใช้ส่งมา

### 🧪 เรื่องที่ 2: การทดสอบระบบ (Testing Plan) — **ต้องมาคุยและวางแผนร่วมกับผู้ใช้**
* ต้องมาคุยเรื่อง Test กับผู้ใช้ โดยอิงตาม Acceptance Criteria ของ Trello card `[FR-ACC-01]`:
  1. เข้าสู่ระบบเป็น User A แล้วสร้างเอกสาร ระบบผูกเจ้าของเป็น A
  2. เข้าสู่ระบบเป็น User B แล้วไม่เห็นเอกสารของ A
  3. ออกจากระบบแล้วเปิด URL/API ต้องโดน 401 Unauthorized
  4. สร้างเอกสารผ่าน API โดยส่ง `OwnerID` คนอื่น ระบบต้องไม่ยอมรับ
* เลือกและตกลงรูปแบบการ Test:
  * **Automated E2E Test**: เขียน test ด้วย Vitest/Supertest ยิงทดสอบ Auth Flow และ Cookie จริง
  * **Manual Test**: เปิด Docker, รัน Server จริงทดสอบผ่าน Browser และเปิด Prisma Studio (`bun --cwd apps/backend prisma studio`) ดูตาราง `users`

---

## 🚀 3. คำสั่งเริ่มต้นใช้งานเมื่อเปิดเครื่องใหม่

```bash
# 1. ดึงโค้ดล่าสุด
git pull origin main

# 2. ติดตั้ง dependencies ทั้งหมด
bun install

# 3. เปิด PostgreSQL ผ่าน Docker
docker compose up -d

# 4. Generate Prisma Client
bun --cwd apps/backend prisma generate

# 5. รัน Unit Tests เพื่อตรวจความพร้อม
bun run test

# 6. รันเซิร์ฟเวอร์เพื่อทดสอบ
# Terminal 1: Backend (Port 3001)
bun run dev:backend
# Terminal 2: Frontend (Port 3000)
bun run dev:frontend
```
