# 📘 Chapter 5 – Objective Complete

Chapter ini fokus pada menyelesaikan objective utama Finastriva.  
Sub-chapter saat ini:  

1. **Fase 5.1:** Skema Data (Database & Backend) ✅  
2. **Fase 5.2:** Evolusi UI & Logic (Frontend) (menyusul)  
3. **Fase 5.3:** Fitur Hapus & Finalisasi (CRUD Completeness) (menyusul)  

Goal Chapter: Menyiapkan fondasi data dan backend untuk mendukung fitur transaksi lebih lengkap.

---

## 5.1️⃣ Skema Data: Database Migration & Backend Synchronization

Pada sub-bab ini, kita fokus mempersiapkan skema database PostgreSQL dan menyesuaikan backend Golang, **tanpa menyentuh UI**.

### Step 1: Git Workflow – Membuat Branch Baru

Agar branch main tetap stabil, kita bekerja di branch baru:

```bash id="git5_1"
# Pastikan branch main sudah up-to-date
git checkout main
git pull origin main

# Buat branch baru untuk fitur transaksi
git checkout -b feat/transaction-enrichment
```

> **Checkpoint 5.1-1:** Branch baru `feat/transaction-enrichment` siap, main branch tetap aman.

---

### Step 2: Database Layer – Migrasi Tabel (PostgreSQL)

Kita menambahkan kolom `type` untuk membedakan **Pemasukan/Pengeluaran** dan memastikan `created_at` berfungsi untuk riwayat transaksi.

1. Buka pgAdmin 4 → database `finastriva` → Query Tool.
2. Jalankan perintah SQL berikut:

```sql id="db5_1"
-- Tambah kolom type untuk kategori transaksi
ALTER TABLE transactions ADD COLUMN type VARCHAR(20) DEFAULT 'expense';

-- Pastikan kolom created_at memiliki default CURRENT_TIMESTAMP
ALTER TABLE transactions ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
```

> **Checkpoint 5.1-2:** Tabel `transactions` siap dengan kolom `type` dan `created_at`.

---

### Step 3: Backend Layer – Update Struct & Query (Golang)

Buka file `backend/main.go` dan sesuaikan struct serta query agar cocok dengan skema baru.

#### A. Update Struct Transaction

```go
type Transaction struct {
	ID        int    `json:"id"`
	Amount    int    `json:"amount"`
	Desc      string `json:"desc"`
	Type      string `json:"type"`       // Kolom baru
	CreatedAt string `json:"created_at"` // Kolom baru
}
```

#### B. Update Handler GET & POST

**GET – Ambil data transaksi:**

```go
rows, err := db.Query("SELECT id, amount, description, type, created_at FROM transactions ORDER BY created_at DESC")
for rows.Next() {
	err = rows.Scan(&t.ID, &t.Amount, &t.Desc, &t.Type, &t.CreatedAt)
}
```

**POST – Simpan data transaksi:**

```go
query := `INSERT INTO transactions (amount, description, type) VALUES ($1, $2, $3) RETURNING id, created_at`
err := db.QueryRow(query, t.Amount, t.Desc, t.Type).Scan(&t.ID, &t.CreatedAt)
```

> **Checkpoint 5.1-3:** Struct dan query backend sudah sinkron dengan skema baru.

---

### Step 4: Verifikasi (Anti-Bug Check)

1. Simpan semua file.
2. Jalankan backend:

```bash
go run main.go
```

3. Indikator sukses:  
   - Terminal menampilkan **"Mantap! Terhubung ke PostgreSQL"**.  
   - Tidak ada error **"struct field mismatch"** saat melakukan GET/POST API.

> **Checkpoint 5.1-4:** Backend sudah berjalan lancar dengan skema database baru.

---

### Step 5: Ringkasan Alur Chapter 5.1

| Action | Deskripsi | Checkpoint |
|--------|-----------|------------|
| Git Branching | Buat branch `feat/transaction-enrichment` agar main branch aman | 5.1-1 |
| Database Migration | Tambah kolom `type`, pastikan `created_at` | 5.1-2 |
| Backend Update | Update struct Transaction & query SQL | 5.1-3 |
| Verification | Jalankan backend, pastikan koneksi DB & query berhasil | 5.1-4 |

> ✅ **Checkpoint final 5.1:** Database & backend siap mendukung transaksi Pemasukan/Pengeluaran. UI akan mengikuti di Fase 5.2.

---

Aku sudah **menyesuaikan Chapter 5.2** agar konsisten dengan referensi yang kamu berikan di **Chapter 5.1**.
Perubahan yang aku lakukan:

* Struktur **Step + Checkpoint** mengikuti 5.1
* Menjaga format **engineering documentation**
* Menambahkan **verification step**
* Menambahkan **ringkasan tabel**
* Menjaga gaya dokumentasi **progress tracking**

Berikut versi yang sudah disesuaikan 👇

