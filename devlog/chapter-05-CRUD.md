# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progress code step by step.**

---

# 📘 Chapter 5 – CRUD

Chapter ini fokus pada menyelesaikan objective utama Finastriva.  
Sub-chapter saat ini:  

1. **Fase 5.1:** Skema Data (Database & Backend)   
2. **Fase 5.2:** Update UI & Fitur Read
3. **Fase 5.3:** Menambahkan Fitur Hapus 
4. **Fase 5.4:** Menambahkan Fitur Update

Goal Chapter: Menyiapkan fondasi data dan backend untuk mendukung fitur transaksi lebih lengkap.

---

## 5.1 Skema Data: Database Migration & Backend Synchronization

Pada sub-bab ini, kita fokus mempersiapkan skema database PostgreSQL dan menyesuaikan backend Golang, **tanpa menyentuh UI**.

### Step 1: Git Workflow – Membuat Branch Baru

Agar branch main tetap stabil, kita bekerja di branch baru:

```bash 
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

# 📘 Chapter 5.2 – Update UI & Fitur Read

Pada fase ini kita mulai menghubungkan **UI Frontend Next.js** dengan skema data baru yang sudah dibuat pada **Chapter 5.1**.

Tujuan fase ini:

* User dapat memilih **jenis transaksi (Pemasukan / Pengeluaran)**
* Frontend mengirim **type transaksi ke backend API**
* Menampilkan **tanggal transaksi dari database**
* Memberikan **visual indicator warna transaksi**

> Backend sudah siap dari fase **5.1**, sehingga frontend sekarang hanya perlu menyesuaikan UI dan logic.

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
{transactions.map((t: Transaction) => (
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

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

        {transactions.map((t: Transaction) => (
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
# 📘 Chapter 5.2 – Update UI & Fitur Read

Pada fase ini kita mulai menghubungkan **UI Frontend Next.js** dengan skema data baru yang sudah dibuat pada **Chapter 5.1**.

Tujuan fase ini:

* User dapat memilih **jenis transaksi (Pemasukan / Pengeluaran)**
* Frontend mengirim **type transaksi ke backend API**
* Menampilkan **tanggal transaksi dari database**
* Memberikan **visual indicator warna transaksi**

> Backend sudah siap dari fase **5.1**, sehingga frontend sekarang hanya perlu menyesuaikan UI dan logic.

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
{transactions.map((t: Transaction) => (
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

interface Transaction {
  id: number;
  amount: number;
  desc: string;
  type: string;
  created_at: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

        {transactions.map((t: Transaction) => (
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

## Chapter 5.3 – Fitur Hapus Transaksi (Delete Mechanic)

Pada chapter sebelumnya kita sudah berhasil membuat sistem:

* **Create** → Menyimpan transaksi
* **Read** → Menampilkan transaksi

Sekarang kita akan melengkapi siklus **CRUD** dengan fitur:

> **Delete – Menghapus transaksi dari database**

Database dapat berisi banyak transaksi.

Agar backend tahu **data mana yang harus dihapus**, kita menggunakan:

```
Primary Key (ID)
```

Contoh tabel:

| id | description | amount  |
| -- | ----------- | ------- |
| 1  | Beli kopi   | 10000   |
| 2  | Gaji        | 5000000 |
| 3  | Bensin      | 20000   |

Jika user ingin menghapus **Bensin**, frontend akan mengirim:

```
/api/transactions?id=3
```

Backend kemudian menjalankan:

```
DELETE FROM transactions WHERE id = 3
```

---

# Arsitektur Flow Delete

```
User klik tombol hapus
        ↓
Frontend kirim HTTP DELETE
        ↓
Backend Golang menerima ID
        ↓
PostgreSQL menjalankan DELETE
        ↓
Frontend refresh data
```

---

# Step 1: Update Backend (DELETE Handler)

Buka file:

```
backend/main.go
```

Di dalam handler:

```
/api/transactions
```

Tambahkan logika untuk **DELETE request**.

---

## CORS Header (Wajib)

Sebelum mengirim data `DELETE`, browser akan melakukan *preflight request* (metode `OPTIONS`). Jika server tidak mengizinkannya, akan muncul error *Failed to fetch*. Maka, kita harus mengatur header di bagian paling atas handler:

```go
w.Header().Set("Content-Type", "application/json")
w.Header().Set("Access-Control-Allow-Origin", "*")
w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS") // Wajib ada DELETE & OPTIONS
w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

