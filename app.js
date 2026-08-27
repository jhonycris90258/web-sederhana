const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Penyimpanan data sementara di memori server
let riwayatLokasi = []; // Berbentuk array untuk history
let daftarAplikasi = [];
let galeriFoto = [];
let logWhatsApp = [];

// Halaman Utama: Dashboard Lengkap Orang Tua
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Dashboard Ultimate</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { font-family: Arial, sans-serif; padding: 15px; background: #f4f4f9; color: #333; }
                    h2, h3 { color: #007bff; text-align: center; }
                    .card { background: white; padding: 15px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow-x: auto; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; font-size: 14px; }
                    th { background: #007bff; color: white; }
                    .badge { background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                </style>
            </head>
            <body>
                <h2>🛡️ Dashboard </h2>

                <!-- TABEL HISTORY LOKASI -->
                <div class="card">
                    <h3>📍 History Lokasi GPS</h3>
                    <table>
                        <tr><th>Waktu</th><th>Latitude, Longitude</th><th>Peta</th></tr>
                        ${riwayatLokasi.length === 0 ? '<tr><td colspan="3">Belum ada history lokasi</td></tr>' : 
                          riwayatLokasi.map(item => `
                            <tr>
                                <td>${item.waktu}</td>
                                <td>${item.lat}, ${item.lon}</td>
                                <td><a href="https://maps.google.com/?q=${item.lat},${item.lon}" target="_blank">Buka Peta</a></td>
                            </tr>`).join('')}
                    </table>
                </div>

                <!-- TABEL APLIKASI TER-INSTALL -->
                <div class="card">
                    <h3>📦 Aplikasi Ter-install di HP Anak</h3>
                    <table>
                        <tr><th>Nama Aplikasi</th><th>Versi / Keterangan</th></tr>
                        ${daftarAplikasi.length === 0 ? '<tr><td colspan="2">Belum ada data aplikasi</td></tr>' : 
                          daftarAplikasi.map(app => `
                            <tr><td>${app.nama}</td><td><span class="badge">${app.keterangan || 'Aktif'}</span></td></tr>`).join('')}
                    </table>
                </div>

                <!-- GALERI FOTO -->
                <div class="card">
                    <h3>🖼️ Galeri / Tangkapan Layar</h3>
                    <p>${galeriFoto.length === 0 ? 'Belum ada foto yang diunggah.' : galeriFoto.map(f => `<img src="${f.url}" width="100" style="margin:5px; border-radius:4px;">`).join('')}</p>
                </div>

                <!-- LOG WHATSAPP -->
                <div class="card">
                    <h3>💬 Log / Aktivitas WhatsApp</h3>
                    <table>
                        <tr><th>Waktu</th><th>Kontak / Pesan</th></tr>
                        ${logWhatsApp.length === 0 ? '<tr><td colspan="2">Belum ada log WhatsApp</td></tr>' : 
                          logWhatsApp.map(w => `
                            <tr><td>${w.waktu}</td><td><b>${w.kontak}:</b> ${w.pesan}</td></tr>`).join('')}
                    </table>
                </div>
            </body>
        </html>
    `);
});

// --- ENDPOINT API PENERIMA DATA DARI HP ANAK ---

// 1. Kirim Lokasi
app.post('/api/lapor-lokasi', (req, res) => {
    const { lat, lon } = req.body;
    if (lat && lon) {
        riwayatLokasi.unshift({ lat, lon, waktu: new Date().toLocaleTimeString() });
        if (riwayatLokasi.length > 20) riwayatLokasi.pop(); // Batasi 20 history terakhir
        res.json({ status: 'success', pesan: 'History lokasi dicatat' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Lat & lon diperlukan' });
    }
});

// 2. Kirim Daftar Aplikasi
app.post('/api/lapor-apk', (req, res) => {
    const { apps } = req.body; // Menerima array list aplikasi
    if (apps && Array.isArray(apps)) {
        daftarAplikasi = apps;
        res.json({ status: 'success', pesan: 'Daftar aplikasi diperbarui' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Format apps harus array' });
    }
});

// 3. Kirim Log WhatsApp
app.post('/api/lapor-wa', (req, res) => {
    const { kontak, pesan } = req.body;
    if (kontak && pesan) {
        logWhatsApp.unshift({ kontak, pesan, waktu: new Date().toLocaleTimeString() });
        res.json({ status: 'success', pesan: 'Log WhatsApp direkam' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Kontak & pesan diperlukan' });
    }
});

app.listen(PORT, () => {
    console.log(`Server dashboard berjalan di port ${PORT}`);
});
