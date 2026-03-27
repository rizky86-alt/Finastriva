# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progress code step by step.**

---

# 📘 Chapter 1 – Backend & Frontend Setup
📁 Setup Struktur Proyek
```

finastriva/
├── backend/
│   └── main.go
├── frontend/
│   └── app/page.tsx
└── README.md

```

## 1️⃣ Inisialisasi Folder Backend

```bash
cd C:\Users\Hype GLK\Documents\finastriva
mkdir backend
cd backend
go mod init finastriva-backend
```

Buka terminal (CMD/PowerShell), lalu jalankan:


```bash
cd C:\Users\Hype GLK\Documents\finastriva
mkdir backend
cd backend
go mod init finastriva-backend
````

> **Checkpoint 1:**
>
> * Folder `backend` dibuat
> * File `go.mod` berhasil diinisialisasi

---



## 2️⃣ Step 2: Membuat API Pertama (Hello World)

Buat file `main.go` di folder `backend`:

```go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Halo dari Golang! Finastriva Backend Ready!"})
	})

	fmt.Println("Backend jalan di http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
```

> **Checkpoint 2:**
>
> * Route `/api/hello` siap menerima request
> * Backend minimal bisa dijalankan

---

## 3️⃣ Step 3: Menjalankan Backend

Di terminal folder `backend`, jalankan:

```bash
go run main.go
```

Jika muncul:


```
Backend jalan di http://localhost:8080
```

… backend sudah siap.

> **Checkpoint 3:**
>
> * Backend berjalan
> * API `/api/hello` dapat diakses


---

## 4️⃣ Step 4: Hubungkan Frontend ke Backend

Buka `frontend/app/page.tsx`, ganti dengan kode:

```tsx
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.json())
      .then((val) => setData(val.message))
      .catch((err) => console.error("Error nembak API:", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Finastriva App</h1>
      <p className="mt-4 text-xl text-green-400">
        Status: {data || "Lagi konek ke backend..."}
      </p>
    </main>
  );
}
```

> **Checkpoint 4:**
>
> * Frontend bisa fetch API Golang
> * Data dari backend ditampilkan di UI

---

## 5️⃣ Step 5: Testing Fullstack

1. Jalankan backend (`go run main.go`)
2. Jalankan frontend (`npm run dev`)
3. Buka `http://localhost:3000` di browser

Jika muncul:

```
Halo dari Golang! Finastriva Backend Ready!
```





… berarti sistem Fullstack berhasil dibuat.






> **Checkpoint 5:**
>
> * Fullstack siap
> * Semua koneksi backend-frontend berfungsi

---

## 📝 Catatan Tambahan

* Gunakan **Checkpoint** setiap kali menambahkan fitur baru
* Bisa menambahkan **tanggal dan versi kode** untuk tracking perkembangan
* Ideal untuk dokumentasi progres saat memprompt AI atau bekerja secara iteratif






---

## ⚡ Tips

* Selalu jalankan backend sebelum frontend
* Gunakan VS Code untuk mempermudah navigasi folder
* Commit setiap checkpoint untuk membandingkan perubahan kode















