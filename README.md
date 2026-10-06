# 🚀 Taskly - AI-Powered Task Management System

Sebuah sistem manajemen tugas (*Task Management*) full-stack yang modern, responsif, dan cerdas. Aplikasi ini dirancang sebagai *platform* kolaborasi tim tingkat lanjut, dilengkapi dengan antarmuka (UI) kelas Enterprise, sistem keamanan kokoh, serta fitur asisten kecerdasan buatan (AI) yang terintegrasi penuh.

## 💻 Tech Stack

**Frontend:**
- **Next.js 16** (App Router & Middleware)
- **React 19** & **TypeScript**
- **Tailwind CSS** & **Shadcn UI** (Glassmorphism & Animasi Modern)
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
- **AdonisJS Limiter & Shield** (Sistem Keamanan & Rate Limiter)
- **Bcrypt / Scrypt** (Hashing Password)

---

## ✨ Fitur Unggulan

### 1. 🤖 AI Task Assistant (Gemini)
Pengguna tidak perlu mengisi form manual yang panjang. Cukup ketik perintah ke AI Command Bar (contoh: *"Buatkan task Fix Bug Login, prioritas tinggi, deadline besok"*), dan AI akan otomatis membuatkan *task* lengkap dengan penempatan tanggal dan prioritas yang akurat.

### 2. 📋 Papan Kanban Interaktif (Drag & Drop) & Mobile Ready
- Geser (Drag & Drop) *task* Anda langsung di antara kolom **To Do**, **In Progress**, dan **Done**. 
- **100% Mobile Friendly:** Tersedia mode gulir mendatar (Horizontal Scroll) untuk Kanban di perangkat *mobile* beserta tombol perpindahan (Move Left/Right) untuk aksesibilitas tinggi pada layar sentuh.

### 3. 📊 Dashboard Analitik & Statistik
Pantau progres proyek secara langsung dengan tab **Statistik Project**:
- **Pie Chart:** Persentase penyelesaian proyek.
- **Bar Chart (Beban Kerja):** Pantau anggota mana yang memegang beban kerja terbesar.
- **Bar Chart (Produktivitas):** Tren jumlah *task* yang selesai dalam 7 hari terakhir.

### 4. 🔐 Keamanan Skala Enterprise (Enterprise Security)
- **Rate Limiting & Anti-Brute Force:** Proteksi jalur Login & Register (maksimal 5 kali percobaan gagal per 5 menit).
- **HTTP Security Headers:** Menerapkan `Strict-Transport-Security`, `X-Frame-Options`, `X-XSS-Protection`, dan `Nosniff` di sisi Next.js untuk mencegah *Clickjacking* dan injeksi XSS.
- **URL Protection Middleware:** Mencegah akses ke halaman sensitif tanpa Token (dan mencegah pengguna login mengakses halaman registrasi lagi).
- **Force Password Reset:** Mengundang member baru akan menghasilkan "Temporary Password" khusus. Begitu member tersebut login, sistem akan "mengunci" layar dan **memaksa** member untuk mengganti password mereka ke yang baru.

### 5. 🔍 Activity Log dengan Filter & Sortir Cerdas
Seluruh riwayat perubahan dalam project (mulai dari siapa yang membuat *task* hingga komentar yang ditambahkan) dicatat rapi. Modal aktivitas dilengkapi dengan **Filter Pencarian Teks**, **Pencarian Berdasarkan Tanggal (Date Picker)**, serta penyortiran **Terbaru/Terlama**.

### 6. 🌙 Dark Mode & Responsivitas Penuh
Desain *Landing Page* dan *Dashboard* yang sepenuhnya mendukung perpindahan tema (Terang/Gelap) instan dengan elemen *glassmorphism*. Dilengkapi dengan *Mobile Navigation Drawer* (Menu Hamburger) untuk kemudahan navigasi di layar kecil.

### 7. 🔔 Sistem Notifikasi Real-time & Cerdas
- **Undangan Tim & Smart Reminder:** Lonceng indikator dengan *auto-polling* yang memunculkan peringatan jika ada *task* dengan batas waktu (*deadline*) di hari yang sama atau sudah terlewat.

---

## 🛠️ Cara Menjalankan (Local Setup)

### Persyaratan
- Node.js (v20+)
- MySQL (v8+)
- API Key Google Gemini (untuk fitur AI)

### Setup Backend (AdonisJS)
1. Buka terminal baru dan masuk ke folder `backend`.
   ```bash
   cd backend
   ```
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
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan server frontend:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di http://localhost:3000*

---

## 📚 Dokumentasi API
Sistem menggunakan autentikasi API berbasis Token. Silakan gunakan dokumen koleksi API untuk uji coba:
*Catatan: Koleksi Postman dapat ditemukan di folder `backend/docs/AI_Task_Management_API.postman_collection.json`.*

---
*Developed with passion by Rafid Dwi Prakoso.*
