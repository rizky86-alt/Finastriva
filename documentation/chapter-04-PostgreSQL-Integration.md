# 🚀 Finastriva Fullstack Project

Dokumentasi ini dibuat untuk **tracking progres coding step-by-step** dan penggunaan Git di project **Finastriva**.  
Cocok untuk mahasiswa *Engineering* yang ingin melihat perkembangan kode secara bertahap saat memprompt AI.



---
# 📘 Chapter 4 – PostgreSQL Integration (Persistent Storage)

Pada chapter sebelumnya, backend Finastriva sudah bisa menerima transaksi dari frontend.

Namun ada satu masalah besar:

```
Server mati → data hilang
```

Karena data hanya disimpan di **RAM (memory)**.

Solusinya adalah menggunakan **database**.

Di chapter ini kita akan mengintegrasikan:

- 🐘 **PostgreSQL** sebagai database
- 🐹 **Golang** sebagai backend API
- ⚛️ **Next.js** sebagai frontend

Sehingga data transaksi menjadi **persistent**.

---

# 1️⃣ Arsitektur Sistem Finastriva

Aplikasi menggunakan arsitektur **3-Layer Web Application**.

```
Next.js Frontend
        │
        │ HTTP Request (JSON)
        ▼
Golang Backend API
        │
        │ SQL Query
        ▼
PostgreSQL Database
        │
        ▼
Persistent Storage (Disk / SSD)
```

Penjelasan alur:

1. **Frontend** mengirim HTTP request
2. **Backend Go** memproses request
3. Backend menjalankan **SQL query**
4. **PostgreSQL** menyimpan data secara permanen

---

# 2️⃣ Tech Stack Backend

| Technology | Purpose |
|------|------|
| Golang | Backend API server |
| PostgreSQL | Persistent database |
| lib/pq | PostgreSQL driver for Go |
| pgAdmin | Database management GUI |

---

# 3️⃣ Struktur Project Backend

Contoh struktur folder backend:

```
backend
│
├── main.go
├── go.mod
├── go.sum
└── README.md
```

Penjelasan:

| File | Fungsi |
|-----|------|
| main.go | Entry point server |
| go.mod | Dependency manager |
| go.sum | Dependency checksum |

---

# 4️⃣ Install PostgreSQL

Download PostgreSQL:

https://www.postgresql.org/download/

Saat instalasi gunakan konfigurasi:

```
username : postgres
password : (buat sendiri)
port     : 5432
```

Catat password karena akan dipakai oleh backend.

---

✅ **Checkpoint 1:** PostgreSQL berhasil terinstall.

---

# 5️⃣ Setup Database (Step-by-Step di pgAdmin)

Sekarang kita akan membuat **database dan tabel** untuk Finastriva menggunakan **pgAdmin 4**.

Ikuti langkah berikut secara perlahan.

---

# 5.1 Buka Server PostgreSQL

Di panel kiri **Browser** pada pgAdmin:

1. Klik **Servers**
2. Klik server **PostgreSQL**
3. Masukkan **password PostgreSQL** jika diminta

Setelah berhasil login, struktur akan terlihat seperti:

```
Servers
 └ PostgreSQL
     └ Databases
```

---

# 5.2 Buka Query Tool

Sekarang kita akan membuka **SQL Editor**.

Cara membuka:

1. Klik kanan **Databases**
2. Pilih **Query Tool**

Atau cara alternatif:

1. Klik database **postgres**
2. Klik tombol **Query Tool** di toolbar atas

Editor SQL akan terbuka di tengah layar.

---

# 5.3 Tempel SQL Query

---

### Struktur Table

| Column | Type | Description |
|------|------|------|
| id | SERIAL | primary key |
| amount | INT | jumlah transaksi |
| description | TEXT | deskripsi transaksi |
| created_at | TIMESTAMP | waktu transaksi |

---

Di editor SQL, tempel query berikut:

```sql
CREATE DATABASE finastriva;

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Namun **jangan langsung menjalankan semuanya sekaligus**.

Kita akan menjalankannya secara bertahap.

---

# 5.4 Jalankan CREATE DATABASE

Highlight hanya bagian ini:

```sql
CREATE DATABASE finastriva;
```

Kemudian klik tombol **Execute / Run** (ikon ⚡ petir).

Jika berhasil akan muncul pesan:

```
Query returned successfully
```

---

# 5.5 Refresh Database List

Sekarang lakukan refresh:

1. Klik kanan **Databases**
2. Pilih **Refresh**

Database baru akan muncul:

```
finastriva
```

---

# 5.6 Membuat Tabel Transactions

Sekarang kita membuat tabel di dalam database.

Langkahnya:

1. Klik database **finastriva**
2. Klik **Query Tool**

Lalu jalankan query berikut:

```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Klik **Execute ⚡** lagi.

