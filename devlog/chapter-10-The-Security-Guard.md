# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 10 – The Security Guard: Authentication & JWT

Selamat datang di **Chapter 10**. Setelah kita punya Dashboard yang keren dan Vault yang penuh data visual, sekarang saatnya kita memasang **Sistem Keamanan**. Kita tidak ingin sembarang orang bisa melihat data finansial pribadi kita.

Di bab ini, kita mengubah Finastriva dari aplikasi "terbuka" menjadi aplikasi privat yang memiliki sistem **Login & Proteksi Data**.

---

## 🗺️ Roadmap Chapter 10 (The Security Journey)

| Langkah | Fokus Utama | Deskripsi |
| :--- | :--- | :--- |
| **1** | **Database & Library** | Instalasi tools keamanan dan pembuatan tabel `users`. |
| **2** | **User Model & Hash** | Membuat struktur data user dan sistem enkripsi password. |
| **3** | **JWT Engine** | Membuat sistem token sebagai "ID Card" digital. |
| **4** | **Auth Handlers** | Membuat API `/api/register` dan `/api/login` di Backend. |
| **5** | **The Bouncer** | Memasang Middleware untuk mengunci akses API transaksi. |
| **6** | **The Frontend Gate** | Membangun halaman Login & Register yang estetik di Next.js. |
| **7** | **The Route Guard** | Memasang satpam di Frontend agar user tidak bisa masuk tanpa login. |
| **8** | **Data Isolation** | Mengunci database agar user hanya bisa melihat & mengedit datanya sendiri. |
| **9** | **Auth Context & Logout** | Sentralisasi status login dan pembuatan fitur keluar akun. |
| **10** | **UI/UX Branding** | Integrasi logo resmi Finastriva ke seluruh penjuru aplikasi. |

---

## 🛠️ Langkah Demi Langkah Analysis

### 🛠️ Langkah 1: Persiapan & Migrasi Database
Kita butuh tabel khusus untuk menyimpan kredensial pengguna. Password **WAJIB** disimpan dalam bentuk hash.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 🛠️ Langkah 2 & 3: Security Engine (Bcrypt & JWT)
Kami menggunakan **Bcrypt** untuk hashing password dan **JWT** untuk sesi pengguna.

```go
// 1. Hashing Password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// 2. Generate Token
func GenerateToken(username string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &jwt.RegisteredClaims{
		Subject:   username,
		ExpiresAt: jwt.NewNumericDate(expirationTime),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}
```

### 🛠️ Langkah 4 & 5: Handlers & Middleware (The Bouncer)
Backend kini memiliki satpam yang mengecek token di setiap request ke `/api/transactions`. Kami juga menambahkan **CORS Middleware** untuk menangani izin akses lintas domain secara terpusat. 

**Pro-Tip: Professional Error Handling & Response Consistency**
Agar Frontend tidak "meledak" saat terjadi error, kami menggunakan helper **`JSONError`**. Kami juga memastikan setiap response sukses mengirimkan header `Content-Type: application/json` secara eksplisit. Ini memastikan `res.json()` di Frontend selalu aman dari *SyntaxError* atau kegagalan deteksi format.

```go
// Helper: Selalu kirim error dalam format JSON
func JSONError(w http.ResponseWriter, message string, code int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(code)
    json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// CORSMiddleware: Menangani kebijakan CORS dengan Logging untuk Debugging
func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Printf("[%s] %s %s from %s\n", time.Now().Format("15:04:05"), r.Method, r.URL.Path, r.RemoteAddr)
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

---

## 🛠️ Troubleshooting: Common Security Issues

Dalam pengembangan sistem keamanan, kami menemukan beberapa kendala teknis yang umum terjadi:

### 1. Port 8080 Conflict (Zombie Process)
Jika kamu melihat error `bind: address already in use` saat menjalankan backend, atau Frontend menerima error `text/plain` padahal Backend sudah pakai `JSONError`, kemungkinan ada proses lama (zombie) yang masih mengunci port 8080.
*   **Solusi (Linux/Mac)**: Jalankan `lsof -i :8080` untuk mencari PID-nya, lalu `kill <PID>`.
*   **Penyebab**: Sering terjadi jika terminal ditutup paksa tanpa mematikan server dengan `Ctrl+C`.

### 2. SyntaxError: Unexpected character at line 1
Ini terjadi jika Frontend mencoba `res.json()` pada response yang bukan JSON (misal teks biasa "Unauthorized"). 
*   **Solusi**: Pastikan Backend *selalu* menggunakan `JSONError` dan Frontend selalu mengecek `contentType.includes("application/json")` sebelum melakukan parsing, seperti yang diimplementasikan di Langkah 6.

---

### 🛠️ Langkah 6: Membangun Gerbang Utama (Frontend Auth)
Halaman `frontend/app/auth/page.tsx` menangani Login dan Register secara dinamis dengan desain *Glassmorphism*. 

**Stabilitas Koneksi (Stability Hack):**
Gunakan `http://127.0.0.1:8080` di `.env.local` daripada `localhost`. Ini menghindari masalah resolusi IPv6 yang sering menyebabkan *NetworkError* di beberapa browser.

