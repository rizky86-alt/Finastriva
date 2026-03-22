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

### Fase 5.2 & 5.3

- **Fase 5.2:** Evolusi UI & Logic (Frontend) – menyusul  
- **Fase 5.3:** Fitur Hapus & Finalisasi (CRUD Completeness) – menyusul

> Catatan: Selanjutnya kita akan mengembangkan UI agar user dapat memilih tipe transaksi saat input dan menampilkan riwayat transaksi secara real-time.
