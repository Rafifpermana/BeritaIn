# 🚀 BeritaIn - Antarmuka Pengguna (Frontend)

**Antarmuka Pengguna yang Modern dan Responsif untuk Aplikasi Berita "BeritaIn"**

-----

Selamat datang di repositori untuk proyek **Frontend BeritaIn**. Proyek ini adalah wajah dari aplikasi "BeritaIn", menyediakan antarmuka pengguna (UI) yang dinamis, responsif, dan interaktif. Dibangun dengan teknologi web modern, frontend ini dirancang untuk memberikan pengalaman membaca berita yang mulus dan menyenangkan di berbagai perangkat.

Proyek ini secara eksklusif **mengonsumsi layanan dari [Backend BeritaIn API](https://www.google.com/search?q=https://github.com/rafifpermana/backend-beritain)**, yang berfungsi sebagai satu-satunya sumber data dan logika bisnis. Keduanya bekerja sama untuk menciptakan platform berita yang lengkap dan terintegrasi.

## 🎯 Filosofi Proyek

Fokus utama frontend ini adalah pada **pengalaman pengguna (User Experience)**. Kami bertujuan untuk menciptakan antarmuka yang tidak hanya terlihat bagus tetapi juga cepat, intuitif, dan mudah digunakan. Dengan mengadopsi arsitektur *Single Page Application* (SPA), transisi antar halaman terasa instan, memungkinkan pengguna untuk fokus pada konten berita tanpa gangguan.

-----

## ✨ Fitur Utama (Dari Sisi Pengguna)

Frontend ini mengimplementasikan semua fitur yang disediakan oleh backend API ke dalam antarmuka yang fungsional dan menarik.

  - 🔐 **Sistem Otentikasi & Registrasi**:

      - Halaman *Login* dan *Register* yang bersih dan aman.
      - Manajemen sesi pengguna menggunakan token yang disimpan di `localStorage` untuk pengalaman login yang persisten.

  - 📰 **Konsumsi Berita yang Kaya**:

      - **Halaman Beranda Dinamis**: Menampilkan berita utama, populer, rekomendasi, dan terbaru yang diambil dari *HomeContentProvider*.
      - **Halaman Detail Artikel**: Tampilan membaca yang imersif, mem-fetch dan me-render konten artikel dari sumber aslinya.
      - **Navigasi Kategori & Pencarian**: Halaman khusus untuk setiap kategori berita dan halaman hasil pencarian yang fungsional.

  - 💬 **Interaksi Pengguna yang Real-time**:

      - **Sistem Komentar Bertingkat**: Pengguna dapat berkomentar dan membalas komentar lain, dikelola melalui `CommentSection`.
      - **Voting & Suka**: Komponen `InteractionBar` memungkinkan pengguna untuk memberikan *like/dislike* pada artikel dan komentar.
      - **Bookmark**: Tombol bookmark yang fungsional untuk menyimpan artikel favorit.
      - **Notifikasi Real-time**: Menerima pembaruan (misalnya, komentar baru, pengumuman admin) secara langsung.

  - 👤 **Dashboard Pengguna Personal**:

      - **Overview & Pengaturan Profil**: Pengguna dapat mengubah nama dan me-reset password.
      - **Manajemen Bookmark**: Melihat semua artikel yang telah disimpan.
      - **Sistem Poin & Panduan**: Halaman informatif mengenai sistem poin dan panduan komunitas.

  - 🛠️ **Panel Administrasi Fungsional**:

      - **Dashboard Analitik**: Menampilkan data statistik pengguna dan komentar dalam bentuk visual menggunakan `Recharts`.
      - **Manajemen Pengguna**: Antarmuka untuk melihat, mencari, mengubah peran, dan menghapus pengguna.
      - **Moderasi Komentar**: Panel untuk menyetujui, menolak, atau menghapus komentar yang melanggar.
      - **Kirim Notifikasi**: Form untuk mengirim pengumuman massal ke semua pengguna.

-----

## 🏗️ Arsitektur & Teknologi

Frontend ini dibangun menggunakan tumpukan teknologi modern yang berfokus pada performa dan pengalaman developer.

  - **Library Inti**: React 19
  - **Build Tool**: Vite
  - **Styling**: Tailwind CSS
  - **Routing**: React Router DOM
  - **HTTP Client**: Axios (dikonfigurasi dengan interceptor untuk token auth)
  - **Manajemen State**: React Context API (`AuthContext`, `ArticleInteractionProvider`, `HomeContentProvider`)
  - **Ikon**: Lucide React
  - **Visualisasi Data**: Recharts

-----

## 🔗 Menghubungkan ke Backend

**PENTING:** Proyek frontend ini **tidak dapat berjalan sendiri**. Ia memerlukan **Backend BeritaIn API** untuk berjalan secara bersamaan sebagai sumber datanya.

Konfigurasi koneksi utama terletak di `src/api/axios.js`. Secara default, ia akan mencoba terhubung ke:

```javascript
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // URL Default Backend
  withCredentials: true,
});
```

Untuk lingkungan produksi, Anda harus mengonfigurasi variabel environment seperti yang dijelaskan di bawah.

## ⚙️ Panduan Instalasi & Konfigurasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan frontend di lingkungan pengembangan Anda.

### 1\. Prasyarat

  - Pastikan **Backend BeritaIn API sudah terinstal dan berjalan** di `http://localhost:8000`.
  - Node.js: Versi 18 atau yang lebih baru.
  - NPM atau Yarn: Manajer paket untuk JavaScript.
  - Git: Untuk meng-clone repository.

### 2\. Instalasi Proyek

**a. Clone Repository**

```bash
git clone [URL_FRONTEND_REPOSITORY_ANDA]
cd [NAMA_FOLDER_FRONTEND]
```

**b. Instal Dependensi**
Gunakan NPM (atau Yarn) untuk menginstal semua library yang dibutuhkan dari `package.json`.

```bash
npm install
```

### 3\. Konfigurasi Environment (`.env`)

Aplikasi ini menggunakan Vite untuk mengelola variabel environment.

**a. Buat File `.env.local`**
Salin file `.env.example` (jika ada) atau buat file baru bernama `.env.local` di root direktori proyek.

**b. Konfigurasi Variabel**
Isi file `.env.local` dengan konfigurasi berikut. Ini sangat penting untuk menghubungkan ke backend dan layanan pihak ketiga.

```ini
# URL tempat Backend API Anda berjalan
# Pastikan ini sesuai dengan setting APP_URL di backend .env
VITE_API_URL=http://localhost:8000/api

# Kredensial Pusher untuk notifikasi real-time (harus sama dengan backend)
VITE_PUSHER_APP_KEY=isi_dengan_app_key_pusher
VITE_PUSHER_APP_CLUSTER=ap1
```

> File `.env.local` bersifat sensitif dan **tidak boleh** dimasukkan ke dalam sistem kontrol versi (`.gitignore` sudah mengaturnya).

### 4\. Menjalankan Server Pengembangan

Setelah backend berjalan dan frontend terkonfigurasi, jalankan server pengembangan Vite.

```bash
npm run dev
```

Aplikasi Anda akan tersedia di `http://localhost:5173` (atau port lain yang tersedia) dan akan secara otomatis me-refresh saat Anda membuat perubahan pada kode.

### 5\. Membangun untuk Produksi

Untuk membuat versi produksi yang teroptimasi, jalankan perintah berikut:

```bash
npm run build
```

Hasil build akan tersedia di direktori `dist`.

-----

## 📁 Struktur Proyek

Berikut adalah gambaran singkat tentang struktur direktori utama di dalam `src`:

  - `src/api`: Berisi konfigurasi `axios` dan service-service untuk berkomunikasi dengan endpoint backend.
  - `src/components`: Komponen UI yang dapat digunakan kembali di berbagai halaman (Navbar, Footer, Tombol, dll.).
  - `src/contexts`: Provider dan Context React untuk manajemen state global seperti otentikasi, interaksi artikel, dan data homepage.
  - `src/dashboard`: Komponen spesifik untuk halaman dashboard pengguna dan admin.
  - `src/hooks`: Custom hooks untuk logika yang dapat digunakan kembali, seperti `useArticleInteractions`.
  - `src/pages`: Komponen yang mewakili halaman-halaman utama aplikasi (HomePage, LoginPage, DetailPage, dll.).
  - `src/utils`: Berisi komponen utilitas seperti `ProtectedRoute` dan `ScrollToTop`.