```tsx
// frontend/app/auth/page.tsx
const handleAuth = async (e: React.FormEvent) => {
  // ... fetch API ...
  // Selalu cek content-type sebelum res.json() untuk keamanan extra
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    // ... logic login ...
  } else {
    throw new Error("Server response is not JSON");
  }
};
```

### 🛠️ Langkah 7: The Route Guard (Satpam Frontend)
Komponen `AuthGuard` membungkus seluruh aplikasi di `layout.tsx`, memastikan user yang tidak punya token akan ditendang kembali ke halaman `/auth`.

**Penting:** Agar data muncul kembali, semua pemanggilan API `fetch` di Frontend sekarang menggunakan `token` dari **`useAuth()`** context untuk menyertakan token di header secara aman dan reaktif.

```tsx
// Contoh update fetch di page.tsx menggunakan useAuth()
const { token } = useAuth();
const res = await fetch("/api/transactions", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

### 🛠️ Langkah 8: Data Isolation (Privasi Mutlak)

Saat ini, meski sudah login, semua user masih melihat data transaksi yang sama. Kita perlu mengubah sistem agar **Rizky hanya melihat data Rizky**, dan **Budi hanya melihat data Budi**.

#### 8.1 Menghubungkan Transaksi ke User
Kita menambahkan kolom `user_id` di tabel `transactions` untuk mencatat siapa pemilik transaksi tersebut.

**SQL Migration:**
```sql
ALTER TABLE transactions ADD COLUMN user_id INTEGER REFERENCES users(id);
```

#### 8.2 Backend: Filter Berdasarkan Pemilik
Di `backend/main.go`, kita mengubah `AuthMiddleware` agar mengekstrak username dari Token dan meneruskannya ke Handler via Header `X-User-Name`. Setiap query CRUD (Create, Read, Update, Delete) sekarang menggunakan `WHERE user_id = ...`.

**Contoh Logic Ambil Data (GET):**
```go
query := `
    SELECT t.id, t.amount, t.description, t.type, t.created_at 
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    WHERE u.username = $1`
```

---

## 🛠️ Langkah 9: Auth Context & Logout (Sentralisasi State)

Saat ini kita mengecek `localStorage` secara manual di banyak tempat. Ini tidak efisien. Kita membuat **AuthContext** sebagai "Otak Sentral" keamanan di Frontend.

### 9.1 Membuat AuthContext
Dibuat file `frontend/app/context/AuthContext.tsx`. Sekarang, seluruh komponen bisa tahu siapa yang login hanya dengan memanggil `useAuth()`. Ini membuat data user bersifat global dan sinkron.

### 9.2 Implementasi Logout di Sidebar
Kita menambahkan tombol **Logout** di bagian bawah Sidebar yang akan menghapus "Gelang" (Token) dan mengembalikan user ke halaman login secara halus.

---

## 🛠️ Langkah 10: UI/UX Branding (Logo Integration)

Agar aplikasi terasa lebih "mahal" dan punya identitas unik, kita mulai menggunakan logo resmi `logo-finastriva.svg` yang sudah disiapkan.

### 10.1 Branding di Sidebar & Auth Page
Kita mengganti icon dompet standard dengan logo resmi di bagian atas Sidebar dan di tengah halaman Login. Ini memperkuat brand identity **Finastriva**.

```tsx
<Image 
  src="/logo-finastriva.svg" 
  alt="Finastriva Logo" 
  width={40} 
  height={40} 
/>
```

---

## 🧪 Hasil Pengujian Sistem (Testing)

Kami telah melakukan simulasi alur user baru dari awal sampai akhir:

1.  **Registrasi**: 
    *   **Aksi**: Mengirim data `{username: "rizky_tester", password: "..."}` ke `/api/register`.
    *   **Hasil**: `201 Created` - User berhasil terdaftar. ✅
2.  **Login**: 
    *   **Aksi**: Mengirim kredensial ke `/api/login`.
    *   **Hasil**: Mendapatkan Token JWT unik. ✅
3.  **Proteksi Data**:
    *   **Aksi**: Mengakses `/api/transactions` tanpa token.
    *   **Hasil**: `401 Unauthorized`. Backend menolak akses. ✅
4.  **Akses Sah**:
    *   **Aksi**: Mengakses `/api/transactions` dengan header `Authorization: Bearer <token>`.
    *   **Hasil**: Data transaksi muncul dengan aman. ✅
5.  **Frontend Guard**:
    *   **Aksi**: Membuka Dashboard tanpa login.
    *   **Hasil**: Otomatis dialihkan ke `/auth`. ✅

---

## 📌 Ringkasan Akhir Chapter 10

| Fitur Keamanan | Teknologi | Status |
| :--- | :--- | :--- |
| Password Hashing | Bcrypt (Cost 14) | ✅ |
| Digital ID Card | JWT (v5) | ✅ |
| The Bouncer | JWT Middleware | ✅ |
| The Frontend Gate | Next.js Auth Page | ✅ |
| The Route Guard | React Auth Component | ✅ |

✅ **Checkpoint Final Chapter 10:** Finastriva kini sepenuhnya privat, aman, dan profesional! 🚀
