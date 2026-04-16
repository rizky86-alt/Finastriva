# Dokumentasi Perencanaan Sistem Finastriva
[cite_start]Dokumentasi pengembangan platform manajemen keuangan pribadi versi 1.0 (2026)[cite: 250, 265].

## a. Deskripsi Produk

* [cite_start]**Nama Produk:** Finastriva [cite: 265]
* [cite_start]**Kategori:** Platform Manajemen Keuangan Pribadi (*Web Application*) [cite: 265]
* [cite_start]**Target Pengguna:** Mahasiswa, *Freelancer*, dan Profesional Muda[cite: 275, 277, 278, 279].

**Deskripsi:**
[cite_start]Finastriva adalah platform berbasis web dengan *Decoupled Architecture* yang dirancang untuk menyederhanakan pengelolaan arus kas melalui kecepatan input, kejelasan visual, dan keamanan data[cite: 265, 270]. [cite_start]Platform ini menyeimbangkan kesederhanaan catatan manual dengan kelengkapan sistem akuntansi modern[cite: 270].

---

## b. Fitur Form & Integrasi Backend

### Smart Transaction Tracking (Simulasi Transaksi)
[cite_start]Fitur ini memungkinkan input data transaksi secara instan melalui antarmuka interaktif[cite: 282, 284].

[cite_start]**Spesifikasi Form:** [cite: 457]
* [cite_start]**Field:** Nama Transaksi (*required*), Nominal (angka positif), dan Tipe (*income/expense*)[cite: 457, 458, 459].
* [cite_start]**Metode:** POST ke `/api/transactions` menggunakan format JSON[cite: 457].

[cite_start]**Cara Kerja:** [cite: 460, 461, 462, 463, 464]
1.  **Input & Validasi Klien:** Pengguna mengisi data; [cite_start]Frontend Next.js memvalidasi format (misal: nominal tidak boleh negatif)[cite: 460].
2.  [cite_start]**Pengiriman:** Data dikirim dengan menyertakan **JWT Token** pada *header Authorization* untuk keamanan[cite: 461, 469].
3.  **Backend Golang:**
    * [cite_start]Memverifikasi identitas pengguna melalui *AuthMiddleware*[cite: 462].
    * [cite_start]Men-decode JSON dan menjalankan query SQL terparameterisasi ke database PostgreSQL[cite: 463, 479].
4.  [cite_start]**Respon Real-time:** Sistem mengembalikan detail transaksi yang berhasil disimpan (termasuk ID dan waktu simpan)[cite: 464].
5.  [cite_start]**Update UI:** Frontend memperbarui total saldo, *income*, dan *expense* secara otomatis tanpa *reload* halaman menggunakan algoritma agregasi[cite: 290, 291].

---

## c. System Architecture (Arsitektur Sistem)

[cite_start]Finastriva menggunakan **Decoupled Architecture** di mana Frontend dan Backend berkomunikasi secara *stateless* melalui JSON[cite: 302, 305].

### 1. Frontend (Next.js - Client Layer)
* [cite_start]Menggunakan **App Router** untuk *file-based routing* yang cepat[cite: 308, 434].
* [cite_start]Mengelola status login melalui `AuthContext.tsx`[cite: 308, 453].
* [cite_start]Validasi input dan komunikasi API via *fetch*[cite: 308].

### 2. Backend (Golang - Business Layer)
* [cite_start]Menggunakan *framework* Gin (`net/http/gin`) untuk melayani *stateless* REST API[cite: 308, 367].
* [cite_start]Menjalankan logika bisnis, integrasi AI Gemini, dan keamanan RBAC (*Role-Based Access Control*)[cite: 308, 475].

### 3. Database (PostgreSQL - Data Layer)
* [cite_start]Penyimpanan data persisten dengan standar **ACID compliance** untuk menjamin integritas data finansial[cite: 273, 488].

### Alur Sistem (Logic Flow)
```
User Action → Frontend (Next.js) → Auth Middleware (JWT) → Backend (Golang) → Database (PostgreSQL) → JSON Response
```

---

## d. Use Case Diagram (Aktor & Fungsi)

[cite_start]Sistem menerapkan **Role-Based Access Control (RBAC)**[cite: 388].

* [cite_start]**Aktor User:** Registrasi, Login, Input Transaksi, Melihat riwayat (*The Vault*), Dashboard Real-time, dan Konsultasi AI Hub (Google Gemini)[cite: 391, 398].
* [cite_start]**Aktor Admin:** Monitoring seluruh pengguna terdaftar[cite: 394, 398].
* [cite_start]**Aktor Superadmin:** Memiliki hak tambahan untuk menghapus akun pengguna[cite: 395, 398].

---

## e. Sequence Diagram (Alur Interaksi)

1.  [cite_start]**Otentikasi:** User login → Backend memverifikasi *password* dengan **bcrypt** → Backend menerbitkan **JWT Token**[cite: 410, 413, 414].
2.  [cite_start]**Input Data:** User mengisi form → Frontend validasi klien → Kirim POST + JWT[cite: 417, 418, 419].
3.  [cite_start]**Proses Server:** Backend memvalidasi token → Simpan ke PostgreSQL melalui query terparameterisasi (proteksi SQL Injection)[cite: 420, 422, 479].
4.  [cite_start]**Output:** Backend kirim respon HTTP 200 → Frontend memperbarui daftar transaksi secara dinamis[cite: 423, 424].
5.  [cite_start]**Fitur AI:** User bertanya → Backend mengambil konteks finansial dari DB → Kirim prompt ke **Google Gemini AI API** → Jawaban ditampilkan ke User[cite: 425, 428, 429, 431].

---

## f. Struktur Proyek

| Path | Deskripsi |
| :--- | :--- |
| `frontend/app/` | [cite_start]Sistem routing dan layout utama (App Router) [cite: 337] |
| `frontend/app/components/` | [cite_start]Komponen UI *reusable* (Form, Analytics Card, List) [cite: 337, 451] |
| `frontend/app/context/` | [cite_start]`AuthContext.tsx` untuk manajemen state global login [cite: 337, 453] |
| `backend-go/main.go` | [cite_start]*Entry point* server, definisi endpoint API, dan middleware [cite: 337] |
| `backend-go/db_verify.go` | [cite_start]Logika verifikasi integritas data dan koneksi database [cite: 337] |
| `backend-go/verify_hash.go` | [cite_start]Implementasi hashing **bcrypt** (cost factor 14) untuk keamanan password [cite: 337, 471] |

---

### Ringkasan Teknis (Tabel Kesimpulan)
| Komponen | Teknologi | Peran Utama |
| :--- | :--- | :--- |
| **Frontend** | Next.js, TypeScript | [cite_start]Antarmuka, Manajemen State, Validasi Klien [cite: 308] |
| **Backend** | Golang (Gin) | [cite_start]Logika Bisnis, Middleware JWT, Integrasi AI [cite: 308] |
| **Database** | PostgreSQL | [cite_start]Penyimpanan Persisten, ACID Compliant [cite: 308, 488] |
| **Keamanan** | JWT, Bcrypt, SQL Parameterized | [cite_start]Autentikasi Stateless, Hashing Password, Proteksi Injeksi [cite: 468, 471, 479] |
