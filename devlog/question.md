Jelaskan Alasan penggunaan struktur dan metode tertentu pada website ini

Meskipun analisis mendalam menggunakan `codebase_investigator` tidak dapat diselesaikan karena batas waktu, kita dapat menyimpulkan alasan umum di balik penggunaan struktur dan metode tertentu pada *website* ini berdasarkan konteks yang tersedia dan praktik pengembangan modern:

**1. Frontend (Next.js, React, TypeScript):**
*   **Next.js:**
    *   **Framework React Terpadu:** Next.js menyediakan kerangka kerja yang kuat di atas React, menyederhanakan banyak aspek pengembangan aplikasi *web* modern.
    *   **Rendering Fleksibel:** Mendukung *Server-Side Rendering* (SSR), *Static Site Generation* (SSG), dan *Incremental Static Regeneration* (ISR). Ini memungkinkan optimasi performa dan SEO yang signifikan. SSR sangat berguna untuk halaman yang membutuhkan data dinamis saat dimuat, sementara SSG ideal untuk konten statis.
    *   **Pola Penamaan Konvensional:** Struktur direktori seperti `app/` (mengindikasikan penggunaan App Router) dan `components/` mengikuti pola yang direkomendasikan Next.js, mempromosikan keteraturan dan kemudahan navigasi.
    *   **API Routes:** Kemampuan untuk membangun API *backend* langsung di dalam proyek *frontend* (meskipun dalam proyek ini ada *backend* terpisah, ini tetap merupakan fitur Next.js).
*   **React:**
    *   **Arsitektur Berbasis Komponen:** Memungkinkan pembangunan UI yang modular, dapat digunakan kembali, dan mudah dikelola. Setiap komponen memiliki logika dan tampilannya sendiri.
    *   **Virtual DOM:** React's Virtual DOM dan algoritma rekonsiliasinya secara efisien memperbarui DOM aktual hanya jika diperlukan, menghasilkan pembaruan UI yang performan.
    *   **Ecosystem:** Ekosistem pustaka dan alat yang luas mendukung pengembangan React, mempercepat proses pengembangan.
*   **TypeScript:**
    *   **Deteksi Kesalahan Dini:** Menambahkan lapisan keamanan tipe statis pada JavaScript. Ini membantu menangkap kesalahan umum (seperti kesalahan pengetikan atau penggunaan variabel yang salah) pada waktu kompilasi, bukan saat *runtime*, sehingga meningkatkan keandalan dan mengurangi *bug*.
    *   **Pemeliharaan & Keterbacaan yang Ditingkatkan:** Definisi tipe yang eksplisit membuat kode lebih mudah dipahami oleh pengembang, terutama dalam proyek besar atau saat onboarding anggota tim baru. Ini berfungsi sebagai bentuk dokumentasi mandiri.
    *   **Perkakas yang Ditingkatkan:** Otomatisasi penyelesaian kode, kemampuan refactoring, dan navigasi kode yang lebih baik di IDE.

**2. Backend (Go):**
*   **Performa & Efisiensi:** Go dikompilasi ke kode mesin, menawarkan performa mendekati *native*. Pengumpul sampahnya yang efisien dan model konkurensi yang ringan (goroutines) menjadikannya pilihan yang ideal untuk membangun layanan *backend* berkinerja tinggi, terutama untuk aplikasi dengan banyak permintaan atau komputasi intensif.
*   **Konkurensi:** Dukungan bawaan Go untuk konkurensi (goroutines dan channels) memudahkan penulisan kode yang dapat menangani banyak tugas secara bersamaan (konkuren) dengan efisien, sangat cocok untuk melayani banyak permintaan HTTP secara paralel.
*   **Pustaka Standar yang Kuat:** Pustaka standar Go kaya, termasuk dukungan yang baik untuk jaringan (HTTP), penguraian JSON, kriptografi, dan I/O, mengurangi ketergantungan pada pustaka eksternal untuk fungsionalitas inti. Ini menghasilkan dasar yang lebih stabil dan aman.
*   **Kesederhanaan & Keterbacaan:** Sintaks Go relatif sederhana dan tidak terlalu bertele-tele dibandingkan banyak bahasa lain, berkontribusi pada keterbacaan kode dan kemudahan pemeliharaan.
*   **Pengetikan Statis:** Mirip dengan TypeScript, pengetikan statis di Go membantu menangkap kesalahan lebih awal dan meningkatkan pemeliharaan kode.

**3. Metode Keamanan (Contoh: bcrypt):**
*   **Standar Industri untuk Hashing Kata Sandi:** Bcrypt adalah algoritma yang diakui secara luas dan direkomendasikan untuk *hashing* kata sandi yang aman.
*   **Ketahanan terhadap Serangan:**
    *   **Salt:** Bcrypt secara otomatis menghasilkan dan menyertakan *salt* unik untuk setiap *hash* kata sandi. Ini mencegah serangan komputasi awal (seperti *rainbow tables*) karena kata sandi yang identik sekalipun akan menghasilkan *hash* yang berbeda.
    *   **Work Factor (Cost):** Faktor biaya yang dapat disesuaikan (`14` dalam `$2a$14$...`) membuat *hashing* menjadi mahal secara komputasi. Ini sengaja memperlambat proses *hashing*, membuat serangan *brute-force* menjadi tidak praktis dalam jangka waktu yang wajar, bahkan dengan perangkat keras yang kuat.
    *   **Ketahanan terhadap Timing Attack:** Fungsi `bcrypt.CompareHashAndPassword` menggunakan algoritma perbandingan *constant-time*, mencegah penyerang mendapatkan informasi berdasarkan perbedaan waktu eksekusi yang sangat kecil selama verifikasi kata sandi.
*   **Prioritas Integritas Data:** Penggunaan metode yang kuat seperti ini menunjukkan komitmen kuat untuk melindungi data pengguna dan menjaga integritas sistem.

**4. Struktur Proyek dan Organisasi:**
*   **Pemisahan Tanggung Jawab (Frontend/Backend):** Memiliki direktori terpisah untuk `frontend/` dan `backend-go/` adalah praktik umum yang mempromosikan pemisahan tanggung jawab (Separation of Concerns). Ini memudahkan pengembangan, pengujian, dan penerapan kedua bagian aplikasi secara independen.
*   **Konvensi Direktori:** Mengikuti struktur konvensional (misalnya, `components/`, `lib/`, `app/` di *frontend*; `main.go`, file *handler* spesifik di *backend*) membuat basis kode dapat diprediksi dan lebih mudah dinavigasi oleh pengembang. Ini sesuai dengan pola umum di proyek Next.js dan Go.
*   **Modularitas:** Mengorganisir kode ke dalam modul atau komponen (misalnya, `components/AnalyticsCard.tsx`, `backend-go/db_verify.go`) mempromosikan penggunaan kembali dan mengisolasi fungsionalitas, membuat sistem lebih mudah dipelihara dan diuji.

**Kesimpulan Umum:**
Kombinasi teknologi dan metodologi ini menunjukkan pendekatan yang mengutamakan performa, skalabilitas, produktivitas pengembang, pemeliharaan, dan yang terpenting, keamanan. Pilihan-pilihan ini lazim untuk aplikasi *web* modern yang bertujuan untuk keandalan dan pengalaman pengguna yang baik.