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

// Halaman Dashboard Berwarna & Berbentuk Tabel
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Endpoint Fitur-fitur
app.get('/dashboard/lokasi', (req, res) => { res.send('<h2>📍 Peta Lokasi Perangkat Anak</h2><p>Melacak koordinat secara real-time...</p><a href="/dashboard">Kembali ke Dashboard</a>'); });
app.get('/dashboard/riwayat-web', (req, res) => { res.send('<h2>🌐 Riwayat Website</h2><p>Daftar situs yang dikunjungi anak...</p><a href="/dashboard">Kembali ke Dashboard</a>'); });
app.get('/dashboard/galeri', (req, res) => { res.send('<h2>🖼️ Galeri Foto</h2><p>Menampilkan foto dari perangkat anak...</p><a href="/dashboard">Kembali</a>'); });
app.get('/dashboard/whatsapp', (req, res) => { res.send('<h2>💬 Pantau WhatsApp</h2><p>Riwayat pesan masuk dan keluar...</p><a href="/dashboard">Kembali</a>'); });
app.get('/dashboard/apk-install', (req, res) => { res.send('<h2>📱 APK Install / Daftar Aplikasi</h2><p>Aplikasi yang terpasang di HP anak...</p><a href="/dashboard">Kembali</a>'); });

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
