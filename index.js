const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/daftar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'daftar.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'rahasia123') {
        res.redirect('/dashboard');
    } else {
        res.send('<script>alert("Login Gagal! Username atau Password salah."); window.location="/";</script>');
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Template HTML untuk Halaman Fitur (Tema Gelap & Elegan)
function renderFiturPage(title, icon, content) {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0f172a, #1e293b);
                margin: 0;
                padding: 20px;
                color: #f8fafc;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .card {
                background: #1e293b;
                color: #f8fafc;
                width: 100%;
                max-width: 600px;
                padding: 35px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                border: 1px solid #334155;
            }
            h2 { margin-top: 0; color: #f8fafc; display: flex; align-items: center; gap: 10px; }
            p { color: #94a3b8; line-height: 1.6; }
            .content-box {
                background: #0f172a;
                border: 1px solid #334155;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            a.btn-back {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3b82f6;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                transition: background 0.2s;
            }
            a.btn-back:hover { background-color: #2563eb; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>${icon} ${title}</h2>
            <div class="content-box">
                ${content}
            </div>
            <a href="/dashboard" class="btn-back">← Kembali ke Dashboard</a>
        </div>
    </body>
    </html>
    `;
}

// Endpoint Detail Fitur dengan Desain Baru
app.get('/dashboard/lokasi', (req, res) => {
    res.send(renderFiturPage('Peta Lokasi Perangkat', '📍', '<p>Status: Perangkat terdeteksi aktif.</p><p>Koordinat: -6.2088, 106.8456 (Jakarta)</p><p><i>Fitur pelacakan GPS real-time siap dihubungkan.</i></p>'));
});

app.get('/dashboard/riwayat-web', (req, res) => {
    res.send(renderFiturPage('Riwayat Website', '🌐', '<p>Daftar situs yang baru saja dikunjungi oleh perangkat anak:</p><ul><li>google.com - 01:30 WIB</li><li>youtube.com - 01:15 WIB</li></ul>'));
});

app.get('/dashboard/galeri', (req, res) => {
    res.send(renderFiturPage('Galeri Foto', '🖼️', '<p>Penyimpanan foto perangkat anak tersinkronisasi.</p><p><i>Belum ada foto baru yang diunggah hari ini.</i></p>'));
});

app.get('/dashboard/whatsapp', (req, res) => {
    res.send(renderFiturPage('Pantau WhatsApp', '💬', '<p>Pemantauan aktivitas pesan masuk dan keluar.</p><p>Status: Layanan pemantauan siaga.</p>'));
});

app.get('/dashboard/apk-install', (req, res) => {
    res.send(renderFiturPage('APK Install (Aplikasi)', '📱', '<p>Daftar aplikasi yang terpasang di HP anak:</p><ul><li>WhatsApp (v2.26)</li><li>YouTube (v19.1)</li><li>Instagram (v310.0)</li></ul>'));
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
