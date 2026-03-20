# Dokumentasi
Dokumentasi pembuatan website dari 0

## a. Deskripsi Produk

- **Nama Produk:** Finastriva  
- **Bidang:** Finansial  

**Deskripsi:**  
Finastriva adalah platform manajemen keuangan *all-in-one* yang dirancang untuk membantu pengguna—baik pemula maupun profesional—melacak, mengelola, dan mengoptimalkan aset finansial mereka dalam satu dasbor terpadu.

---

## b. Fitur Form (Koneksi Backend)

### Smart Budgeting & Expense Tracker

**Cara kerja:**

1. Pengguna memasukkan data transaksi:
   - Nominal pemasukan atau pengeluaran  
   - Kategori (makanan, investasi, hobi, dll.)  
   - Tanggal transaksi  

2. Data dikirim ke backend menggunakan API.

3. Backend Golang akan:
   - Memvalidasi data transaksi  
   - Memeriksa apakah saldo mencukupi  
   - Menghitung sisa anggaran secara **real-time**

4. Sistem kemudian mengirimkan hasil perhitungan kembali ke frontend untuk ditampilkan kepada pengguna.

---

## c. System Architecture (Konseptual)

Arsitektur sistem Finastriva terdiri dari tiga komponen utama:

### 1. Frontend (Next.js)
- Menyediakan antarmuka pengguna  
- Menangani validasi input di sisi klien  
- Mengelola navigasi dan halaman aplikasi  

### 2. Backend (Golang)
- Berfungsi sebagai **API server**  
- Memproses logika bisnis finansial  
- Mengirimkan respon dalam format JSON  

### 3. Alur Sistem

```
User Input (Form)
        ↓
Next.js (POST Request)
        ↓
Golang API (Logic & Validation)
        ↓
Next.js (Display Response)
```

---

## d. Use Case Diagram (Narasi)

**Actor:**  
User (Pengguna)

**Use Case Utama:**

- Mengakses **Dashboard Finansial**  
- Mencatat **Transaksi Keuangan** melalui form input  
- Melihat **Ringkasan Anggaran dan Saldo**

---

## e. Sequence Diagram (Alur Interaksi)

1. **User** mengisi data pengeluaran pada form di halaman Finastriva.  
2. **Frontend (Next.js)** melakukan validasi input (misalnya memastikan nominal tidak bernilai nol atau negatif).  
3. **Frontend** mengirimkan data ke **Backend (Golang)** melalui endpoint API.  
4. **Backend (Golang)** memproses data dan menghitung sisa saldo pengguna.  
5. **Backend** mengirimkan respon berupa status berhasil dan saldo terbaru.  
6. **Frontend** menampilkan notifikasi sukses dan memperbarui informasi saldo pada dashboard pengguna.

---

## f. Struktur Proyek

Struktur direktori utama proyek **Finastriva**:

```
finastriva/
├── frontend/           # Next.js Project (Port 3000)
│   ├── app/            # App Router (Home, About, Form, dll)
│   ├── components/     # Navbar, Footer, UI Elements
│   └── public/         # Assets / Images
│
└── backend/            # Golang Project (Port 8080)
    ├── main.go         # Entry point & API Routes
    └── handlers/       # Logika pemrosesan data form
```
