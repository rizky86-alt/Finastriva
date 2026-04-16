# 🚀 Finastriva Fullstack Project

**Dokumentasi ini dibuat untuk tracking progres coding step-by-step.**

---

# 📘 Chapter 11 – The AI Hub: Gemini Integration

Selamat datang di **Chapter 11**. Setelah kita punya sistem keamanan yang solid di Chapter 10, sekarang saatnya kita memberikan "Otak" pada Finastriva. Kita akan mengintegrasikan **Google Gemini AI** untuk membantu kita menganalisis keuangan, memberikan saran investasi, dan menjawab pertanyaan seputar pengeluaran kita.

Aplikasi kita tidak lagi hanya mencatat, tapi juga bisa **berpikir**.

---

## 🗺️ Roadmap Chapter 11 (The Intelligence Journey)

| Langkah | Fokus Utama | Deskripsi |
| :--- | :--- | :--- |
| **1** | **Gemini API Setup** | Mendapatkan API Key dan konfigurasi SDK di Backend. |
| **2** | **AI Agent Logic** | Membangun instruksi (System Prompt) untuk asisten keuangan. |
| **3** | **Backend AI Route** | Membuat API `/api/ai/chat` untuk berkomunikasi dengan Gemini. |
| **4** | **Context Feeding** | Mengirimkan data transaksi (arsip) ke AI agar AI tahu kondisi keuangan kita. |
| **5** | **The AI Interface** | Membangun UI Chat yang futuristik di halaman **AI Hub**. |
| **6** | **Streaming Responses** | (Opsional) Implementasi efek mengetik AI yang *real-time*. |

---

## 🧪 Langkah Demi Langkah Implementation

### 🛠️ Langkah 1: Persiapan API Key
Kita menggunakan `GEMINI_API_KEY` dari Google AI Studio. Di backend Go, kita menggunakan SDK `github.com/google/generative-ai-go/genai` untuk berkomunikasi dengan model `gemini-1.5-flash`.

### 🛠️ Langkah 2: Context Feeding (The "Brain")
AI diberikan konteks berupa 15 transaksi terakhir user. Ini diformat menjadi teks naratif agar Gemini bisa memahami pola pengeluaran user sebelum menjawab pertanyaan.

### 🛠️ Langkah 3: Testing via Postman
Sebelum membangun UI, kita wajib mengetes API secara manual untuk memastikan AuthMiddleware dan Gemini Integration berjalan lancar.

**Step-by-step Testing:**
1. **Login**: Ambil token JWT dari `POST /api/login`.
2. **Setup Request**: Buat request `POST` ke `http://localhost:8080/api/ai/ask`.
3. **Authorization**: Tambahkan header `Authorization: Bearer <TOKEN>`.
4. **Body**: Kirim JSON `{"question": "Analisis pengeluaranku bulan ini"}`.

### 🛠️ Langkah 4: The AI Interface (Frontend)
Membangun halaman `/hub` dengan fitur:
- **Glassmorphic Chat Bubble**: Desain modern dengan pemisahan warna antara user dan AI.
- **Loading State**: Indikator "Oracle is thinking..." saat menunggu respon Gemini.
- **Quick Suggestions**: Tombol cepat untuk pertanyaan umum.
- **Auto-scroll**: Chat otomatis scroll ke bawah saat ada pesan baru.

---

## 📌 Status Saat Ini

- [x] Gemini API Integration: **Complete**
- [x] Context Feeding: **Active**
- [x] AI Chat UI: **Deployed**
- [x] Security (Auth Guard): **Verified**

✅ **Checkpoint Final Chapter 11:** Finastriva kini memiliki asisten keuangan cerdas yang siap membantu user mengelola aset mereka! 🚀
