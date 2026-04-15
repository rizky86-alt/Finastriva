# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 12 – Advanced RBAC: Node.js & Granular Permissions

Selamat datang di **Chapter 12**. Di bab ini, kita melakukan evolusi arsitektur dengan memperkenalkan **Node.js + Express** sebagai backend utama baru untuk mengimplementasikan sistem **Role-Based Access Control (RBAC)** yang jauh lebih kompleks dan granular.

---

## 🏗️ Evolusi Backend: Dari Go ke Node.js

Mungkin kamu bertanya: *"Kenapa kita membuat backend baru?"*

1.  **Ekosistem Middleware**: Node.js memiliki ekosistem middleware (seperti Passport atau custom RBAC logic) yang sangat fleksibel untuk menangani izin (permissions) yang sangat detail.
2.  **Flexibility vs Speed**: Sementara Go sangat unggul dalam performa mentah (raw speed), Node.js memberikan kecepatan pengembangan (development speed) yang lebih tinggi untuk logika bisnis yang kompleks seperti sistem Role & Permission Many-to-Many.
3.  **Fullstack Synergy**: Menggunakan TypeScript/JavaScript di Frontend dan Backend memudahkan kita untuk berbagi tipe data dan logika validasi.

**Catatan**: Folder `backend-go` tetap dipertahankan sebagai sistem legacy yang kompatibel dengan database baru, sehingga kamu bisa mempelajari dua pendekatan berbeda dalam membangun API.

---

## 🗺️ Roadmap Chapter 12 (Advanced Security)

| Langkah | Fokus Utama | Deskripsi |
| :--- | :--- | :--- |
| **1** | **Backend Migration** | Migrasi dari Go ke Node.js + Express. |
| **2** | **Granular Schema** | Implementasi 5 tabel: `users`, `roles`, `permissions`, `role_permissions`, `user_roles`. |
| **3** | **RBAC Middleware** | Middleware `authorizeRole` dan `authorizePermission`. |
| **4** | **Frontend Sync** | Update AuthContext & UI untuk mendukung array of roles. |
| **5** | **Superadmin Power** | Fitur hapus user eksklusif untuk Superadmin. |
| **6** | **Legacy Support** | Update Go backend agar tetap kompatibel dengan schema baru. |

---

## 🛠️ Langkah Demi Langkah Implementation
...
### 🛠️ Langkah 4: Legacy Go Backend Compatibility
Meskipun kita sudah memiliki backend Node.js, file `backend-go/main.go` telah diperbarui secara total untuk mendukung penuh schema 5-tabel. 
- **Query JOIN**: LoginHandler dan GetUsersHandler kini menggunakan `LEFT JOIN` ke tabel `user_roles` dan `roles` untuk mengambil seluruh role user.
- **Granular Seed**: Script `seed.go` di folder Go telah disinkronkan untuk membangun schema 5-tabel yang sama persis dengan versi Node.js.
- **Superadmin Delete**: Menambahkan endpoint `DELETE /api/admin/users` di Go yang hanya bisa diakses oleh role `superadmin`.


### 🛠️ Langkah 1: Database Schema (5 Tables)
Berbeda dengan Chapter 10.5 yang hanya menggunakan kolom `role`, sekarang kita menggunakan sistem relasi *Many-to-Many*:
1.  **Users**: Data identitas user.
2.  **Roles**: Definisi kasta (Superadmin, Admin, User).
3.  **Permissions**: Hak akses spesifik (misal: `manage_users`, `manage_content`).
4.  **Role_Permissions**: Mapping permission ke role.
5.  **User_Roles**: Mapping role ke user.

### 🛠️ Langkah 2: Middleware Authorize
Kita membuat middleware yang mengecek permission di level database sebelum mengizinkan akses ke endpoint.

```javascript
const authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    // Mengecek apakah salah satu role user memiliki permission ini
  };
};
```

### 🛠️ Langkah 3: Frontend Role Array
Frontend kini menerima `roles` dalam bentuk array dari backend Node.js.
- **Admin**: Bisa melihat user management.
- **Superadmin**: Bisa melihat tombol **"Delete User"**.

---

## 🧪 Hasil Pengujian (RBAC System)

1.  **Superadmin Login**:
    *   **Username**: `superadmin` / `superadmin123`
    *   **Akses**: Dashboard, User Management, & Tombol Delete. ✅
2.  **Admin Login**:
    *   **Username**: `admin` / `admin123`
    *   **Akses**: Dashboard & User Management (Tanpa tombol Delete). ✅
3.  **User Login**:
    *   **Username**: `budi` / `password123`
    *   **Akses**: Dashboard (Halaman User Management diblokir). ✅

---

## 📌 Endpoint Proteksi Baru

| Method | Endpoint | Protection |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Open |
| POST | `/api/auth/login` | Open |
| GET | `/api/users` | Admin & Superadmin |
| DELETE | `/api/users/:id` | Superadmin Only |
| GET | `/api/content` | Auth User (Personal) / Admin (All) |
| POST | `/api/content` | Permission `manage_content` |
| DELETE | `/api/content/:id` | Own Data / Admin (All) |

---

## 🛠️ Post-Implementation Fixes (Anti-Bug Journey)

Setelah sistem RBAC diaktifkan, kita menemukan dan memperbaiki beberapa isu kritikal:

### 1. Endpoint Mismatch (404 Error)
Frontend awalnya memanggil `/api/transactions` dan `/api/login`, namun backend Node.js menggunakan struktur `/api/content` dan `/api/auth/login`. Seluruh endpoint di `page.tsx`, `vault/page.tsx`, dan `auth/page.tsx` telah disinkronkan.

### 2. Data Mapping (TypeError)
Ada perbedaan penamaan kolom antara PostgreSQL (`description`) dan Frontend (`desc`). Kita memperbaikinya dengan:
- **Backend**: Menggunakan SQL Alias `SELECT description as desc`.
- **Frontend**: Menambahkan *Safety Check* (`const desc = t.desc || ""`) agar filter tidak crash jika ada data kosong.

### 3. Syntax Error (Process Conflict)
Muncul error `Unexpected non-whitespace character` karena backend Go masih berjalan di port yang sama (8080). Pastikan selalu mematikan backend lama sebelum menjalankan `backend-node`.

---

## 🚀 Cara Menjalankan Project

1.  **Backend (Node.js)**:
    ```bash
    cd backend-node
    npm install
    npm run seed # (Hanya sekali untuk setup database)
    npm start # Menjalankan server di port 8080
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

## ⚠️ Troubleshooting (PENTING)

Jika Anda masih melihat error `pq: column "role" does not exist`:
1.  **Matikan semua proses backend yang sedang berjalan** (baik itu Go maupun Node lama) dengan `Ctrl+C`.
2.  Pastikan Anda berada di direktori `backend-node`.
3.  Jalankan `npm start` untuk memastikan server Node.js terbaru yang aktif.
4.  Error tersebut terjadi karena database sudah dimigrasi ke sistem 5-tabel (tanpa kolom `role` di tabel `users`), namun proses backend lama mungkin masih mencoba mengakses kolom tersebut.

✅ **Checkpoint Final Chapter 12:** Finastriva kini memiliki fondasi keamanan tingkat enterprise dengan kontrol akses yang sangat mendetail! 🛡️
