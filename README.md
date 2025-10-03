# Dokumentasi Koneksi Database pada Next.js API

Proyek ini merupakan contoh implementasi koneksi database MySQL dengan API Next.js menggunakan App Router.

## Daftar Isi

- [Struktur Proyek](#struktur-proyek)
- [Konfigurasi Database](#konfigurasi-database)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Cara Kerja Koneksi Database](#cara-kerja-koneksi-database)
- [Endpoint API Pegawai](#endpoint-api-pegawai)
- [Pengujian API](#pengujian-api)

## Struktur Proyek

```
src/
├── app/
│   ├── api/
│   │   └── pegawai/
│   │       ├── route.js         # Endpoint untuk semua pegawai
│   │       └── [id]/
│   │           └── route.js     # Endpoint untuk pegawai berdasarkan ID
│   └── pegawai/
│       └── page.js              # Halaman frontend untuk pegawai
├── lib/
│   └── db.js                    # Konfigurasi koneksi database
└── scripts/
    └── init-db.js               # Script inisialisasi database

```

## Konfigurasi Database

Proyek ini menggunakan database MySQL dengan konfigurasi sebagai berikut:

### Dependensi

- `mysql2`: Driver MySQL untuk Node.js
- `next`: Framework Next.js

### Variabel Lingkungan (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_name
```

### Konfigurasi Koneksi (src/lib/db.js)

```javascript
import mysql from "mysql2/promise";

// Membuat pool koneksi MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pegawai_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
```

## Instalasi dan Setup

1. **Clone repositori dan instal dependensi:**

```bash
npm install
```

2. **Konfigurasi database:**

   - Pastikan MySQL server sudah berjalan
   - Sesuaikan variabel lingkungan di file `.env` sesuai konfigurasi database Anda

3. **Inisialisasi database:**

```bash
npm run init-db
```

Perintah ini akan:

- Membuat database jika belum ada
- Membuat tabel `pegawai` jika belum ada
- Menambahkan data sampel jika tabel kosong

4. **Jalankan server pengembangan:**

```bash
npm run dev
```

Server akan berjalan di [http://localhost:3000](http://localhost:3000)

## Cara Kerja Koneksi Database

### 1. Pembuatan Pool Koneksi

Di file [src/lib/db.js](file:///c%3A/Users/Brian/Desktop/all%20progress%20code/Brian%20project/latihan/next_js_calling_api/test_calling_api/src/lib/db.js), kita membuat pool koneksi MySQL menggunakan `mysql2/promise`. Pool koneksi memungkinkan kita untuk menggunakan koneksi secara efisien tanpa perlu membuat koneksi baru setiap kali ada permintaan.

Keuntungan menggunakan pool koneksi:

- Mengurangi overhead pembuatan koneksi baru
- Memungkinkan penggunaan koneksi secara bersamaan
- Mengatur batas maksimum koneksi

### 2. Penggunaan Koneksi dalam API Routes

Dalam setiap endpoint API, kita mengikuti pola berikut:

```javascript
// Mendapatkan koneksi dari pool
const connection = await db.getConnection();

try {
  // Melakukan query database
  const [rows] = await connection.query("SELECT * FROM pegawai");

  // Mengembalikan response
  return NextResponse.json(rows);
} catch (error) {
  // Menangani error
  console.error("Error:", error);
  return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
} finally {
  // Melepaskan koneksi kembali ke pool
  connection.release();
}
```

Langkah-langkah penting:

1. **Mendapatkan koneksi**: `await db.getConnection()`
2. **Melakukan query**: `await connection.query()`
3. **Melepaskan koneksi**: `connection.release()` untuk mengembalikan koneksi ke pool

### 3. Penanganan Error

Setiap operasi database dibungkus dalam blok try-catch untuk menangani kemungkinan error koneksi atau query.

## Endpoint API Pegawai

### 1. Mendapatkan Semua Pegawai

- **URL**: `/api/pegawai`
- **Method**: GET
- **Response**: Array berisi semua data pegawai

### 2. Membuat Pegawai Baru

- **URL**: `/api/pegawai`
- **Method**: POST
- **Body**:
  ```json
  {
    "nm_pegawai": "Nama Pegawai",
    "alamat_pegawai": "Alamat Pegawai",
    "tgl_lahir_pegawai": "YYYY-MM-DD",
    "id_m_status_pegawai": 1
  }
  ```
- **Response**: Data pegawai yang berhasil dibuat

### 3. Mendapatkan Pegawai Berdasarkan ID

- **URL**: `/api/pegawai/[id]`
- **Method**: GET
- **Response**: Data pegawai dengan ID yang sesuai

### 4. Memperbarui Pegawai

- **URL**: `/api/pegawai/[id]`
- **Method**: PUT
- **Body**: Data pegawai yang ingin diperbarui
- **Response**: Data pegawai yang telah diperbarui

### 5. Menghapus Pegawai

- **URL**: `/api/pegawai/[id]`
- **Method**: DELETE
- **Response**: Pesan konfirmasi penghapusan

## Pengujian API

Anda dapat menguji API menggunakan tools seperti Postman, curl, atau langsung melalui halaman web di [http://localhost:3000/pegawai](http://localhost:3000/pegawai).

### Contoh Pengujian dengan curl

1. **Mendapatkan semua pegawai:**

   ```bash
   curl http://localhost:3000/api/pegawai
   ```

2. **Membuat pegawai baru:**

   ```bash
   curl -X POST http://localhost:3000/api/pegawai \
        -H "Content-Type: application/json" \
        -d '{"nm_pegawai":"Budi Santoso","alamat_pegawai":"Jakarta","tgl_lahir_pegawai":"1990-01-01","id_m_status_pegawai":1}'
   ```

3. **Mendapatkan pegawai dengan ID 1:**

   ```bash
   curl http://localhost:3000/api/pegawai/1
   ```

4. **Memperbarui pegawai dengan ID 1:**

   ```bash
   curl -X PUT http://localhost:3000/api/pegawai/1 \
        -H "Content-Type: application/json" \
        -d '{"nm_pegawai":"Budi Santoso Updated","alamat_pegawai":"Bandung","tgl_lahir_pegawai":"1990-01-01","id_m_status_pegawai":1}'
   ```

5. **Menghapus pegawai dengan ID 1:**
   ```bash
   curl -X DELETE http://localhost:3000/api/pegawai/1
   ```

## Troubleshooting

### Masalah Koneksi Database

1. **Pastikan MySQL server berjalan**
2. **Periksa kredensial database di file .env**
3. **Verifikasi bahwa database dan tabel telah dibuat dengan menjalankan `npm run init-db`**

### Masalah Umum

- Jika mendapat error "ER_ACCESS_DENIED_ERROR", periksa kembali username dan password database
- Jika mendapat error "ECONNREFUSED", pastikan MySQL server sedang berjalan
- Jika tidak ada data yang ditampilkan, pastikan tabel telah terisi dengan menjalankan script inisialisasi

## Lisensi

Proyek ini merupakan contoh implementasi untuk pembelajaran dan dapat dimodifikasi sesuai kebutuhan.
