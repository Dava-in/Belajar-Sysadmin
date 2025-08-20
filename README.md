# Belajar — Roadmap Sysadmin (Final)

Website statis modern & interaktif:
- Roadmap 30 hari dengan progress, pencarian, filter per minggu.
- Sub-halaman: **Materi**, **Catatan**, **Tools**, **Final Project**.
- Dark/Light mode, semua state disimpan di `localStorage`.

## Struktur
- `index.html` — halaman utama "Belajar"
- `styles.css` — gaya tampilan
- `script.js` — logika UI untuk index
- `data.js` — data roadmap (berbahasa Indonesia)
- `materi.html` — kumpulan link dari seluruh roadmap
- `catatan.html` — editor catatan pribadi (localStorage)
- `tools.html` — cheatsheet command Linux
- `project.html` — final project + checklist
- `README.md` — panduan

## Deploy
### Vercel (direkomendasikan)
1. Buat repo GitHub baru, upload semua file ini di root (tanpa folder build).
2. Masuk **vercel.com** → **Add New Project** → Import dari repo GitHub-mu.
3. **Framework Preset**: *Other*. **Build Command**: kosongkan. **Output Dir**: `.`
4. Deploy. Hasilnya berupa domain `*.vercel.app`.

### Netlify
1. **New site from Git** → pilih repo → **Build command** kosong, **Publish directory**: `.`
2. Deploy.

### GitHub Pages
1. Commit semua file ke branch `main`.
2. Settings → Pages → Source: `Deploy from a branch`, pilih `main` dan folder `/ (root)`.
3. Tunggu sampai live di `https://<username>.github.io/<repo>/`.

## Sub‑domain
Untuk memetakan sub-halaman ke sub-domain:
- `materi.domanemu.com` → arahkan CNAME ke domain hosting (mis. Vercel/Netlify).
- Buat **redirect** (optional) apabila ingin path root sub-domain menampilkan halaman tertentu:
  - Vercel: buat project terpisah yang berisi file `materi.html` sebagai `index.html` (rename), atau gunakan rewrite rules.
  - Alternatif mudah: buat 4 project terpisah, masing-masing berisi satu file utama (`index.html`) yang menyalin isi dari `materi.html`/`catatan.html`/dst.

Selamat belajar! 🚀
