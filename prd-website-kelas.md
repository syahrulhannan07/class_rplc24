# PRD: Class Website (Website Kelas)

## 1. Overview

**Problem statement**
A university class currently has no centralized place to publish and access class information: officer structure, lecture schedule, announcements, activity photos, member list, and upcoming events. Information is scattered across chat groups and gets lost over time.

**Target user**
- **Public visitors** (classmates, lecturers, anyone with the link) — read-only access to all content, no login required.
- **Admin** (a single class officer responsible for content) — logs in to manage (create/edit/delete) all content through an admin panel.

**Definition of done**
The system ships when:
- Any visitor can open the site and view: class officer structure, lecture schedule, announcements, photo gallery (grouped by album), member list, and calendar of events — all without logging in.
- The admin can log in with email + password and fully manage (create, read, update, delete) every entity listed above through a dedicated `/admin` area.
- Uploaded photos (officer photos, gallery photos) are stored on the server's local disk and are correctly displayed on public pages.
- The app builds and runs in production on a VPS (Node.js process via PM2, reverse-proxied by Nginx).

**Project type**
New product, built from scratch.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router), React, **TypeScript** (strict mode) |
| Database | MySQL 8 |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Auth | Custom (no NextAuth) — bcrypt for password hashing, JWT signed with `jose`, stored in an httpOnly, secure cookie. Single admin account only; no signup/registration flow. |
| File uploads | Stored on local disk under `public/uploads/{officers|gallery|members}/`, served as static files by Next.js |
| Deployment | VPS — `next build` + `next start` managed by PM2, Nginx as reverse proxy (SSL via Certbot) |
| UI language | Bahasa Indonesia (all labels, buttons, messages, empty/error states) |

**Required libraries**
- `prisma`, `@prisma/client`
- `bcryptjs`
- `jose` (JWT sign/verify)
- `zod` (input validation on API routes)
- `multer` or Next.js native `formData()` handling for file uploads (use native `request.formData()` — no extra dependency needed)

**Forbidden / not needed**
- NextAuth.js, Clerk, Auth0, or any third-party auth provider — auth must be the custom implementation described above.
- No cloud storage SDKs (Cloudinary, S3, etc.) — uploads are local disk only.
- No CMS (Sanity, Strapi, etc.).

---

## 3. Data Model

