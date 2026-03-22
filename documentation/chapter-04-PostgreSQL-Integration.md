
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

Solusinya adalah menggunakan **database**, supaya data Finastriva kamu tidak hilang pas CMD ditutup, kita butuh **database**. Saya sarankan pakai **PostgreSQL**— karena ini merupakan standar industri.

Di chapter ini kita akan mengintegrasikan:

* 🐘 **PostgreSQL** sebagai database
* 🐹 **Golang** sebagai backend API
* ⚛️ **Next.js** sebagai frontend

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

# 2️⃣ Roadmap “Mekanik Database”

Supaya kamu ngerti step-by-step mekanik database Finastriva, struktur Project Backend :
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

## 2.1 Instalasi PostgreSQL (The Engine)

Karena kadang Windows Installer suka ribet, kita pakai cara paling aman:

1. Download **PostgreSQL Interactive Installer** dari [enterprisedb.com](https://www.enterprisedb.com/downloads/postgres). Pilih versi terbaru untuk Windows.Saat instalasi gunakan konfigurasi:

```
username : postgres (Opsional)
password : (buat sendiri)
```
2. Pas instalasi, dia bakal minta **Password**. **CATAT BAIK-BAIK!** Misal: `admin123`.
3. Port default biasanya `5432`.

**Tips Engineering:** Kalau nanti sudah jago, bisa pakai Docker supaya nggak perlu install di Windows. Tapi untuk sekarang, installer biasa sudah cukup.

✅ **Checkpoint 1:** PostgreSQL berhasil terinstall.

---

## 2.2 Setup Database di pgAdmin 4

Sekarang kita akan membuat **database dan tabel** untuk Finastriva menggunakan **pgAdmin 4**. Ikuti langkah berikut secara bertahap :


### 1) Buka Server PostgreSQL

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

### 2) Buka Query Tool

Sekarang kita akan membuka **SQL Editor**.

Cara membuka:

1. Klik kanan **Databases**
2. Pilih **Query Tool**

Atau cara alternatif:

1. Klik database **postgres**
2. Klik tombol **Query Tool** di toolbar atas

Editor SQL akan terbuka di tengah layar.

---

### 3) Tempel SQL Query
### Struktur Table

| Column | Type | Description |
|------|------|------|
| id | SERIAL | primary key |
| amount | INT | jumlah transaksi |
| description | TEXT | deskripsi transaksi |
| created_at | TIMESTAMP | waktu transaksi |

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

### 4) Jalankan CREATE DATABASE

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

### 5) Refresh Database List

Sekarang lakukan refresh:

1. Klik kanan **Databases**
2. Pilih **Refresh**

Database baru akan muncul:

```
finastriva
```

---

### 6) Membuat Tabel Transactions

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

### 7) Cek Tabel yang Dibuat

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

### 8) Apa yang Sebenarnya Terjadi?

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

✅ **Checkpoint 2:** Database `finastriva` dan tabel `transactions` sudah siap.
Jika kamu sudah melihat:

```
finastriva → tables → transactions
```

maka **database Finastriva sudah siap dipakai oleh backend Go.**

---

## 2.3 Mekanik Koneksi: Driver Database
Golang tidak bisa langsung "bicara" ke PostgreSQL. Dia butuh **driver**. Setup Backend Dependency :

Masuk ke folder backend:

```bash
cd backend
```

Install PostgreSQL driver:

```bash
go get github.com/lib/pq
```

Rapikan dependency:

```bash
go mod tidy
```

✅ **Checkpoint 3:** PostgreSQL driver berhasil diinstall.

---

# 3️⃣ Update Backend Go – Connect to DB

Sekarang kita ganti “Papan Tulis” (RAM) dengan “Buku Besar” (Database).

```go
package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq" // Driver Postgres
)

var db *sql.DB

func initDB() {
	connStr := "user=postgres password=admin123 dbname=finastriva sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	// Cek koneksi
	err = db.Ping()
	if err != nil {
		log.Fatal("Waduh, gak bisa konek ke database:", err)
	}
	fmt.Println("Mantap! Terhubung ke PostgreSQL")
}

type Transaction struct {
	ID     int    `json:"id"`
	Amount int    `json:"amount"`
	Desc   string `json:"desc"`
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/transactions", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "GET" {
			// AMBIL DARI DATABASE
			rows, _ := db.Query("SELECT id, amount, description FROM transactions")
			var ts []Transaction
			for rows.Next() {
				var t Transaction
				rows.Scan(&t.ID, &t.Amount, &t.Desc)
				ts = append(ts, t)
			}
			json.NewEncoder(w).Encode(ts)

		} else if r.Method == "POST" {
			// SIMPAN KE DATABASE
			var t Transaction
			json.NewDecoder(r.Body).Decode(&t)
			query := `INSERT INTO transactions (amount, description) VALUES ($1, $2) RETURNING id`
			db.QueryRow(query, t.Amount, t.Desc).Scan(&t.ID)
			json.NewEncoder(w).Encode(t)
		}
	})

	http.ListenAndServe(":8080", nil)
}
```
## Konfigurasi file backend:
1) Edit connection string:

```go
connStr := "user=postgres password=YOUR_PASSWORD dbname=finastriva sslmode=disable"
```

Ganti:
        
```
YOUR_PASSWORD
```

dengan password PostgreSQL kamu.

Contoh:

```go
connStr := "user=postgres password=123456 dbname=finastriva sslmode=disable"
```

2) Jalankan backend:

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

✅ **Checkpoint 4:** Backend Go berhasil terhubung ke database.
### Tech Stack Backend

| Technology | Purpose |
|------|------|
| Golang | Backend API server |
| PostgreSQL | Persistent database |
| lib/pq | PostgreSQL driver for Go |
| pgAdmin | Database management GUI |

---

# 4️⃣ Apa yang Berubah Secara Mekanik?

1. **Persistence:** Saat klik “Simpan” di Next.js, Go akan mengirim `INSERT` ke PostgreSQL. PostgreSQL menulis ke SSD/Harddisk.

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
2. **Safety:** Mau Ctrl+C di terminal, data tetap ada. Saat dijalankan lagi, Go melakukan `SELECT` dari disk.
3. **Scalability:** Bisa menyimpan jutaan data tanpa bikin RAM penuh.

---

# 5️⃣ API Endpoint

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

## POST Create Transaction

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

# 6️⃣ Common Errors

### Driver Not Found

```
cannot find module providing package github.com/lib/pq
```

**Solusi:**

```bash
go get github.com/lib/pq
go mod tidy
```

### Authentication Failed

```
password authentication failed
```

**Solusi:** Pastikan `connStr` sesuai password PostgreSQL.

### Database Does Not Exist

```
database finastriva does not exist
```

**Solusi:**

```sql
CREATE DATABASE finastriva;
```

---

# 7️⃣ Learning Objectives

Dengan chapter ini kamu telah mempelajari:

* REST API
* SQL query
* Backend server architecture
* Persistent storage
* Database driver di Go
* Golang dependency management

# 📌 Ringkasan Chapter 4

Di chapter ini kamu telah:

1. Menginstall PostgreSQL
2. Membuat database **finastriva**
3. Membuat tabel **transactions**
4. Menghubungkan backend Go ke database
5. Menyimpan transaksi secara **persistent**

✅ **Checkpoint Final Chapter 4:**

* PostgreSQL berjalan
* Backend terhubung ke database
* API bisa menyimpan transaksi
* Data tidak hilang saat server restart



