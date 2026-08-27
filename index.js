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
    res.send('<h1>Halaman Daftar</h1><p>Fitur pendaftaran akan segera hadir.</p><a href="/">Kembali ke Login</a>');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'rahasia123') {
        res.redirect('/dashboard');
    } else {
        res.send('<h1>Login Gagal</h1><p>Nama pengguna atau kata sandi salah.</p><a href="/">Coba Lagi</a>');
    }
});

app.get('/dashboard', (req, res) => {
    res.send(`
        <h1>Selamat Datang, Admin!</h1>
        <p>Dashboard Parental Control aktif.</p>
        <ul>
            <li><a href="/dashboard/lokasi">Lihat Lokasi Saat Ini</a></li>
            <li><a href="/dashboard/riwayat-web">Lihat Riwayat Website</a></li>
            <li><a href="/dashboard/galeri">Lihat Galeri</a></li>
            <li><a href="/dashboard/whatsapp">Pantau WhatsApp</a></li>
        </ul>
        <a href="/">Keluar (Logout)</a>
    `);
});

app.get('/dashboard/lokasi', (req, res) => { res.send('<h1>Peta Lokasi</h1><a href="/dashboard">Kembali</a>'); });
app.get('/dashboard/riwayat-web', (req, res) => { res.send('<h1>Riwayat Website</h1><a href="/dashboard">Kembali</a>'); });
app.get('/dashboard/galeri', (req, res) => { res.send('<h1>Galeri Foto</h1><a href="/dashboard">Kembali</a>'); });
app.get('/dashboard/whatsapp', (req, res) => { res.send('<h1>Riwayat Pesan WhatsApp</h1><a href="/dashboard">Kembali</a>'); });

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
