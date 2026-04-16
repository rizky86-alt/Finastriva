
# Dokumentasi Perencanaan Sistem Finastriva

Dokumentasi pengembangan platform manajemen keuangan pribadi versi 1.0 (2026).

## a. Deskripsi Produk

* **Nama Produk:** Finastriva
* **Kategori:** Platform Manajemen Keuangan Pribadi (*Web Application*)
* **Target Pengguna:** Mahasiswa, *Freelancer*, dan Profesional Muda

**Deskripsi:**
Finastriva adalah platform berbasis web dengan *Decoupled Architecture* yang dirancang untuk menyederhanakan pengelolaan arus kas melalui kecepatan input, kejelasan visual, dan keamanan data. Platform ini menyeimbangkan kesederhanaan catatan manual dengan kelengkapan sistem akuntansi modern.

---

## b. Fitur Form & Integrasi Backend

### Smart Transaction Tracking (Simulasi Transaksi)

Fitur ini memungkinkan input data transaksi secara instan melalui antarmuka interaktif.

**Spesifikasi Form:**

* **Field:** Nama Transaksi (*required*), Nominal (angka positif), dan Tipe (*income/expense*)
* **Metode:** POST ke `/api/transactions` menggunakan format JSON

**Cara Kerja:**

1. **Input & Validasi Klien:** Pengguna mengisi data; Frontend (Next.js) memvalidasi format (misal: nominal tidak boleh negatif).
2. **Pengiriman:** Data dikirim dengan menyertakan **JWT Token** pada *header Authorization* untuk keamanan.
3. **Backend (Golang):**

   * Memverifikasi identitas pengguna melalui *AuthMiddleware*
   * Men-decode JSON dan menjalankan query SQL terparameterisasi ke database PostgreSQL
4. **Respon Real-time:** Sistem mengembalikan detail transaksi yang berhasil disimpan (termasuk ID dan waktu simpan).
5. **Update UI:** Frontend memperbarui total saldo, *income*, dan *expense* secara otomatis tanpa *reload* halaman menggunakan algoritma agregasi.

---

## c. System Architecture (Arsitektur Sistem)

Finastriva menggunakan **Decoupled Architecture** di mana Frontend dan Backend berkomunikasi secara *stateless* melalui JSON.

### 1. Frontend (Next.js - Client Layer)

* Menggunakan **App Router** untuk *file-based routing* yang cepat
* Mengelola status login melalui `AuthContext.tsx`
* Validasi input dan komunikasi API via *fetch*

### 2. Backend (Golang - Business Layer)

* Menggunakan *framework* Gin (`net/http/gin`) untuk melayani REST API stateless
* Menjalankan logika bisnis, integrasi AI Gemini, dan keamanan RBAC (*Role-Based Access Control*)

### 3. Database (PostgreSQL - Data Layer)

* Penyimpanan data persisten dengan standar **ACID compliance** untuk menjamin integritas data finansial

### Alur Sistem (Logic Flow)

```
User Action → Frontend (Next.js) → Auth Middleware (JWT) → Backend (Golang) → Database (PostgreSQL) → JSON Response
```

---

## d. Use Case Diagram (Aktor & Fungsi)

Sistem menerapkan **Role-Based Access Control (RBAC)**.

* **Aktor User:** Registrasi, Login, Input Transaksi, Melihat riwayat (*The Vault*), Dashboard Real-time, dan Konsultasi AI Hub (Google Gemini)
* **Aktor Admin:** Monitoring seluruh pengguna terdaftar
* **Aktor Superadmin:** Memiliki hak tambahan untuk menghapus akun pengguna

---

## e. Sequence Diagram (Alur Interaksi)

1. **Otentikasi:** User login → Backend memverifikasi *password* dengan **bcrypt** → Backend menerbitkan **JWT Token**
2. **Input Data:** User mengisi form → Frontend validasi klien → Kirim POST + JWT
3. **Proses Server:** Backend memvalidasi token → Simpan ke PostgreSQL melalui query terparameterisasi (proteksi SQL Injection)
4. **Output:** Backend kirim respon HTTP 200 → Frontend memperbarui daftar transaksi secara dinamis
5. **Fitur AI:** User bertanya → Backend mengambil konteks finansial dari DB → Kirim prompt ke **Google Gemini AI API** → Jawaban ditampilkan ke User

---

## f. Struktur Proyek

| Path                        | Deskripsi                                                                |
| :-------------------------- | :----------------------------------------------------------------------- |
| `frontend/app/`             | Sistem routing dan layout utama (App Router)                             |
| `frontend/app/components/`  | Komponen UI *reusable* (Form, Analytics Card, List)                      |
| `frontend/app/context/`     | `AuthContext.tsx` untuk manajemen state global login                     |
| `backend-go/main.go`        | *Entry point* server, definisi endpoint API, dan middleware              |
| `backend-go/db_verify.go`   | Logika verifikasi integritas data dan koneksi database                   |
| `backend-go/verify_hash.go` | Implementasi hashing **bcrypt** (cost factor 14) untuk keamanan password |

---

## Ringkasan Teknis

| Komponen     | Teknologi                      | Peran Utama                                               |
| :----------- | :----------------------------- | :-------------------------------------------------------- |
| **Frontend** | Next.js, TypeScript            | Antarmuka, Manajemen State, Validasi Klien                |
| **Backend**  | Golang (Gin)                   | Logika Bisnis, Middleware JWT, Integrasi AI               |
| **Database** | PostgreSQL                     | Penyimpanan Persisten, ACID Compliant                     |
| **Keamanan** | JWT, Bcrypt, SQL Parameterized | Autentikasi Stateless, Hashing Password, Proteksi Injeksi |

---


