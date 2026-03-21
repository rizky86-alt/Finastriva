# 🚀 Finastriva Fullstack Project

Dokumentasi ini dibuat untuk **tracking progres coding step-by-step** dan penggunaan Git di project **Finastriva**.  
Cocok untuk mahasiswa *Engineering* yang ingin melihat perkembangan kode secara bertahap saat memprompt AI.



---
# 📘 Chapter 2 – Git Workflow & Panduan Lengkap

GitHub adalah “nyawa” kedua kamu. Kalau laptop tiba-tiba bermasalah, kodingan sudah aman di cloud.  
Dokumentasi ini memandu kamu step-by-step setup Git untuk project **Finastriva** di Windows, lengkap dengan tips merge dan remote.

---

## 1️⃣ Buat Repository di GitHub






1. Buka [github.com](https://github.com) dan login.
2. Klik tombol **New** (hijau) untuk buat repository baru.
3. Beri nama repository: `finastriva`.
4. Pilih **Public** atau **Private**.
5. **PENTING:** Jangan centang “Add a README” atau `.gitignore`.

> **Checkpoint Git 1:** Repository GitHub siap, belum ada commit.

---

## 2️⃣ Inisialisasi Git di Laptop

Buka terminal (CMD/PowerShell) di folder project `finastriva`:

```powershell id="4b2k9p"
cd C:\Users\Hype GLK\Documents\finastriva

# Inisialisasi folder sebagai repository Git
git init

# Tambahkan semua file (Frontend & Backend)
git add .

# Commit pertama
git commit -m "Initial commit: Setup NVM, Next.js Frontend and Golang Backend"
````

> **Catatan:** Jika muncul warning LF → CRLF di Windows, normal.
> Solusi otomatis:



```powershell id="ox7m2t"
git config core.autocrlf true
```

> **Checkpoint Git 2:** Semua file sudah di-commit pertama.

---

## 3️⃣ Menentukan identitas Git


Karena ini repo lokal, pakai **identitas lokal** saja:





```powershell id="8yp0qr"
git config user.name "nama_kamu"
git config user.email "example46@gmail.com"

# Cek konfigurasi
git config --list
```

> **Checkpoint Git 3:** Identitas Git untuk repo ini sudah diset.




---

## 4️⃣ Hubungkan ke GitHub

Ambil URL remote repository (`https://github.com/rizky86-alt/Finastriva.git`) lalu jalankan:

```powershell id="5kt1mz"
git branch -M main
git remote add origin https://github.com/rizky86-alt/Finastriva.git
git push -u origin main
```

> **Catatan:** Gunakan username + GitHub Personal Access Token (PAT) jika diminta login.
> `-u` menyetel upstream branch sehingga push berikutnya cukup `git push`.

> **Checkpoint Git 4:** Repo lokal sudah terhubung ke GitHub.

---

## 5️⃣ Menangani remote yang sudah ada commit

Jika push gagal karena remote sudah memiliki commit:

```text id="d4h7qk"
! [rejected] main -> main (fetch first)
```

Solusi aman:

```powershell id="p1t8xu"
git pull origin main --allow-unrelated-histories
# VS Code terbuka untuk tulis message merge
git push -u origin main
```

> Alternatif menimpa remote (HATI-HATI, commit remote akan hilang):

```powershell id="l2x7ab"
git push -u origin main --force
```

> **Checkpoint Git 5:** Merge atau force push berhasil.




---

## 6️⃣ Merge commit

* Saat `git pull` terjadi merge, editor VS Code terbuka.
* Bisa pakai **message default** atau tulis pesan sendiri.
* Simpan → tutup editor → merge selesai → push ke remote.

> **Checkpoint Git 6:** Merge selesai, repo siap sinkron dengan remote.

---

## 7️⃣ Tips penting

* Pastikan `.gitignore` mengabaikan folder **node_modules**.
* Commit secara rutin agar bisa rollback jika terjadi error.
* Workflow aman di Windows:

```powershell id="b3k6vy"
git add .
git commit -m "pesan commit"
git pull origin main --allow-unrelated-histories
git push origin main
```

> Gunakan `--allow-unrelated-histories` **hanya untuk merge pertama kali** dengan remote yang sudah ada commit.




---

## 8️⃣ Ringkasan Alur Git Finastriva

1. Buat repository di GitHub → jangan isi README
2. Init Git lokal → `git init`
3. Set identitas lokal → `git config user.name/email`
4. Add & commit → `git add .` + `git commit -m "..."`
5. Hubungkan remote → `git remote add origin <URL>`
6. Atur branch main → `git branch -M main`
7. Push ke GitHub → `git push -u origin main`
8. Jika remote sudah ada commit → pull + merge → push

---

> ✅ **Checkpoint final:** Repo lokal & remote sudah sinkron. Git siap dipakai untuk pengembangan selanjutnya.