Jika berhasil akan muncul:

```
Query returned successfully
```

---

# 5.7 Cek Tabel yang Dibuat

Di panel kiri buka struktur berikut:

```
finastriva
 └ Schemas
     └ public
         └ Tables
```

Jika berhasil, kamu akan melihat:

```
transactions
```

Ini berarti database sudah siap digunakan oleh **backend Golang**.

---

# 5.8 Apa yang Sebenarnya Terjadi?

Saat kamu klik **Execute** di pgAdmin, proses yang terjadi adalah:

```
pgAdmin (GUI)
      │
      ▼
PostgreSQL Server
      │
      ▼
Data ditulis ke Harddisk
```

Berbeda dengan sebelumnya ketika backend hanya menyimpan data di RAM:

```
Go Backend
   │
   ▼
RAM (Memory)
   │
   ▼
Hilang saat server mati
```

Sekarang transaksi kamu akan **tersimpan permanen di disk**.

---
✅ **Checkpoint 2:** Database dan table berhasil dibuat.
Jika kamu sudah melihat:

```
finastriva → tables → transactions

```

maka **database Finastriva sudah siap dipakai oleh backend Go.**

---

# 6️⃣ Setup Backend Dependency

Masuk ke folder backend:

```
cd backend
```

Install PostgreSQL driver:

```
go get github.com/lib/pq
```

Rapikan dependency:

```
go mod tidy
```

---

✅ **Checkpoint 3:** PostgreSQL driver berhasil diinstall.

---

# 7️⃣ Konfigurasi Database Connection

Edit file:

```
backend/main.go
```

Tambahkan connection string:

```go
connStr := "user=postgres password=YOUR_PASSWORD dbname=finastriva sslmode=disable"
```

Ganti:

```
YOUR_PASSWORD
```

dengan password PostgreSQL kamu.

---

Contoh:

```go
connStr := "user=postgres password=123456 dbname=finastriva sslmode=disable"
```

---

# 8️⃣ Menjalankan Backend Server

Jalankan backend:

```
go run main.go
```

Jika berhasil akan muncul:

```
Mantap! Terhubung ke PostgreSQL
```

Server berjalan di:

```
http://localhost:8080
```

---

✅ **Checkpoint 4:** Backend berhasil terhubung ke database.

---

# 9️⃣ API Endpoint

Backend menyediakan dua endpoint utama.

---

## GET All Transactions

```
GET /api/transactions
```

Response:

```json
[
  {
    "id": 1,
    "amount": 15000,
    "desc": "Beli Bakso"
  }
]
```

---

## Create Transaction

```
POST /api/transactions
```

Request body:

```json
{
  "amount": 15000,
  "desc": "Beli Bakso"
}
```

Response:

```json
{
  "id": 1,
  "amount": 15000,
  "desc": "Beli Bakso"
}
```

---

# 🔟 Persistence Mechanism

Sebelum database:

```
RAM Storage
Server mati → data hilang
```

Setelah menggunakan PostgreSQL:

```
Disk Storage
Server mati → data tetap ada
```

Flow penyimpanan data:

```
User Input
   │
Frontend (Next.js)
   │
POST Request
   │
Go Backend
   │
INSERT SQL Query
   │
PostgreSQL
   │
Write to Disk
```

---

# 1️⃣1️⃣ Common Errors

### Driver Not Found

Error:

```
cannot find module providing package github.com/lib/pq
```

Solusi:

```
go get github.com/lib/pq
go mod tidy
```

---

### Authentication Failed

Error:

```
password authentication failed
```

Solusi:

Pastikan password di:

```
connStr
```

sesuai dengan password PostgreSQL.

---

### Database Does Not Exist

Error:

```
database finastriva does not exist
```

Solusi:

```sql
CREATE DATABASE finastriva;
```

---

# 1️⃣2️⃣ Learning Objectives

Dengan chapter ini kamu telah mempelajari:

- REST API
- SQL query
- Backend server architecture
- Persistent storage
- Database driver di Go
- Golang dependency management

---

# 1️⃣3️⃣ Future Improvements

Beberapa fitur yang bisa dikembangkan:

- Authentication system
- User accounts
- Pagination
- Transaction categories
- Docker containerization
- ORM integration

---

# 📌 Ringkasan Chapter 4

Di chapter ini kamu telah:

1. Menginstall PostgreSQL
2. Membuat database **finastriva**
3. Membuat tabel **transactions**
4. Menghubungkan backend Go ke database
5. Menyimpan transaksi secara **persistent**

---

✅ **Checkpoint Final Chapter 4:**

- PostgreSQL berjalan
- Backend terhubung ke database
- API bisa menyimpan transaksi
- Data tidak hilang saat server restart
