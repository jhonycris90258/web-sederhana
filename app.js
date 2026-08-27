const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let dataPantau = {
    lokasi: { lat: 0, lon: 0 },
    waktu: 'Belum ada data'
};

app.get('/', (req, res) => {
    res.send('Server Pantau Anak Aktif & Normal!');
});

app.post('/api/lapor', (req, res) => {
    const { lat, lon } = req.body;
    dataPantau.lokasi = { lat, lon };
    dataPantau.waktu = new Date().toLocaleString();
    res.json({ status: 'success', pesan: 'Lokasi berhasil disimpan' });
});

app.get('/api/pantau', (req, res) => {
    res.json(dataPantau);
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