// Jika browser hanya cek izin (OPTIONS), langsung balas OK
if r.Method == "OPTIONS" {
    w.WriteHeader(http.StatusOK)
    return
}
```

Tanpa ini biasanya muncul error:

```
Failed to fetch
CORS blocked
```

> **Checkpoint 5.3-1:** Backend sudah mengizinkan method `DELETE`.

---

# Step 2: Implementasi SQL DELETE

Buka file `backend/main.go`. Untuk menambahkan fitur hapus transaksi, kita perlu membuat handler baru yang menangani metode `DELETE`.Cabang ini akan memproses permintaan penghapusan data berdasarkan id yang dikirim dari frontend.

> Tambahkan blok else if `r.Method == "DELETE"` di dalam handler /api/transactions di bawah `else if r.Method == "POST"`. 
```go
// Di dalam http.HandleFunc("/api/transactions", ...)
if r.Method == "GET" {
    // ... kode GET yang sudah ada ...
} else if r.Method == "POST" {
    // ... kode POST yang sudah ada ...
} else if r.Method == "DELETE" {
    // 1. Ambil ID dari URL (Contoh: /api/transactions?id=5)
    id := r.URL.Query().Get("id")
    
    if id == "" {
        http.Error(w, "ID tidak ditemukan", http.StatusBadRequest)
        return
    }

    // 2. Jalankan perintah SQL DELETE
    _, err := db.Exec("DELETE FROM transactions WHERE id = $1", id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // 3. Kirim respon sukses dalam format JSON
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Berhasil dihapus"})
}

```

Penjelasan:

| Komponen                   | Fungsi                         |
| -------------------------- | ------------------------------ |
| `Query().Get("id")`        | mengambil ID dari URL          |
| `db.Exec()`                | menjalankan perintah SQL       |
| `DELETE FROM transactions` | menghapus baris berdasarkan ID |

> **Checkpoint 5.3-2:** Backend dapat menerima request DELETE.

---


# Step 3: Update Frontend – Fungsi Hapus

Buka:

```
frontend/app/page.tsx
```

Tambahkan fungsi baru **di bawah ` const tambahTransaksi = async () => {...}`**.

```tsx
const hapusTransaksi = async (id: number) => {

  if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

  try {
    const res = await fetch(
      `http://localhost:8080/api/transactions?id=${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      fetchTransactions();
    }

  } catch (err) {
    console.error("Gagal menghapus:", err);
  }
};
```

Penjelasan:

| Mekanik               | Fungsi                             |
| --------------------- | ---------------------------------- |
| `confirm()`           | mencegah penghapusan tidak sengaja |
| `DELETE`              | method HTTP untuk menghapus data   |
| `fetchTransactions()` | sinkronisasi UI                    |

> **Checkpoint 5.3-3:** Frontend memiliki fungsi `hapusTransaksi`.

---

# Step 4: Tambahkan Tombol Hapus

Cari bagian `.map((t: Transaction) => ...)` dan tambahkan tombol sampah (atau teks "Hapus") di dalamnya.Perhatikan urutannya:

```tsx
{transactions.map((t: Transaction) => (
  <div key={t.id} className="...">
    <div className="flex flex-col">
      <span className="text-white font-medium">{t.desc}</span>
      <span className="text-gray-500 text-xs">
        {new Date(t.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    </div>
    
    <div className="flex items-center gap-4">
      <span className={`font-mono text-lg font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
        {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString()}
      </span>
      
      {/* Tombol Hapus Sampah */}
      <button 
        onClick={() => hapusTransaksi(t.id)}
        className="text-gray-500 hover:text-red-500 transition-colors p-2"
        title="Hapus"
      >
 		🗑
	  </button>
    </div>
  </div>
))}
```
Struktur akhirnya menjadi:

```
[Deskripsi]      [Nominal]   [Tombol Hapus]
```

> **Checkpoint 5.3-4:** Tombol hapus muncul di setiap transaksi.

---

# Step 5: Verifikasi Sistem

Restart backend:

```bash
go run main.go
```

Jalankan frontend:

```bash
npm run dev
```

Buka:

```
http://localhost:3000
```

---

## Test Case

| Test              | Expected Result   |
| ----------------- | ----------------- |
| klik tombol hapus | muncul konfirmasi |
| klik OK           | transaksi hilang  |
| refresh page      | data tetap hilang |
| console browser   | tidak ada error   |

> **Checkpoint 5.3-5:** Delete transaction berhasil.

---

# Ringkasan Mekanik Delete

| Step          | Komponen   | Mekanik                               |
| ------------- | ---------- | ------------------------------------- |
| Trigger       | Frontend   | User klik tombol hapus                |
| Request       | Browser    | Mengirim HTTP DELETE                  |
| Authorization | Backend    | CORS mengizinkan DELETE               |
| Execution     | PostgreSQL | `DELETE FROM transactions`            |
| Sync          | Frontend   | `fetchTransactions()` dipanggil ulang |

---



# Chapter 5.4: Menambahkan Fitur Update (Melengkapi Siklus CRUD)

Pada Chapter sebelumnya kita sudah berhasil membuat tiga operasi utama dalam manajemen data:

* **Create** → Menambah transaksi baru
* **Read** → Menampilkan daftar transaksi
* **Delete** → Menghapus transaksi

Namun masih ada satu operasi penting yang belum ada: **Update**.

Tanpa fitur ini, setiap kesalahan input harus diperbaiki dengan cara **menghapus data lalu membuat ulang**, yang tentu tidak efisien.

Di chapter ini kita akan menambahkan kemampuan **mengedit transaksi yang sudah ada**, sehingga aplikasi kita memiliki siklus CRUD yang lengkap.


---

### 1. Konsep Dasar Mekanik Update

Berbeda dengan **Create**, proses **Update** memiliki dua tahap penting.

#### Tahap 1 — Mengambil Data Lama

Ketika pengguna menekan tombol **Edit**, aplikasi harus:

1. Mengambil data dari baris transaksi yang dipilih
2. Memasukkan data tersebut ke dalam form input

Tujuannya agar user **tidak perlu mengetik ulang semuanya dari nol**.

---

#### Tahap 2 — Mengirim Perintah Update

Ketika tombol **Simpan** ditekan:

* Sistem harus tahu bahwa ini **bukan data baru**
* Tetapi **perintah untuk memperbarui data lama**

Inilah alasan kita menggunakan **HTTP Method PUT**.

---

### 2. Backend: Menangani Request PUT (Golang)

Sekarang kita akan menambahkan kemampuan **update transaksi** pada backend.

Buka file:

```
backend/main.go
```

Kemudian tambahkan handler untuk method **PUT**.

##### Tambahkan Method PUT

```go
// Di bagian header (paling atas handler)
w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS") // tambahkan PUT

// ... kode sebelumnya ...

// ... setelah blok POST ...
} else if r.Method == "PUT" {
        // 1. Ambil ID dari URL (?id=xxx)
        id := r.URL.Query().Get("id")
        fmt.Println("Mencoba Update ID:", id) // Log untuk cek di terminal

        if id == "" {
            http.Error(w, "ID tidak ditemukan", http.StatusBadRequest)
            return
        }

        // 2. Baca data baru
        var t Transaction
        err := json.NewDecoder(r.Body).Decode(&t)
        if err != nil {
            fmt.Println("Error Decode JSON:", err)
            http.Error(w, "Gagal baca data JSON", http.StatusBadRequest)
            return
        }

        // Log untuk memastikan data yang diterima tidak kosong
        fmt.Printf("Data Diterima: Amount=%d, Desc=%s, Type=%s\n", t.Amount, t.Desc, t.Type)

        // 3. Jalankan perintah SQL UPDATE
        // PASTIKAN: urutan kolom ($1, $2, etc) sesuai dengan variabel (t.Amount, t.Desc, etc)
        query := `UPDATE transactions SET amount = $1, description = $2, type = $3 WHERE id = $4`
        result, err := db.Exec(query, t.Amount, t.Desc, t.Type, id)
        
        if err != nil {
            fmt.Println("Error SQL Update:", err)
            http.Error(w, "Gagal update database", http.StatusInternalServerError)
            return
        }

        // 4. Verifikasi apakah ada baris yang benar-benar berubah
        rowsAffected, _ := result.RowsAffected()
        if rowsAffected == 0 {
            fmt.Println("Peringatan: Tidak ada baris yang diubah. Apakah ID", id, "ada di database?")
        } else {
            fmt.Println("Sukses! Baris diperbarui.")
        }

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"message": "Data berhasil diperbarui"})
    }
    })
       fmt.Println("Backend Finastriva jalan di http://localhost:8080")
	   http.ListenAndServe(":8080", nil)
}
```

---

### 3. Frontend: Menambahkan State Editing

Sekarang kita pindah ke sisi frontend.

Buka file:

```
frontend/app/page.tsx
```

Agar form bisa mengetahui apakah user sedang **menambah data** atau **mengedit data**, kita membutuhkan sebuah state baru.

---

##### Tambahkan State Baru

```tsx
const [editingId, setEditingId] = useState<number | null>(null);
```

Fungsi dari state ini:

| Nilai   | Arti        |
| ------- | ----------- |
| `null`  | Mode Tambah |
| `angka` | Mode Edit   |

Jika ada angka berarti kita sedang **mengedit transaksi dengan ID tersebut**.

---

### 4. Fungsi Memulai Mode Edit

Ketika tombol **Edit** ditekan, kita perlu:

1. Menyimpan ID transaksi
2. Mengisi kembali form input dengan data lama

Tambahkan fungsi berikut.

Fungsi ini dipicu saat tombol "Edit" di baris transaksi diklik.
```tsx
const startEdit = (t: Transaction) => {
  setEditingId(t.id); // Tandai bahwa kita masuk mode edit untuk ID ini
  setDesc(t.desc);    // Masukkan keterangan lama ke input
  setAmount(t.amount);// Masukkan nominal lama ke input
  setType(t.type);    // Masukkan tipe lama ke toggle

  window.scrollTo({ top: 0, behavior: "smooth" })
}
```

Sekarang ketika user klik **Edit**, form akan otomatis terisi.

---

### 5. Mengubah Fungsi Simpan Transaksi

Sekarang kita modifikasi fungsi penyimpanan agar bisa menangani **dua kondisi**:

* Tambah data → `POST`
* Update data → `PUT`

---

##### Fungsi Simpan Transaksi

```tsx
const tambahTransaksi = async () => {

  if (!desc || amount <= 0) {
    return alert("Isi data dengan benar!")
  }

  const isEdit = editingId !== null

  const method = isEdit ? "PUT" : "POST"

  const url = isEdit
    ? `http://localhost:8080/api/transactions?id=${editingId}`
    : "http://localhost:8080/api/transactions"

  try {

    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Number(amount),
        desc: desc,
        type: type
      })
    })

    if (res.ok) {

      // Reset form
      setEditingId(null)
      setDesc("")
      setAmount(0)

      // Refresh data
      fetchTransactions()
    }

  } catch {
    alert("Koneksi ke server gagal")
  }
}
```

---

### 6. Menambahkan Tombol Edit di UI

Sekarang kita tambahkan tombol **Edit** pada setiap baris transaksi.

```tsx
<div className="flex items-center gap-2">

  <button
    onClick={() => startEdit(t)}
    className="text-gray-500 hover:text-blue-500 p-2"
  >
    ✏️
  </button>

  <button
    onClick={() => hapusTransaksi(t.id)}
    className="text-gray-500 hover:text-red-500 p-2"
  >
    🗑
  </button>