Prisma schema (`prisma/schema.prisma`), MySQL provider:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Admin {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ClassOfficer {
  id           Int      @id @default(autoincrement())
  name         String
  position     String   // Jabatan, e.g. "Ketua Kelas"
  photoUrl     String?  // /uploads/officers/xxx.jpg
  contact      String?  // email or WhatsApp number
  description  String?  @db.Text // Kata sambutan / short bio
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum DayOfWeek {
  SENIN
  SELASA
  RABU
  KAMIS
  JUMAT
  SABTU
  MINGGU
}

model ClassSchedule {
  id          Int       @id @default(autoincrement())
  day         DayOfWeek
  startTime   String    // "HH:mm", e.g. "08:00"
  endTime     String    // "HH:mm", e.g. "10:00"
  courseName  String
  lecturer    String
  room        String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Announcement {
  id          Int      @id @default(autoincrement())
  title       String
  content     String   @db.Text
  publishedAt DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GalleryAlbum {
  id            Int            @id @default(autoincrement())
  name          String
  description   String?        @db.Text
  eventDate     DateTime?
  coverImageUrl String?
  photos        GalleryPhoto[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model GalleryPhoto {
  id        Int          @id @default(autoincrement())
  albumId   Int
  album     GalleryAlbum @relation(fields: [albumId], references: [id], onDelete: Cascade)
  photoUrl  String
  caption   String?
  createdAt DateTime     @default(now())
}

model ClassMember {
  id        Int      @id @default(autoincrement())
  name      String
  nim       String   @unique
  photoUrl  String?
  contact   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CalendarEvent {
  id          Int      @id @default(autoincrement())
  eventName   String
  eventDate   DateTime
  eventTime   String?  // "HH:mm", optional
  location    String?
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Relationships**
- `GalleryAlbum` 1—N `GalleryPhoto`. Deleting an album cascades to delete its photos (DB-level `onDelete: Cascade`); the API layer must also delete the corresponding physical files from disk before/after the DB cascade.

**Key constraints**
- `Admin.email` unique.
- `ClassMember.nim` unique.
- `ClassSchedule.endTime` must be later than `startTime` (enforced in application validation, not DB-level).

**Seeding**
- Create `prisma/seed.ts` that inserts exactly one `Admin` row using `ADMIN_EMAIL` and `ADMIN_PASSWORD` (hashed with bcrypt) read from environment variables. Running the seed script twice must not create a duplicate admin (upsert by email).

---

## 4. Pages & Routing

### Public pages (no auth required)

| Route | Content |
|---|---|
| `/` | Landing page: short class intro/hero, quick nav cards to each section, latest 3 announcements, next 3 upcoming calendar events. |
| `/pengurus` | Grid of officer cards (photo, name, position), sorted by `displayOrder`. Clicking a card expands/opens contact + description. Empty state: "Belum ada data pengurus." |
| `/jadwal` | Weekly schedule grouped by day (Senin → Minggu), each day showing its list of classes sorted by `startTime`. Empty state per day: "Tidak ada jadwal." |
| `/pengumuman` | List of announcements sorted by `publishedAt` descending (title + date + excerpt). Empty state: "Belum ada pengumuman." |
| `/pengumuman/[id]` | Full announcement detail. 404 page if id not found. |
| `/galeri` | Grid of albums (cover image, name, date). Empty state: "Belum ada album." |
| `/galeri/[albumId]` | Album detail: name, description, date, grid of photos with captions. 404 if album not found. |
| `/anggota` | Searchable/filterable table of class members (name, NIM, photo). Client-side search by name or NIM. Empty state: "Belum ada anggota." |
| `/kalender` | List of calendar events sorted by `eventDate` ascending, grouped as "Akan Datang" (upcoming) / "Sudah Lewat" (past). Empty state: "Belum ada acara." |

### Admin pages (auth required)

| Route | Content |
|---|---|
| `/admin/login` | Email + password form. On success, sets auth cookie and redirects to `/admin/dashboard`. Shows inline error on invalid credentials. |
| `/admin/dashboard` | Overview cards (counts: total officers, schedules, announcements, albums, members, events) + links to each management page. |
| `/admin/pengurus` | Table of officers with Add/Edit/Delete. Form fields: name, position, photo upload, contact, description, displayOrder. |
| `/admin/jadwal` | Table of schedules with Add/Edit/Delete. Form fields: day (select), startTime, endTime, courseName, lecturer, room. |
| `/admin/pengumuman` | Table of announcements with Add/Edit/Delete. Form fields: title, content (textarea), publishedAt (date picker). |
| `/admin/galeri` | List of albums with Add/Edit/Delete Album, and per-album a sub-view to Add/Delete photos within it. |
| `/admin/anggota` | Table of members with Add/Edit/Delete. Form fields: name, nim, photo upload (optional), contact (optional). |
| `/admin/kalender` | Table of events with Add/Edit/Delete. Form fields: eventName, eventDate, eventTime (optional), location (optional), description (optional). |

**Loading & error states (apply to every list/detail page above)**
- While fetching: show a skeleton or "Memuat data..." placeholder.
- On fetch failure: show "Gagal memuat data. Coba lagi." with a retry button.
- On empty result: show the specific empty-state message listed per page above.

---

## 5. Features & User Flows

**F1 — Public browsing (all public routes)**
1. Visitor opens any public route without logging in.
2. Page fetches data server-side (Next.js Server Component) directly via Prisma.
3. If data exists, render it; if empty, render the empty state; if the fetch throws, render the error state.

**F2 — Admin login**
1. Admin opens `/admin/login`.
2. Admin enters email + password, submits.
3. API route `POST /api/auth/login` validates credentials against the single `Admin` row (bcrypt compare).
4. On success: sign a JWT containing `{ adminId, email }`, set it as an httpOnly, secure, `SameSite=Lax` cookie (`admin_session`), expiry 7 days. Redirect to `/admin/dashboard`.
5. On failure: return 401, show "Email atau password salah" on the form.

**F3 — Route protection**
1. `middleware.ts` intercepts every request to `/admin/*` except `/admin/login`.
2. Verifies the `admin_session` cookie/JWT.
3. If missing/invalid/expired: redirect to `/admin/login`.
4. If valid: allow the request through.

**F4 — Admin logout**
1. Admin clicks "Logout" in the admin layout header.
2. `POST /api/auth/logout` clears the `admin_session` cookie.
3. Redirect to `/admin/login`.

**F5 — CRUD flow (applies identically to Officers, Schedules, Announcements, Members, Calendar Events)**
1. Admin opens the relevant `/admin/{entity}` page → sees a table of existing records.
2. **Create**: clicks "Tambah", fills the form, submits → `POST /api/{entity}` → validates with Zod → inserts via Prisma → table refreshes, success toast "Berhasil ditambahkan."
3. **Edit**: clicks "Edit" on a row → form pre-filled → submits → `PUT /api/{entity}/[id]` → validates → updates → table refreshes, toast "Berhasil diperbarui."
4. **Delete**: clicks "Hapus" → confirmation modal ("Yakin ingin menghapus data ini?") → on confirm → `DELETE /api/{entity}/[id]` → removes record → table refreshes, toast "Berhasil dihapus."
5. Any validation or server error shows an inline message near the form; the table view shows a toast for delete errors.

**F6 — Gallery flow (album + photos, two-level)**
1. Admin creates an Album first (name, description, date, optional cover image) via `/admin/galeri`.
2. Admin opens the album's detail management view, uploads one or more photos into it (each with optional caption).
3. Deleting a photo removes the DB row and its physical file.
4. Deleting an album removes all its photos' DB rows (cascade) and their physical files, then removes the album row.

**F7 — Photo upload (shared by Officers, Members, Gallery Photos)**
1. Admin selects an image file in a form.
2. Client validates extension (`.jpg`, `.jpeg`, `.png`, `.webp`) and size (≤ 2MB) before submit; shows inline error if invalid.
3. On submit, the file is sent via `multipart/form-data` to the corresponding API route.
4. Server re-validates type/size, generates a unique filename (e.g. `crypto.randomUUID()` + original extension), saves it to `public/uploads/{officers|members|gallery}/`, and stores the relative URL (`/uploads/{folder}/{filename}`) in the DB.
5. If a record already had a photo and is being updated with a new one, the old physical file is deleted after the new one is successfully saved.

**F8 — Class member search**
1. Visitor types into a search box on `/anggota`.
2. List filters client-side by name or NIM (case-insensitive substring match), instantly, no page reload.

---

## 6. API Contract

All admin-mutation endpoints below require a valid `admin_session` cookie (enforced by `middleware.ts`); public GET endpoints do not.

```ts
// Auth
POST /api/auth/login
  body: { email: string; password: string }
  200: { success: true }
  401: { success: false; message: string }

POST /api/auth/logout
  200: { success: true }

// Class Officers
GET    /api/pengurus                 -> ClassOfficer[]
POST   /api/pengurus                 (multipart/form-data: name, position, contact?, description?, displayOrder, photo?) -> ClassOfficer
PUT    /api/pengurus/[id]            (multipart/form-data, same fields, all optional except required-by-schema) -> ClassOfficer
DELETE /api/pengurus/[id]            -> { success: true }

// Class Schedule
GET    /api/jadwal                   -> ClassSchedule[]
POST   /api/jadwal                   (json: { day, startTime, endTime, courseName, lecturer, room }) -> ClassSchedule
PUT    /api/jadwal/[id]              -> ClassSchedule
DELETE /api/jadwal/[id]              -> { success: true }

// Announcements
GET    /api/pengumuman               -> Announcement[]
GET    /api/pengumuman/[id]          -> Announcement | 404
POST   /api/pengumuman               (json: { title, content, publishedAt }) -> Announcement
PUT    /api/pengumuman/[id]          -> Announcement
DELETE /api/pengumuman/[id]          -> { success: true }

// Gallery
GET    /api/galeri                          -> GalleryAlbum[]
GET    /api/galeri/[albumId]                -> (GalleryAlbum & { photos: GalleryPhoto[] }) | 404
POST   /api/galeri                          (multipart: name, description?, eventDate?, cover?) -> GalleryAlbum
PUT    /api/galeri/[albumId]                -> GalleryAlbum
DELETE /api/galeri/[albumId]                -> { success: true } // cascades photos + files
POST   /api/galeri/[albumId]/photos         (multipart: photo, caption?) -> GalleryPhoto
DELETE /api/galeri/[albumId]/photos/[photoId] -> { success: true }

// Class Members
GET    /api/anggota                  -> ClassMember[]
POST   /api/anggota                  (multipart: name, nim, contact?, photo?) -> ClassMember
PUT    /api/anggota/[id]             -> ClassMember
DELETE /api/anggota/[id]             -> { success: true }

// Calendar Events
GET    /api/kalender                 -> CalendarEvent[]
POST   /api/kalender                 (json: { eventName, eventDate, eventTime?, location?, description? }) -> CalendarEvent
PUT    /api/kalender/[id]            -> CalendarEvent
DELETE /api/kalender/[id]            -> { success: true }
```

All error responses use the shape: `{ success: false; message: string; errors?: Record<string, string> }` (the `errors` field carries Zod field-level validation messages when applicable).

---

## 7. Business Rules & Edge Cases

- There is exactly **one** admin account, created only via the seed script. There is no public signup/registration page or API route.
- Login rate limiting: after 5 failed attempts from the same IP within 15 minutes, block further attempts for that IP for 15 minutes (in-memory counter is acceptable given single-VPS deployment).
- `ClassSchedule`: reject if `endTime` is not strictly later than `startTime` (compare as "HH:mm" strings converted to minutes).
- `ClassMember.nim`: must be unique; reject duplicate NIM with a clear inline error ("NIM sudah terdaftar.").
- File uploads: only `.jpg`, `.jpeg`, `.png`, `.webp` accepted; max 2MB; reject anything else with a 400 and clear message.
- Deleting a `GalleryAlbum` must delete all child `GalleryPhoto` files from disk before or in the same transaction as the DB cascade delete, so no orphan files remain.
- Replacing a photo (officer, member, or gallery photo) on update must delete the previous physical file after the new one is written successfully — never leave orphan files, and never delete the old file before the new upload succeeds.
- All admin forms must show field-level validation errors (via Zod) before hitting the server where feasible (client + server both validate; server validation is the source of truth).
- Every public list page must handle three states distinctly: loading, empty, and error — never show a blank white page.
- Dates are stored in UTC in the DB and displayed formatted in `Asia/Jakarta` timezone using Indonesian date formatting (e.g. "30 Juli 2026").

---

## 8. Out of Scope

The following are explicitly **not** built in this version:
- Comment system or discussion forum on any page.
- Automated notifications (email, WhatsApp, push, etc.).
- Multi-class / multi-tenant support — this system serves exactly one class.
- Self-service registration for students/members — all member data is entered by the admin.
- Multiple admin accounts or role-based permissions — always exactly one admin.
- Cloud file storage (Cloudinary/S3) — uploads are local-disk only.
- Drag-and-drop reordering UI for officer display order — `displayOrder` is a plain numeric field edited via the form.
- Any public write action (visitors cannot post, comment, or submit anything).
- Analytics/dashboard beyond the simple entity-count cards on `/admin/dashboard`.

---

## 9. Acceptance Criteria

- [ ] A visitor can view `/`, `/pengurus`, `/jadwal`, `/pengumuman` (+ detail), `/galeri` (+ album detail), `/anggota`, `/kalender` without logging in, each showing correct loading/empty/error states.
- [ ] An admin can log in at `/admin/login` with seeded credentials and is redirected to `/admin/dashboard`.
- [ ] Visiting any `/admin/*` route without a valid session redirects to `/admin/login`.
- [ ] Admin can create, edit, and delete a Class Officer, including uploading and replacing a photo; changes are immediately visible on `/pengurus`.
- [ ] Admin can create, edit, and delete a Class Schedule entry; invalid time ranges (`endTime <= startTime`) are rejected with a clear message.
- [ ] Admin can create, edit, and delete an Announcement; it appears correctly on `/pengumuman` and its detail page.
- [ ] Admin can create an Album, upload multiple photos into it with captions, and delete individual photos or the whole album (with all photos and files removed).
- [ ] Admin can create, edit, and delete a Class Member; duplicate NIM is rejected with a clear error.
- [ ] Admin can create, edit, and delete a Calendar Event; `/kalender` correctly separates upcoming vs. past events.
- [ ] Uploading a file of an invalid type or over 2MB is rejected with a clear inline message, on both client and server.
- [ ] Admin can log out and is redirected to `/admin/login`, after which protected pages are no longer accessible.
- [ ] The app builds successfully with `next build` and runs with `next start` under PM2 behind an Nginx reverse proxy.

---

## 10. Conventions

**Folder structure** (Next.js App Router default)
```
app/
  (public)/
    page.tsx                  -> "/"
    pengurus/page.tsx
    jadwal/page.tsx
    pengumuman/page.tsx
    pengumuman/[id]/page.tsx
    galeri/page.tsx
    galeri/[albumId]/page.tsx
    anggota/page.tsx
    kalender/page.tsx
  admin/
    login/page.tsx
    dashboard/page.tsx
    pengurus/page.tsx
    jadwal/page.tsx
    pengumuman/page.tsx
    galeri/page.tsx
    anggota/page.tsx
    kalender/page.tsx
  api/
    auth/login/route.ts
    auth/logout/route.ts
    pengurus/route.ts
    pengurus/[id]/route.ts
    jadwal/route.ts
    jadwal/[id]/route.ts
    pengumuman/route.ts
    pengumuman/[id]/route.ts
    galeri/route.ts
    galeri/[albumId]/route.ts
    galeri/[albumId]/photos/route.ts
    galeri/[albumId]/photos/[photoId]/route.ts
    anggota/route.ts
    anggota/[id]/route.ts
    kalender/route.ts
    kalender/[id]/route.ts
lib/
  prisma.ts        // Prisma client singleton
  auth.ts          // JWT sign/verify, cookie helpers
  upload.ts         // shared file-save/delete helpers
components/
  ui/              // shared buttons, inputs, modal, toast
  public/          // components used only in public pages
  admin/           // components used only in admin pages
prisma/
  schema.prisma
  seed.ts
middleware.ts
```

- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for route folder names where multi-word (already reflected above).
- **UI copy**: all visible text (labels, buttons, messages, empty/error states) in Bahasa Indonesia.
- **Error handling**: API routes return the standard error shape defined in Section 6; UI shows toasts for mutations and inline text for form validation.
- **Environment variables** (`.env`): `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (used only by the seed script).
