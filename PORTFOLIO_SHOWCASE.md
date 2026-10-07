# Portofolio Proyek: Sistem Manajemen Tugas Terintegrasi Kecerdasan Buatan (AI)

## Ringkasan Proyek
Taskly adalah aplikasi web full-stack yang dirancang untuk merampingkan kolaborasi tim dan manajemen tugas. Sistem ini mengintegrasikan kecerdasan buatan untuk menyederhanakan entri data dan menerapkan arsitektur Role-Based Access Control (RBAC) yang kokoh guna memastikan keamanan data dan otorisasi berlapis antar pengguna.

## Teknologi & Arsitektur
- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS v4, Shadcn UI, Recharts.
- Backend: AdonisJS 6 (Node.js), TypeScript, MySQL, Lucid ORM.
- Integrasi: Google Gemini API untuk pemrosesan bahasa alami (Natural Language Processing).
- Keamanan: AdonisJS Limiter, Bcrypt, HTTP Strict Security Headers.

---

## Fitur Utama & Implementasi

### 1. Asisten Tugas Berbasis AI
Berbeda dengan metode pengisian formulir panjang tradisional, pengguna dapat memanfaatkan perintah bahasa alami untuk membuat tugas. Dengan mengetikkan instruksi seperti "Buatkan task perbaikan bug login dengan prioritas tinggi untuk besok", backend akan berkomunikasi dengan API Gemini untuk mengekstrak niat pengguna dan memetakannya secara otomatis ke dalam skema database.

[Sisipkan Tangkapan Layar: AI Command Bar dan Hasil Pembuatan Tugas]

### 2. Role-Based Access Control (RBAC)
Arsitektur sistem mendukung otorisasi multi-level untuk mengakomodasi struktur tim yang kompleks:
- Owner: Akses administratif penuh, termasuk penghapusan proyek dan manajemen anggota.
- Manager: Memiliki hak untuk mengelola anggota dan tugas proyek.
- Editor: Dapat memodifikasi dan memindahkan tugas. Hak untuk mengundang anggota lain bersifat dinamis dan dapat diatur oleh Owner.
- Viewer: Akses hanya-baca (read-only). Komponen UI seperti fungsi drag-and-drop, kolom input, dan tombol aksi dinonaktifkan secara terprogram di sisi klien dan divalidasi dengan ketat di sisi peladen.

[Sisipkan Tangkapan Layar: Modal Manajemen Anggota dengan Pilihan Role]

### 3. Papan Kanban Responsif
Dibangun dengan manajemen state yang kompleks untuk mendukung fungsionalitas drag-and-drop di lingkungan desktop. Guna memastikan kompatibilitas seluler, papan ini memanfaatkan pendekatan gulir horizontal yang dilengkapi tombol interaksi khusus. Hal ini menjamin aksesibilitas penuh pada perangkat sentuh tanpa mengorbankan pengalaman pengguna.

[Sisipkan Tangkapan Layar: Papan Kanban versi Desktop & Mobile]

### 4. Dasbor Analitik
Visibilitas dan metrik proyek divisualisasikan melalui Recharts, menyediakan data waktu nyata mengenai:
- Tingkat penyelesaian tugas dan status proyek saat ini.
- Distribusi beban kerja antar anggota tim untuk mencegah hambatan kerja (bottleneck).
- Tren produktivitas dalam 7 hari terakhir.

[Sisipkan Tangkapan Layar: Dasbor Analitik / Tab Statistik]

### 5. Riwayat Aktivitas (Activity Log)
Seluruh riwayat perubahan di dalam proyek (seperti penambahan tugas, perubahan status, hingga komentar) dicatat secara detail. Fitur ini dilengkapi dengan sistem pencarian teks dan filter berdasarkan tanggal untuk memudahkan proses audit pergerakan tugas.

[Sisipkan Tangkapan Layar: Modal Riwayat Aktivitas Proyek]

### 6. Sistem Notifikasi & Pengingat Pintar (Smart Reminder)
Aplikasi memiliki sistem pemberitahuan terintegrasi yang berfungsi untuk mengelola kolaborasi secara efisien:
- Menampilkan undangan kolaborasi masuk beserta aksi terima/tolak.
- Memberikan pengingat otomatis (auto-reminder) untuk tugas-tugas kritis yang batas waktunya berakhir pada hari yang sama atau sudah terlewat, sehingga tidak ada tugas yang terbengkalai.

[Sisipkan Tangkapan Layar: Lonceng Notifikasi dan Peringatan Tenggat Waktu]

### 7. Mode Gelap & Antarmuka Modern
Desain antarmuka mengadopsi estetika Glassmorphism yang mendukung pergantian tema terang dan gelap secara instan. Dilengkapi dengan navigasi samping adaptif untuk memastikan pengalaman navigasi yang lancar di berbagai ukuran layar.

[Sisipkan Tangkapan Layar: Perbandingan Tampilan Tema Terang dan Gelap]

### 8. Langkah Keamanan Lanjutan
Keamanan diintegrasikan pada inti aplikasi untuk mencegah kerentanan umum dan akses tidak sah:
- Pembatasan Laju API (Rate Limiting): Diterapkan pada tingkat peladen untuk mencegah serangan brute-force dan penyalahgunaan endpoint AI (dibatasi 5 permintaan per 10 menit per pengguna).
- Kedaluwarsa Undangan Berbasis Waktu: Undangan sistem akan hangus secara otomatis setelah 1 jam. Rutinitas pembersihan otomatis (auto-cleanup) menghapus undangan lama dari database untuk meminimalisasi risiko akses tak terotorisasi.
- Paksaan Pembaruan Kata Sandi: Anggota baru yang diundang menerima kata sandi sementara yang dihasilkan oleh sistem. Saat login pertama kali, middleware akan mencegat sesi dan memaksa pengguna memperbarui kata sandi sebelum memberikan akses dasbor.
- HTTP Security Headers: Dikonfigurasi untuk memitigasi serangan Clickjacking dan XSS.

[Sisipkan Tangkapan Layar: Layar Wajib Ganti Password atau Pengaturan Keamanan]

---

## Sorotan Teknis
Proyek ini mendemonstrasikan kecakapan dalam membangun aplikasi web yang dapat diskalakan. Pengembangan ini menyoroti kemampuan menyinkronkan state frontend yang kompleks dengan API backend RESTful yang aman. Integrasi AI menunjukkan penerapan rekayasa prompt (prompt engineering) praktis untuk menyelesaikan kendala interaksi pengguna (mengurangi entri data manual), sementara implementasi RBAC dan keamanan mencerminkan pemahaman mendalam terhadap standar arsitektur perangkat lunak tingkat perusahaan (enterprise-level).
