const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rahasia123'; 
const activeSessions = new Set();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    standardHeaders: true,
    legacyHeaders: false,
    message: '⚠️ Terlalu banyak percobaan login yang gagal. Silakan coba lagi setelah 15 menit.'
});

let riwayatLokasi = []; 
let daftarAplikasi = [];
let galeriFoto = [];
let logWhatsApp = [];

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
                    color: #1e293b; margin: 0; padding: 20px;
                    display: flex; justify-content: center; align-items: center; min-height: 100vh;
                }
                .login-card {
                    background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(16px);
                    border-radius: 20px; padding: 35px 30px; width: 100%; max-width: 380px;
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3); text-align: center;
                }
                .icon-shield { font-size: 40px; margin-bottom: 10px; }
                h2 { margin: 0 0 5px 0; color: #0f172a; font-size: 22px; }
                p { font-size: 13px; color: #64748b; margin-bottom: 25px; }
                input[type="password"] {
                    width: 100%; padding: 14px 16px; border: 1.5px solid #cbd5e1;
                    border-radius: 12px; font-size: 14px; box-sizing: border-box; outline: none; background: #f8fafc;
                }
                button {
                    background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none;
                    width: 100%; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); margin-top: 18px;
                }
                .error { background: #fee2e2; color: #991b1b; font-size: 12px; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="login-card">
                <div class="icon-shield">🛡️</div>
                <h2>Parental Control</h2>
                <p>Masukkan sandi rahasia untuk mengakses pusat pantauan perangkat anak.</p>
                ${req.query.error ? '<div class="error">⚠️ Kata sandi salah, silakan coba lagi.</div>' : ''}
                <form action="/api/login" method="POST">
                    <input type="password" name="password" placeholder="Kata Sandi Admin" required autofocus>
                    <button type="submit">Masuk ke Dashboard</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/api/login', loginLimiter, (req, res) => {
    const { password } = req.body;
    const inputBuffer = Buffer.from(password || '');
    const realPasswordBuffer = Buffer.from(ADMIN_PASSWORD);
    
    let isValid = false;
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

app.get('/logout', (req, res) => {
    const { token } = req.query;
    if (token) activeSessions.delete(token);
    res.redirect('/login');
});

function requireAuth(req, res, next) {
    const token = req.query.token;
    if (token && activeSessions.has(token)) {
        req.userToken = token;
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', requireAuth, (req, res) => {
    const token = req.userToken;
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head><title>Dashboard</title></head>
        <body style="font-family:sans-serif; text-align:center; padding:50px;">
            <h1>🎉 Berhasil Masuk ke Dashboard!</h1>
            <p>Sistem keamanan berjalan normal.</p>
            <a href="/logout?token=${token}" style="background:red; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Keluar</a>
        </body>
        </html>
    `);
});

// Endpoint pelaporan data...
app.post('/api/lapor-lokasi', (req, res) => {
    const { lat, lon } = req.body;
    if (lat && lon) {
        riwayatLokasi.unshift({ lat, lon, waktu: new Date().toLocaleTimeString() });
        res.json({ status: 'success' });
    } else {
        res.status(400).json({ status: 'error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan mulus di port ${PORT}`);
});
