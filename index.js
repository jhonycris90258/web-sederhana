const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Simulasi database penyimpanan akun & OTP sementara
const users = {
    'admin': 'rahasia123'
};
const otpStorage = {}; // Menyimpan OTP sementara per username

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/daftar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'daftar.html'));
});

app.get('/lupa-sandi', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lupa-sandi.html'));
});

// Proses Pendaftaran Akun Baru
app.post('/register-process', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        res.send('<script>alert("Username sudah terpakai!"); window.location="/daftar";</script>');
    } else {
        users[username] = password;
        res.send('<script>alert("Pendaftaran berhasil! Silakan login."); window.location="/";</script>');
    }
});

// Tahap 1: Kirim OTP untuk Lupa Sandi
app.post('/send-otp', (req, res) => {
    const { username } = req.body;
    if (users[username]) {
        // Buat kode OTP acak 4 digit (misal: 4812)
        const otp = Math.floor(1000 + Math.random() * 9000);
        otpStorage[username] = otp; // Simpan OTP untuk user ini

        // Tampilkan OTP lewat alert sebagai simulasi pengiriman SMS/WhatsApp
        res.send(`
            <script>
                alert("Simulasi: Kode OTP Anda adalah ${otp}");
                window.location = "/verifikasi-otp?username=${username}";
            </script>
        `);
    } else {
        res.send('<script>alert("Username tidak ditemukan di sistem!"); window.location="/lupa-sandi";</script>');
    }
});

// Tahap 2: Halaman Input OTP & Sandi Baru
app.get('/verifikasi-otp', (req, res) => {
    const username = req.query.username || '';
    res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi OTP</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f172a, #1e293b); height: 100vh; display: flex; justify-content: center; align-items: center; margin: 0; color: #f8fafc; }
            .box { background: #1e293b; padding: 35px; border-radius: 12px; width: 320px; text-align: center; box-shadow: 0 8px 24px rgba(0,0,0,0.5); border: 1px solid #334155; }
            h2 { color: #f8fafc; margin-bottom: 15px; font-size: 22px; }
            p { color: #94a3b8; font-size: 13px; margin-bottom: 20px; }
            input { width: 100%; padding: 12px; margin: 10px 0; background-color: #0f172a; border: 1px solid #475569; color: #fff; border-radius: 6px; box-sizing: border-box; }
            input:focus { border-color: #3b82f6; outline: none; }
            button { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 15px; transition: background 0.2s; }
            button:hover { background-color: #2563eb; }
        </style>
    </head>
    <body>
        <div class="box">
            <h2>🔐 Masukkan OTP</h2>
            <p>Masukkan kode OTP yang dikirim dan buat sandi baru Anda.</p>
            <form action="/reset-password-process" method="POST">
                <input type="hidden" name="username" value="${username}">
                <input type="text" name="otp" placeholder="Kode OTP 4 Digit" required>
                <input type="password" name="newPassword" placeholder="Kata Sandi Baru" required>
                <button type="submit">Konfirmasi & Ubah Sandi</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Tahap 3: Proses Verifikasi OTP & Ubah Sandi
app.post('/reset-password-process', (req, res) => {
    const { username, otp, newPassword } = req.body;
    
    // Cek apakah OTP cocok
    if (otpStorage[username] && otpStorage[username] == otp) {
        users[username] = newPassword; // Ubah sandi
        delete otpStorage[username]; // Hapus OTP setelah dipakai
        res.send('<script>alert("Kata sandi berhasil diubah! Silakan login."); window.location="/";</script>');
    } else {
        res.send(`<script>alert("Kode OTP salah atau tidak valid!"); window.location="/verifikasi-otp?username=${username}";</script>');
    }
});

// Proses Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        res.redirect('/dashboard');
    } else {
        res.send('<script>alert("Login Gagal! Username atau Password salah."); window.location="/";</script>');
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Template Halaman Fitur
function renderFiturPage(title, icon, content) {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f172a, #1e293b); margin: 0; padding: 20px; color: #f8fafc; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
            .card { background: #1e293b; color: #f8fafc; width: 100%; max-width: 600px; padding: 35px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); border: 1px solid #334155; }
            h2 { margin-top: 0; color: #f8fafc; display: flex; align-items: center; gap: 10px; }
            p { color: #94a3b8; line-height: 1.6; }
            .content-box { background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0; }
            a.btn-back { display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; transition: background 0.2s; }
            a.btn-back:hover { background-color: #2563eb; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>${icon} ${title}</h2>
            <div class="content-box">${content}</div>
            <a href="/dashboard" class="btn-back">← Kembali ke Dashboard</a>
        </div>
    </body>
    </html>
    `;
}

app.get('/dashboard/lokasi', (req, res) => {
    res.send(renderFiturPage('Peta Lokasi Perangkat', '📍', '<p>Status: Perangkat terdeteksi aktif.</p><p>Koordinat: -6.2088, 106.8456 (Jakarta)</p>'));
});

app.get('/dashboard/riwayat-web', (req, res) => {
    res.send(renderFiturPage('Riwayat Website', '🌐', '<p>Daftar situs yang dikunjungi:</p><ul><li>google.com</li><li>youtube.com</li></ul>'));
});

app.get('/dashboard/galeri', (req, res) => {
    res.send(renderFiturPage('Galeri Foto', '🖼️', '<p>Penyimpanan foto perangkat anak tersinkronisasi.</p>'));
});

app.get('/dashboard/whatsapp', (req, res) => {
    res.send(renderFiturPage('Pantau WhatsApp', '💬', '<p>Pemantauan aktivitas pesan masuk dan keluar.</p>'));
});

app.get('/dashboard/apk-install', (req, res) => {
    res.send(renderFiturPage('APK Install (Aplikasi)', '📱', '<p>Aplikasi terpasang: WhatsApp, YouTube, Instagram.</p>'));
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
