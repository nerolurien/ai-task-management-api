# 🚀 Taskly - Enterprise-Grade AI Task Management System

Sebuah sistem manajemen tugas (*Task Management*) berbasis web *full-stack* yang modern, responsif, dan cerdas. Aplikasi ini dirancang tidak hanya sebagai alat manajemen proyek biasa, melainkan sebagai *platform* kolaborasi tim tingkat lanjut dengan arsitektur keamanan yang solid (RBAC, Rate Limiting), serta asisten kecerdasan buatan (AI) yang terintegrasi penuh.

## 🛠️ Tech Stack & Architecture

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Shadcn UI, Lucide React, Recharts.
- **Backend:** AdonisJS 6 (Node.js), TypeScript, MySQL, Lucid ORM.
- **AI Engine:** Google Gemini API.
- **Security:** AdonisJS Limiter & Shield, Bcrypt Hashing, HTTP Strict Security Headers.

---

## ✨ Sorotan Fitur Utama (Key Features)

### 1. 🤖 AI Task Assistant (Gemini)
Berbeda dengan aplikasi *To-Do List* tradisional yang mewajibkan pengguna mengisi *form* panjang (Judul, Deskripsi, Tenggat Waktu, Prioritas), Taskly menggunakan **Natural Language Processing**.
- **Cara Kerja:** Pengguna cukup mengetik *"Buatkan task Fix Bug Login dengan prioritas tinggi dan deadline besok"*. AI akan langsung mengekstrak *intent* tersebut dan memasukkannya ke dalam tabel *database* dengan parameter yang tepat secara otomatis.

*(Masukkan Screenshot AI Command Bar di sini)*
`[Tempat Screenshot: AI Command Bar / Contoh pembuatan Task AI]`

### 2. 🛡️ Role-Based Access Control (RBAC) & Google Drive-style Permissions
Aplikasi ini mendukung kolaborasi tim dengan sistem otorisasi multi-level:
- **Owner:** Kendali penuh atas proyek (menghapus, *kick member*, dll).
- **Manager:** Asisten *Owner* yang bisa mengundang/mengeluarkan anggota.
- **Editor:** Bisa membuat dan memindahkan *task*, namun fitur "*Invite*" bergantung pada konfigurasi *Owner* (Owner bisa menyalakan/mematikan izin "Editor Can Invite" kapan saja).
- **Viewer:** Akses *Read-only*. Seluruh tombol seperti `Tambah Task`, kotak instruksi AI, hingga kemampuan *Drag and Drop* Kanban Board otomatis dinonaktifkan di layar *Viewer*.

*(Masukkan Screenshot Modal Invite dengan Pilihan Role di sini)*
`[Tempat Screenshot: Invite Member Modal dengan Dropdown Viewer/Editor/Manager]`

### 3. 📋 Papan Kanban Drag-and-Drop (Mobile Responsive)
- Dilengkapi dengan *interface* Kanban klasik (To Do, In Progress, Done).
- Menggunakan pendekatan khusus agar **100% responsif di perangkat mobile**. *User* di layar kecil bisa menggulir kolom secara horizontal (mendatar) dan memindahkan kartu (*card*) dengan tombol panah khusus tanpa perlu kesulitan melakukan *drag and drop* di layar sentuh.

*(Masukkan Screenshot Papan Kanban Desktop & Mobile di sini)*
`[Tempat Screenshot: Kanban Board Desktop & Kanban Mobile Horizontal]`

### 4. 📊 Dashboard Analitik Cerdas
*Project Management* membutuhkan visibilitas data. Aplikasi menyajikan tiga visualisasi penting (didukung oleh Recharts):
- **Progress Keseluruhan:** *Pie Chart* dari status *task*.
- **Distribusi Beban Kerja:** *Bar Chart* yang menampilkan anggota mana yang sedang memegang beban kerja (*workload*) paling berat.
- **Tren Produktivitas:** Grafik penyelesaian *task* selama 7 hari terakhir.

*(Masukkan Screenshot Tab Statistik / Grafik di sini)*
`[Tempat Screenshot: Tab Statistik Project (Pie Chart & Bar Chart)]`

### 5. 🔐 Enterprise-Grade Security
Keamanan bukan sekadar fitur sampingan dalam sistem ini:
- **Rate Limiting AI & Auth:** Mencegah eksploitasi API Key dan serangan *Brute Force*. Batas ketat (maksimal 5 request AI per 10 menit) diberlakukan di level peladen (*server*).
- **Force Password Reset:** Anggota yang diundang via *email* akan diberikan kata sandi (*password*) sementara yang *auto-generated*. Saat login pertama kali, *middleware* akan mengunci akses pengguna hingga mereka mengganti *password* sementara tersebut.
- **Strict-Transport-Security & XSS Protection:** *Header* keamanan telah dikonfigurasi melalui Next.js.

*(Masukkan Screenshot Halaman Force Reset Password atau Activity Log di sini)*
`[Tempat Screenshot: Layar Wajib Ganti Password / Riwayat Aktivitas]`

---

## 💡 Mengapa Proyek Ini Menonjol?
Proyek ini mendemonstrasikan perpaduan yang sangat seimbang antara:
1. **Frontend Modern:** Pemahaman mendalam mengenai React *hooks*, sinkronisasi *state* kompleks (*drag-and-drop*), UI/UX yang memanjakan mata (*Dark Mode*, *Glassmorphism*), dan penanganan aplikasi ramah perangkat seluler (*mobile-first approach*).
2. **Backend Engineering:** Desain arsitektur *database* rasional, pengembangan API RESTful terstruktur menggunakan pola MVC (AdonisJS), penanganan Otorisasi (RBAC), serta optimasi keamanan *middleware*.
3. **AI Integration:** Pengimplementasian kecerdasan buatan (*Prompt Engineering* & API Gateway) yang tidak sekadar tempelan, melainkan benar-benar menyelesaikan masalah nyata (mempercepat *data entry*).