---

# 📘 Chapter 5.2 – Evolusi UI & Logic (Frontend)

Pada fase ini kita mulai menghubungkan **UI Frontend Next.js** dengan skema data baru yang sudah dibuat pada **Chapter 5.1**.

Tujuan fase ini:

* User dapat memilih **jenis transaksi (Pemasukan / Pengeluaran)**
* Frontend mengirim **type transaksi ke backend API**
* Menampilkan **tanggal transaksi dari database**
* Memberikan **visual indicator warna transaksi**

> Backend sudah siap dari fase **5.1**, sehingga frontend sekarang hanya perlu menyesuaikan UI dan logic.

---

# 5.2️⃣ Evolusi UI: Input Type & Date Display

Kita akan melakukan perubahan pada file:

```
frontend/app/page.tsx
```

---

# Step 1: Update State Frontend

Tambahkan state baru untuk menyimpan **jenis transaksi**.

```tsx
const [amount, setAmount] = useState(0);
const [desc, setDesc] = useState("");
const [type, setType] = useState("expense"); // Default: pengeluaran
```

State `type` berfungsi menentukan jenis transaksi:

```
income  → pemasukan
expense → pengeluaran
```

State ini nantinya akan dikirim ke backend saat membuat transaksi baru.

> **Checkpoint 5.2-1:** State `type` berhasil ditambahkan ke frontend.

---

# Step 2: Update Fungsi POST (`tambahTransaksi`)

Frontend harus mengirim **type transaksi** ke backend API.

Update bagian `fetch` request:

```tsx
const tambahTransaksi = async () => {
  if (!desc || amount <= 0) return alert("Isi data dengan benar!");

  await fetch("http://localhost:8080/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Number(amount),
      desc: desc,
      type: type,
    }),
  });

  setDesc("");
  setAmount(0);
  fetchTransactions();
};
```

Sekarang payload yang dikirim ke backend menjadi:

```json
{
  "amount": 10000,
  "desc": "Beli kopi",
  "type": "expense"
}
```

Backend Golang yang sudah dibuat di **Chapter 5.1** akan langsung memproses data ini.

> **Checkpoint 5.2-2:** Frontend berhasil mengirim field `type` ke backend API.

---

# Step 3: Update UI – Toggle Pemasukan / Pengeluaran

Sekarang kita menambahkan **UI toggle** agar user bisa memilih jenis transaksi.

Tambahkan komponen berikut **di atas input keterangan**:

```tsx
<div className="flex gap-2 mb-4 bg-gray-800 p-1 rounded-lg">
  <button
    onClick={() => setType("income")}
    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
      type === "income"
        ? "bg-green-600 text-white shadow"
        : "text-gray-400 hover:text-white"
    }`}
  >
    Pemasukan
  </button>

  <button
    onClick={() => setType("expense")}
    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
      type === "expense"
        ? "bg-red-600 text-white shadow"
        : "text-gray-400 hover:text-white"
    }`}
  >
    Pengeluaran
  </button>
</div>
```

### Visual Feedback

UI sekarang memberikan indikator visual:

| Type    | Warna    |
| ------- | -------- |
| Income  | 🟢 Hijau |
| Expense | 🔴 Merah |

User dapat dengan mudah memilih jenis transaksi sebelum menyimpan data.

> **Checkpoint 5.2-3:** UI toggle berhasil mengontrol state `type`.

---

# Step 4: Update Riwayat Transaksi (History Display)

Sekarang kita memperkaya tampilan **riwayat transaksi**.

Tambahkan fitur berikut:

* **border warna berdasarkan type**
* **tanggal transaksi dari database**
* **format angka rupiah**

Update komponen render:

```tsx
{transactions.map((t: any) => (
  <div
    key={t.id}
    className={`bg-gray-900 p-4 rounded-lg flex justify-between border-l-4 ${
      t.type === "income" ? "border-green-500" : "border-red-500"
    } items-center mb-3`}
  >
    <div className="flex flex-col">
      <span className="text-white font-medium">{t.desc}</span>

      <span className="text-gray-500 text-xs">
        {new Date(t.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    </div>

    <span
      className={`font-mono text-lg ${
        t.type === "income" ? "text-green-400" : "text-red-400"
      }`}
    >
      {t.type === "income" ? "+" : "-"} Rp {t.amount.toLocaleString()}
    </span>
  </div>
))}
```

### Contoh Tampilan

```
Beli Kopi
12 Jun 2025        - Rp 10.000
```

```
Gaji
01 Jun 2025        + Rp 5.000.000
```

> **Checkpoint 5.2-4:** Riwayat transaksi menampilkan tanggal dan warna transaksi dengan benar.

---

# Step 5: Verifikasi (Frontend Check)

Setelah semua perubahan dilakukan:

1. Jalankan frontend:

```bash
npm run dev
```

2. Buka browser:

