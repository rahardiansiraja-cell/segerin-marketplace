# SEGARIN – Fresh Market

Website marketplace demo seafood dan sayuran segar. Dibuat dengan HTML, CSS, dan JavaScript tanpa proses build.

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser, atau unggah seluruh isi folder ke hosting static.
3. Untuk uji lokal yang lebih baik, jalankan server static seperti `python -m http.server 8000` lalu buka `http://localhost:8000`.

## Deploy gratis ke Vercel
1. Buat akun Vercel dan akun GitHub.
2. Buat repository baru, unggah semua file dari folder ini.
3. Di Vercel pilih **Add New → Project**, impor repository tersebut.
4. Framework preset pilih **Other**, Build Command kosong, Output Directory `.`.
5. Klik Deploy. Vercel akan memberi URL publik `*.vercel.app`.

Alternatif: unggah folder ke Netlify Drop atau hosting static lain.

## Fitur demo
- Katalog, pencarian, filter kategori.
- Keranjang dan kalkulasi subtotal.
- Form checkout demo.
- Area pembeli, dashboard penjual untuk menambah produk, dashboard admin ringkas.
- Data demo disimpan di localStorage browser.

## Penting sebelum menerima transaksi sungguhan
Versi ini adalah frontend prototipe. Login/role belum aman, data hanya tersimpan pada browser masing-masing, pesanan tidak terkirim ke server, dan pembayaran/pengiriman belum terintegrasi. Untuk produksi, hubungkan backend/database (misalnya Supabase), autentikasi dan otorisasi server-side, payment gateway resmi, serta layanan kurir. Jangan gunakan mode demo sebagai sistem transaksi nyata.
