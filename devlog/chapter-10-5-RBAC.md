# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 10.5 – The Command Center: RBAC & Seeding (Legacy)

> ⚠️ **Catatan Penting**: Sistem RBAC yang dijelaskan di bab ini adalah versi awal (Single-Table Role). Untuk sistem RBAC terbaru yang menggunakan Node.js dan 5-tabel granular permissions, silakan lihat [Chapter 12](./chapter-12-Advanced-RBAC-NodeJS.md).

Selamat datang di **Chapter 10.5**. Setelah kita memiliki sistem login di Chapter 10, sekarang kita akan meningkatkan skalabilitasnya dengan memperkenalkan **Role-Based Access Control (RBAC)** dan sistem **Database Seeding**.

Di bab ini, kita akan membagi user menjadi dua kasta: **User Biasa** dan **Super Admin**.

---

## 🗺️ Roadmap Chapter 10.5 (The Admin Journey)

| Langkah | Fokus Utama | Deskripsi |
| :--- | :--- | :--- |
| **1** | **Role Schema** | Menambahkan kolom `role` di tabel `users`. |
| **2** | **Database Seeder** | Script otomatis untuk reset data dan mengisi data dummy. |
| **3** | **Restricted Menu** | Admin memiliki menu khusus dan tidak bisa melihat menu user biasa. |
| **4** | **Admin Account** | Membuat user `admin` dengan password `admin123`. |
| **5** | **User Management** | Halaman khusus admin untuk memantau seluruh pengguna. |

---

## 🛠️ Langkah Demi Langkah Analysis

### 🛠️ Langkah 1: Migrasi & Seeding
Kita menggunakan script `seed.go` untuk membersihkan database dan memasukkan data awal yang konsisten.

**Credentials Admin:**
- **Username:** `admin`
- **Password:** `admin123`

### 🛠️ Langkah 2: UI Menu Isolation
Pada `Sidebar.tsx`, kita melakukan pengecekan role. Jika user adalah admin, maka link Dashboard, Vault, dan AI Hub akan disembunyikan, digantikan hanya dengan **User Management**.

```tsx
{isAdmin && (
  <Link href="/admin/users">
    <ShieldAlert size={20} />
    <span>User Management</span>
  </Link>
)}
```

### 🛠️ Langkah 3: Route Protection
Admin yang mencoba masuk ke `/` (Dashboard) atau `/vault` akan otomatis dialihkan (redirect) ke `/admin/users` untuk menjaga fokus tugas administratif.

---

## 🧪 Hasil Pengujian (Super Admin admin)

1.  **Login Admin**: 
    *   **Aksi**: Login dengan `username: admin`.
    *   **Hasil**: Sidebar *hanya* menampilkan menu **"User Management"**. ✅
2.  **Redirect Logic**: 
    *   **Aksi**: Mengetik manual URL `localhost:3000/vault`.
    *   **Hasil**: Otomatis dikembalikan ke `/admin/users`. ✅
3.  **Data User**: 
    *   **Aksi**: Melihat daftar user.
    *   **Hasil**: Data dummy (Budi, Siti, Agus) muncul dengan benar. ✅

---

## 📌 Ringkasan Keamanan Baru

| Fitur | Status |
| :--- | :--- |
| Admin Credentials | `admin` / `admin123` |
| Menu Isolation | ✅ Enabled |
| Auto Redirect Admin | ✅ Active |
| Database Seeder | ✅ Verified |

✅ **Checkpoint Final Chapter 10.5:** Finastriva kini memiliki pemisahan tugas yang jelas antara operasional user dan manajerial admin! 🚀
