# 🚀 Finastriva Fullstack Project

Dokumentasi ini dibuat untuk **tracking progres coding step-by-step** dan penggunaan Git di project **Finastriva**.  
Cocok untuk mahasiswa *Engineering* yang ingin melihat perkembangan kode secara bertahap saat memprompt AI.

---

# 📘 Chapter 3 – Membuat Fitur Transaksi (Frontend ↔ Backend)

Sekarang kodingan kamu sudah aman di **GitHub**. Jika laptop bermasalah, kamu hanya perlu `git pull` untuk memulihkan project.

Karena pondasi **Fullstack Finastriva** sudah berjalan:
- ⚛️ Next.js (Frontend)
- 🐹 Golang (Backend)

Sekarang kita mulai masuk ke inti aplikasi **Finastriva**:  
💰 **Logika Keuangan – Menambah Transaksi**.

Fitur pertama yang akan kita bangun adalah **Input Transaksi (Income / Expense)**.

---

# 1️⃣ Rapikan Backend (Golang API)

Backend akan menerima data transaksi dari frontend melalui endpoint:

```
POST /api/transactions
```

Edit file:

```
backend/main.go
```

Lalu isi dengan kode berikut:

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Struktur data transaksi
type Transaction struct {
	ID     int    `json:"id"`
	Amount int    `json:"amount"`
	Desc   string `json:"desc"`
	Type   string `json:"type"` // "income" atau "expense"
}

func main() {

	// Dummy storage sementara (belum pakai database)
	transactions := []Transaction{}

	http.HandleFunc("/api/transactions", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		if r.Method == "GET" {
			json.NewEncoder(w).Encode(transactions)
			return
		}

		if r.Method == "POST" {
			var newTrans Transaction
			json.NewDecoder(r.Body).Decode(&newTrans)

			newTrans.ID = len(transactions) + 1
			transactions = append(transactions, newTrans)

			json.NewEncoder(w).Encode(newTrans)
		}
	})

	fmt.Println("Backend Finastriva jalan di http://localhost:8080")

	http.ListenAndServe(":8080", nil)
}
```

---

### Cara Kerja API Ini

Endpoint yang tersedia:

| Method | Endpoint | Fungsi |
|------|------|------|
| GET | `/api/transactions` | Mengambil semua transaksi |
| POST | `/api/transactions` | Menambahkan transaksi baru |

Contoh JSON yang dikirim dari frontend:

```json
{
  "amount": 20000,
  "desc": "Beli Makan",
  "type": "expense"
}
```

---

✅ **Checkpoint Backend:**  
Server berjalan di:

```
http://localhost:8080
```

---

# 2️⃣ Membuat Form di Frontend (Next.js)

Sekarang kita buat **UI input transaksi** di frontend.

Edit file:

```
frontend/app/page.tsx
```

Isi dengan kode berikut:

```tsx
"use client";
import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");

  const tambahTransaksi = async () => {
    const res = await fetch("http://localhost:8080/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(amount),
        desc,
        type: "expense",
      }),
    });

    if (res.ok) {
      alert("Transaksi Berhasil Disimpan!");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-black text-white">
      <h1 className="text-3xl font-bold text-blue-500">
        Finastriva Dashboard
      </h1>

      <div className="mt-10 p-6 bg-gray-800 rounded-lg w-full max-w-md">
        <label className="block mb-2">Keterangan</label>
        <input
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 outline-none"
          placeholder="Contoh: Beli Kopi"
        />

        <label className="block mb-2">Nominal (IDR)</label>
        <input
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 mb-4 rounded bg-gray-700 outline-none"
          placeholder="10000"
        />

        <button
          onClick={tambahTransaksi}
          className="w-full bg-blue-600 p-2 rounded font-bold hover:bg-blue-700"
        >
          Simpan Transaksi
        </button>
      </div>
    </main>
  );
}
```

---

✅ **Checkpoint Frontend:**

Halaman dashboard tersedia di:

```
http://localhost:3000
```

---

# 3️⃣ Jalankan & Test Sistem

### Jalankan Backend

Masuk ke folder backend:

```bash
go run main.go
```

Terminal akan menampilkan:

```
Backend Finastriva jalan di http://localhost:8080
```

---

### Jalankan Frontend

Masuk ke folder frontend:

```bash
npm run dev
```

Lalu buka:

```
http://localhost:3000
```

---

### Test Input

Coba masukkan:

```
Keterangan: Beli Makan
Nominal: 20000
```

Klik:

```
Simpan Transaksi
```

Jika berhasil muncul:

```
Transaksi Berhasil Disimpan!
```

---

# 4️⃣ Mekanik yang Baru Kamu Bangun

Beberapa konsep penting yang baru saja kamu implementasikan:

### 1. JSON Marshalling

Golang mengubah JSON menjadi struct Go.

```
JSON → Struct Go → Diproses Server
```

---

### 2. State Management (React)

React menggunakan:

```
useState()
```

untuk menangkap input user secara **real-time**.

---

### 3. CORS (Cross-Origin Resource Sharing)

Browser memblokir request antar port secara default.

Frontend:
```
localhost:3000
```

Backend:
```
localhost:8080
```

Solusinya:

```go
w.Header().Set("Access-Control-Allow-Origin", "*")
```

---

# 5️⃣ Limitasi Saat Ini

Saat ini sistem masih memiliki keterbatasan:

- Data hanya tersimpan di **memory**
- Jika server restart → **data hilang**
- Belum ada **database**
- Belum ada **authentication**

---

# 6️⃣ Roadmap Selanjutnya

Di chapter berikutnya kita akan menambahkan:

### 🗄 Database PostgreSQL

Supaya:

- transaksi tersimpan permanen
- bisa query data
- bisa membuat analytics keuangan

---

# 7️⃣ Ringkasan Alur Sistem

Flow data yang sudah bekerja:

```
User Input
   ↓
React Form (Next.js)
   ↓
HTTP POST Request
   ↓
Golang API
   ↓
JSON Decode
   ↓
Data Disimpan (Memory)
```

---

✅ **Checkpoint Final Chapter 3:**

- Frontend bisa input transaksi
- Backend menerima data
- Data diproses melalui API
- Fullstack Finastriva sudah **terhubung end-to-end**