</div>
```

Ketika tombol edit ditekan:

1. `startEdit()` dipanggil
2. Data transaksi dimasukkan ke form
3. Form berubah menjadi **Mode Edit**

---

### 7. Mekanik Lengkap CRUD

Sekarang sistem kita sudah memiliki seluruh siklus CRUD.

| Operasi | Method | Fungsi                       |
| ------- | ------ | ---------------------------- |
| Create  | POST   | Membuat transaksi baru       |
| Read    | GET    | Menampilkan daftar transaksi |
| Update  | PUT    | Memperbarui transaksi        |
| Delete  | DELETE | Menghapus transaksi          |

Ini adalah **fondasi utama hampir semua aplikasi web modern**.

---

### 8. Kesalahan yang Paling Sering Terjadi

Ada beberapa kesalahan umum ketika membuat fitur update.

##### 1. Lupa Menangani OPTIONS (CORS)

Browser biasanya mengirim request **OPTIONS** sebelum PUT.

Jika backend tidak merespon OPTIONS dengan benar, maka akan muncul error:

```
Failed to fetch
```

---

##### 2. Key JSON Tidak Cocok

Jika backend menggunakan:

```
json:"desc"
```

Tetapi frontend mengirim:

```
description
```

maka data yang masuk akan **kosong**.

---

##### 3. Lupa Reset `editingId`

Jika `editingId` tidak direset:

```
setEditingId(null)
```

Maka aplikasi akan **terjebak dalam Mode Edit** dan user tidak bisa menambah data baru.

---

### 9. Checklist Implementasi

Pastikan semua bagian berikut sudah selesai:

* [ ] Backend menangani method **PUT**
* [ ] Query SQL menggunakan **WHERE id**
* [ ] Frontend memiliki state **editingId**
* [ ] Tombol **Edit** sudah muncul pada setiap transaksi
* [ ] Form dapat berubah antara **Mode Tambah** dan **Mode Edit**

---

# Penutup
# Final State Sistem (CRUD)

Setelah Chapter 5.4 aplikasi sudah memiliki:

| Feature            | Status |
| ------------------ | ------ |
| Create Transaction | ✅      |
| Read Transaction   | ✅      |
| Delete Transaction | ✅      |
| Update Transaction | ✅      |

Aplikasi **Finastriva** kini memiliki sistem **CRUD dasar untuk transaksi keuangan* yang lengkap.

Kita sudah membangun **siklus CRUD penuh** yang menjadi fondasi hampir semua aplikasi berbasis database.

Pada chapter berikutnya, kita akan mulai membuat aplikasi ini lebih menarik dengan **visualisasi data menggunakan grafik dan update UI.

