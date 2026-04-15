# Finastriva Engineering Documentation

Dokumentasi ini menjelaskan proses pembangunan sistem **Finastriva** dari awal.Website ini dibuat untuk **memenuhi persyaratan tugas besar** yang diberikan, sekaligus sebagai referensi step-by-step pengembangan sistem.

Dokumentasi disusun dalam bentuk **chapter** agar alur pengembangan lebih jelas dan mudah diikuti secara bertahap.  

Setiap chapter menjelaskan satu bagian sistem secara teknis, mulai dari **setup environment** hingga mekanisme koneksi backend dengan database.  

---
# Chapter 0 – README (Documentation Overview)

# 🚀 Finastriva Fullstack Project

Selamat datang di dokumentasi **Fullstack Finastriva**! 🎉  
Dokumentasi ini dibuat agar kamu bisa melihat **perkembangan penulisan kode secara bertahap**.  

Backend menggunakan **Golang**, Datbase menggunakan **PostgreSQL**, sedangkan Frontend menggunakan **Next.js**.

---

## 🎯 Tujuan Dokumentasi

Dokumentasi ini dibuat untuk:

* Menjelaskan **mekanik sistem website Finastriva secara jelas**
* Memberikan **alur pembelajaran yang terstruktur**
* Menjadi referensi teknis untuk pengembangan Finastriva di masa depan

---

## 📌 Catatan

Dokumentasi ini akan terus diperbarui seiring berkembangnya fitur dan arsitektur sistem Finastriva.

---

## 🛠️ Panduan Menjalankan Project (Daily Setup)

Jika kamu baru saja menyalakan komputer dan ingin menjalankan Finastriva, ikuti langkah-langkah berikut secara berurutan:

### 1. Pastikan Database (PostgreSQL) Aktif
Pastikan service PostgreSQL sudah berjalan di komputermu.
*   **Linux**: `sudo systemctl start postgresql`
*   **Windows**: Buka *Services.msc* dan cari *postgresql-x64*.

### 2. Jalankan Backend (Node.js)
Buka terminal baru, masuk ke folder backend, dan jalankan server:
```bash
cd backend-node
npm start
```
*Server akan berjalan di `http://localhost:8080`.*

### 3. Jalankan Frontend (Next.js)
Buka terminal baru lagi (jangan matikan terminal backend), masuk ke folder frontend, dan jalankan:
```bash
cd frontend
npm run dev
```
*Akses website di `http://localhost:3000`.*

### 4. Login Credentials
Gunakan akun berikut untuk mencoba fitur RBAC:
*   **Superadmin**: `superadmin` / `superadmin123` (Akses penuh & hapus user)
*   **Admin**: `admin` / `admin123` (Manajemen user tanpa hapus)
*   **User Biasa**: `budi` / `password123` (Transaksi & AI Hub)

---

## 📂 Struktur Chapter Dokumentasi
... (Daftar Chapter ada di file lain atau bisa ditambahkan di sini)
