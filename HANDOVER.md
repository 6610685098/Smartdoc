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

## 🎯 2. ลำดับงานที่ต้องทำต่อในการ์ด [FR-ACC-01] (Task Priority & Roadmap)

ลำดับการทำงานต่อไปนี้เรียงตามความสำคัญที่ผู้ใช้กำหนดไว้:

### 🎨 Task 1: ปรับแก้ UI ของระบบ Auth ตามตัวอย่างจริง (ทำเป็นอันดับแรก) ⚠️
* **ข้อกำหนดสำคัญมาก**: ผู้ใช้มีภาพตัวอย่าง UI จริงที่ต้องการใช้ แต่ยังไม่ได้ส่งให้
* **หน้าที่ของ Agent**: **ห้ามเดาทำ UI ใหม่เองเด็ดขาด** ให้เปิดบทสนทนาโดย **"ถามผู้ใช้เพื่อขอตัวอย่าง UI / ภาพ Reference ของหน้า Login & Register ก่อนเริ่มลงมือทำเสมอ"**
* เมื่อได้รับตัวอย่าง UI แล้ว จึงนำมาปรับแก้หน้า [`/login`](./apps/frontend/src/app/login/page.tsx) และ [`/register`](./apps/frontend/src/app/register/page.tsx) ให้ตรงตามดีไซน์จริงของผู้ใช้

### 📄 Task 2: พัฒนาระบบเอกสาร (Doc System) แยกตามเจ้าของ (ทำเป็นอันดับสอง)
เป้าหมายคือผูกเอกสารเข้ากับ `userId` และแยกการแสดงผลตามเจ้าของ:
1. **Backend (`DocumentsModule`)**:
   * `POST /api/documents`: สร้างเอกสารใหม่ โดยผูกเจ้าของ `userId = req.user.id` จาก Request Token อัตโนมัติ **ห้ามรับ `userId` หรือ `ownerId` จาก body** เพื่อป้องกัน IDOR / การสร้างในนามคนอื่น
   * `GET /api/documents`: ดึงรายการเอกสาร โดย query เฉพาะเอกสารของตนเอง (`where: { userId: req.user.id, status: { not: 'TRASH' } }`)
   * `GET /api/documents/:id`: ตรวจสอบสิทธิ์ว่า `document.userId === req.user.id` หรือไม่ ถ้าไม่ใช่ให้ตอบ `403 Forbidden` หรือ `404 Not Found`
2. **Frontend (`Documents List / My Documents`)**:
   * หน้าแสดงรายการเอกสารของฉัน (My Documents)
   * เชื่อมต่อ API `GET /api/documents` แสดงรายการเฉพาะของตนเอง
   * ปุ่ม "สร้างเอกสารใหม่" ยิง `POST /api/documents`
   * การสลับบัญชี (User A vs User B) ต้องเห็นเอกสารแยกกันโดยสมบูรณ์

### 🧪 Task 3: การทดสอบระบบ (Testing Plan) — มาคุยและวางแผนร่วมกับผู้ใช้
หลังจากทำ Task 1 และ 2 เสร็จ ให้มาคุยแผนการ Test เพื่อ Verify ให้ครบทั้ง 4 ข้อตาม Acceptance Criteria ใน Trello:
- [ ] 1. เข้าสู่ระบบเป็น User A แล้วสร้างเอกสาร ระบบผูกเจ้าของเป็น A และแสดงในรายการของ A
- [ ] 2. เข้าสู่ระบบเป็น User B แล้วรายการและ API ไม่คืนข้อมูลเอกสารของ A
- [ ] 3. ออกจากระบบแล้วเปิด URL/API เอกสาร ระบบปฏิเสธ (401/403) จนกว่าจะเข้าสู่ระบบใหม่
- [ ] 4. สร้างเอกสารผ่าน API โดยส่ง `OwnerID` ของคนอื่น ระบบไม่สร้างเอกสารในนามคนอื่น (ป้องกัน IDOR)

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
