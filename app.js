const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Data penyimpanan sementara
let dataPantau = {
    lat: 'Belum ada data',
    lon: 'Belum ada data',
    waktu: 'Belum ada data'
};

// Halaman utama (Tampilan Tabel Dashboard untuk Orang Tua)
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Dashboard Pantau Anak</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f4f4f9; }
                    table { width: 100%; max-width: 500px; margin: 20px auto; border-collapse: collapse; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
                    th, td { padding: 12px 15px; border-bottom: 1px solid #ddd; text-align: left; }
                    th { background: #007bff; color: white; }
                    h2 { color: #333; }
                </style>
            </head>
            <body>
                <h2>📱 Dashboard Pantau Anak</h2>
                <table>
                    <tr>
                        <th>Informasi</th>
                        <th>Keterangan</th>
                    </tr>
                    <tr>
                        <td><b>Latitude (GPS)</b></td>
                        <td>${dataPantau.lat}</td>
                    </tr>
                    <tr>
                        <td><b>Longitude (GPS)</b></td>
                        <td>${dataPantau.lon}</td>
                    </tr>
                    <tr>
                        <td><b>Waktu Update</b></td>
                        <td>${dataPantau.waktu}</td>
                    </tr>
                </table>
                <p><small>Halaman ini akan mencatat data dari HP anak secara otomatis.</small></p>
            </body>
        </html>
    `);
});

// Endpoint untuk HP Anak mengirim data (POST)
app.post('/api/lapor', (req, res) => {
    const { lat, lon } = req.body;
    if (lat && lon) {
        dataPantau.lat = lat;
        dataPantau.lon = lon;
        dataPantau.waktu = new Date().toLocaleString();
        res.json({ status: 'success', pesan: 'Data lokasi berhasil direkam!' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Data lat dan lon wajib diisi!' });
    }
});

// Endpoint API jika ingin dibaca dalam bentuk JSON
app.get('/api/pantau', (req, res) => {
    res.json(dataPantau);
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
