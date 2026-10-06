# 🚀 AI-Powered Task Management System

Sebuah sistem manajemen tugas (*Task Management*) full-stack skala enterprise yang modern, responsif, dan cerdas. Aplikasi ini dibangun untuk menyelesaikan *Technical Test* dengan nilai tambah fitur kecerdasan buatan (AI) yang terintegrasi.

## 🛠️ Tech Stack

**Frontend:**
- **Next.js 14** (App Router)
- **React** & **TypeScript**
- **Tailwind CSS** & **Shadcn UI** (Styling & Komponen)
- **Lucide React** (Icons)
- **Recharts** (Visualisasi Data/Analytics)
- **@hello-pangea/dnd** (Drag and Drop Kanban)
- **Next-themes** (Dark Mode)

**Backend:**
- **AdonisJS 6** (Node.js Framework)
- **TypeScript**
- **MySQL** (Database)
- **Lucid ORM** (Database ORM)
- **Google Gemini API** (AI Integration)
- **Bcrypt / Scrypt** (Keamanan Password)

---

## ✨ Fitur Unggulan

### 1. 🤖 AI Task Assistant (Gemini)
Pengguna tidak perlu mengisi form manual yang panjang. Cukup ketik perintah ke AI Command Bar (contoh: *"Buatkan task Fix Bug Login, prioritas tinggi, deadline besok"*), dan AI akan otomatis membuatkan *task* lengkap dengan penempatan tanggal dan prioritas yang akurat.

### 2. 🖱️ Papan Kanban Interaktif (Drag & Drop)
Ucapkan selamat tinggal pada tabel *todo-list* yang kaku. Geser (Drag & Drop) *task* Anda langsung di antara kolom **To Do**, **In Progress**, dan **Done**. Perubahan otomatis tersimpan ke *database*.

### 3. 📊 Dashboard Analitik & Statistik
Pantau progres proyek secara langsung dengan tab **Statistik Project**:
- **Pie Chart:** Persentase kelulusan *task* (Berapa persen proyek yang sudah *Done*).
- **Bar Chart (Beban Kerja):** Pantau anggota mana yang memegang beban kerja terbesar.
- **Bar Chart (Produktivitas):** Tren jumlah *task* yang selesai dalam 7 hari terakhir.

### 4. 🌙 Mode Gelap (Dark Mode)
Bekerja malam hari tanpa membuat mata lelah. Toggle *Dark Mode* tersedia di halaman navigasi utama hingga halaman Login/Register, tersimpan otomatis mengikuti preferensi pengguna.

### 5. ☑️ Sub-task (Checklist) Lengkap
Satu *task* besar dapat dipecah menjadi *checklist* *sub-task* kecil. Tandai sub-task yang sudah selesai (*strike-through*) agar lebih rinci memantau progres.

### 6. 🔔 Sistem Notifikasi Real-time & Cerdas (Auto-Polling)
- **Undangan Tim:** Notifikasi masuk ke lonceng saat ada anggota yang mengundang.
- **Deadline Hari Ini (Smart Reminder):** Sistem otomatis memunculkan peringatan di lonceng jika ada tugas yang batas waktunya jatuh di hari yang sama atau sudah terlewat (*overdue*). Indikator lonceng otomatis memperbarui angka merahnya (polling).

### 7. 🔐 Manajemen Pengguna & Keamanan Lapis Tinggi
- **Role-Based Access:** Akun *Admin* dan *User*.
- **Admin Dashboard:** Halaman khusus *Admin* untuk mengawasi seluruh pengguna, menghitung proyek mereka, dan menghapus akun nakal.
- **Invite Member Secure Flow:** Mengundang member baru melalui email akan menghasilkan "Temporary Password" khusus. Begitu member tersebut login, sistem akan "mengunci" layar dan **memaksa** member untuk mengganti password mereka ke yang baru minimal 6 karakter.

---

## 💻 Cara Menjalankan (Local Setup)

### Persyaratan
- Node.js (v20+)
- MySQL (v8+)
- API Key Google Gemini (untuk fitur AI)

### Setup Backend (AdonisJS)
1. Buka terminal di folder *root*.
2. Duplikat `.env.example` menjadi `.env` dan isi konfigurasi database serta tambahkan `GEMINI_API_KEY`.
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan migrasi database:
   ```bash
   node ace migration:run
   ```
5. Jalankan server backend:
   ```bash
   npm run dev
   ```
   *Backend akan berjalan di http://localhost:3333*

### Setup Frontend (Next.js)
1. Buka terminal baru dan masuk ke folder `frontend`.
   ```bash
   cd frontend
   ```
2. Buat file `.env.local` dan isi URL API backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3333
   ```
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan server frontend:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di http://localhost:3000*

---

## 🏗️ Dokumentasi API & Backend Details
Sistem menggunakan autentikasi JWT Access Token dan AdonisJS Lucid ORM untuk tabel berikut:
- **users**: Data pengguna, role (`admin`, `user`), password.
- **projects** & **project_members**: Tim kerja dan hak akses antar project.
- **tasks**, **subtasks**, & **comments**: Manajemen tugas, checklist, dan kolom diskusi.
- **notifications**: Pengumuman & undangan.
- **activities**: Pencatatan riwayat interaksi pengguna dalam sebuah project.
- **audit_logs**: *Log* keamanan interaksi AI Command API.

*Catatan: Koleksi Postman awal dapat ditemukan di folder `docs/postman_collection.json`.*

🎉 *Developed with passion & agentic AI collaboration.*