```
http://localhost:3000
```

3. Lakukan pengujian:

* Tambahkan **income**
* Tambahkan **expense**
* Pastikan:

| Test             | Expected Result              |
| ---------------- | ---------------------------- |
| Toggle income    | tombol berubah hijau         |
| Toggle expense   | tombol berubah merah         |
| Submit transaksi | data muncul di riwayat       |
| History display  | tanggal muncul dari database |
| Warna transaksi  | income hijau, expense merah  |

> **Checkpoint 5.2-5:** Frontend berhasil menampilkan transaksi dengan UI baru.

---

# Step 6 : Full Source Code
## Berikut kode lengkap page.tsx setelah update :

```tsx
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("expense");

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/transactions");
      const data = await res.json();
      setTransactions(data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const tambahTransaksi = async () => {
    if (!desc || amount <= 0) return alert("Isi data dengan benar!");

    await fetch("http://localhost:8080/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        desc: desc,
        type: type,
      }),
    });

    setDesc("");
    setAmount(0);
    fetchTransactions();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-black text-white">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">
        Finastriva Dashboard
      </h1>

      <div className="mt-4 p-6 bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex gap-2 mb-4 bg-gray-900 p-1 rounded-lg">
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              type === "income" ? "bg-green-600 text-white" : "text-gray-400"
            }`}
          >
            Pemasukan
          </button>

          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              type === "expense" ? "bg-red-600 text-white" : "text-gray-400"
            }`}
          >
            Pengeluaran
          </button>
        </div>

        <label className="block mb-2">Keterangan</label>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 outline-none"
          placeholder="Contoh: Beli Kopi"
        />

        <label className="block mb-2">Nominal (IDR)</label>
        <input
          value={amount === 0 ? "" : amount}
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 mb-6 rounded bg-gray-700 outline-none font-mono"
          placeholder="10000"
        />

        <button
          onClick={tambahTransaksi}
          className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-700 transition"
        >
          Simpan Transaksi
        </button>
      </div>

      <div className="mt-10 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-400">
          Riwayat Transaksi
        </h2>

        {transactions.map((t: any) => (
          <div
            key={t.id}
            className={`bg-gray-900 p-4 rounded-lg flex justify-between border-l-4 ${
              t.type === "income" ? "border-green-500" : "border-red-500"
            } items-center mb-3 shadow-md`}
          >
            <div className="flex flex-col">
              <span className="text-white font-medium">{t.desc}</span>

              <span className="text-gray-500 text-xs">
                {new Date(t.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <span
              className={`font-mono text-lg font-bold ${
                t.type === "income" ? "text-green-400" : "text-red-400"
              }`}
            >
              {t.type === "income" ? "+" : "-"} Rp{" "}
              {t.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
```
---

✅ **Checkpoint Final 5.2:**
Frontend sudah mampu:

* Menginput **Pemasukan / Pengeluaran**
* Mengirim data ke backend
* Menampilkan **tanggal transaksi**
* Memberikan **visual warna transaksi**

> **Ringkasan Alur**

| Action          | Deskripsi                                 | Checkpoint |
| --------------- | ----------------------------------------- | ---------- |
| Update State    | Tambah state `type` untuk jenis transaksi | 5.2-1      |
| Update POST API | Kirim field `type` ke backend             | 5.2-2      |
| UI Toggle       | Tambah tombol pemasukan / pengeluaran     | 5.2-3      |
| History Display | Tampilkan tanggal & warna transaksi       | 5.2-4      |
| Verification    | Jalankan frontend dan test fitur          | 5.2-5      |


Sistem sekarang sudah memiliki **flow transaksi lengkap dari UI → Backend → Database → UI kembali**.

---

## Fase Selanjutnya

### 5.3 – Fitur Hapus & Finalisasi (CRUD Completeness)

Pada fase berikutnya kita akan:

* Menambahkan **endpoint DELETE di backend Golang**
* Menambahkan **tombol hapus di setiap transaksi**
* Menyelesaikan **CRUD lengkap**
* Menyiapkan dasar untuk **dashboard grafik keuangan**

---

Kalau kamu mau, aku juga bisa bantu bikin **Chapter 5.3 yang benar-benar konsisten dengan 5.1 dan 5.2**, termasuk:

* struktur checkpoint
* backend delete handler
* UI delete button
* final commit workflow untuk branch `feat/transaction-enrichment`.

Karena **5.3 ini sebenarnya bagian yang membuat project terasa benar-benar “fullstack production style”**.


### Fase 5.2 & 5.3

- **Fase 5.2:** Evolusi UI & Logic (Frontend) – menyusul  
- **Fase 5.3:** Fitur Hapus & Finalisasi (CRUD Completeness) – menyusul

> Catatan: Selanjutnya kita akan mengembangkan UI agar user dapat memilih tipe transaksi saat input dan menampilkan riwayat transaksi secara real-time.
