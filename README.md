# Helpdesk System - Module Divisi & Kategori Masalah

Modul ini menyediakan fitur manajemen struktur organisasi (Divisi) dan klasifikasi bantuan teknik (Kategori Masalah) menggunakan stack Laravel 13, Inertia.js v3, dan React 19.

## ✨ Fitur Utama

- **CRUD Divisi**: Manajemen daftar divisi dalam organisasi.
- **CRUD Kategori Masalah**: Manajemen klasifikasi masalah yang terikat secara relasional ke Divisi tertentu.
- **Relasi Database**: Implementasi *One-to-Many* antara `Divisi` dan `IssueCategory`.
- **UI Modern**: Menggunakan komponen berbasis Shadcn/UI, Tailwind CSS v4, dan Lucide Icons.
- **Type-Safe Routing**: Integrasi dengan Laravel Wayfinder untuk penanganan rute di frontend.

## 🛠 Tech Stack

- **Backend**: Laravel 13 (PHP 8.5)
- **Frontend**: React 19, Inertia.js v3 (Inertia React)
- **Styling**: Tailwind CSS v4
- **Routing**: Laravel Wayfinder (Type-safe actions/routes)

## 📋 Struktur Database

### Tabel `divisis`
- `id`: Primary Key
- `name`: Nama Divisi (Unique)
- `description`: Deskripsi Divisi (Text)

### Tabel `issue_categories`
- `id`: Primary Key
- `divisi_id`: Foreign Key (Belongs to `divisis`)
- `name`: Nama Kategori (Unique)
- `description`: Deskripsi Kategori (Text)

## 🚀 Cara Penggunaan

### 1. Jalankan Migrasi
Pastikan database sudah terkonfigurasi di `.env`, lalu jalankan:
```bash
php artisan migrate
```

### 2. Generate Route Wayfinder
Untuk memperbarui definisi rute dan aksi di frontend:
```bash
php artisan wayfinder:generate --with-form
```

### 3. Kompilasi Asset
Jalankan server pengembangan Vite:
```bash
npm run dev
```

## 📂 Struktur File Penting

- **Controller**: `app/Http/Controllers/DivisiController.php`, `IssueCategoryController.php`
- **Models**: `app/Models/Divisi.php`, `IssueCategory.php`
- **Requests**: `app/Http/Requests/StoreIssueCategoryRequest.php`, dll.
- **Pages**: `resources/js/pages/divisi/index.tsx`, `resources/js/pages/issue-category/index.tsx`
