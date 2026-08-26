const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const usersDatabase = {
    "1": { name: "Admin Ganteng", role: "Super Administrator", secret: "FLAG{XSS_Aman_Tapi_IDOR_Masuk}" },
    "2": { name: "Budi Biasa", role: "Member Regular", secret: "Tidak ada rahasia di sini." }
};

app.get('/', (req, res) => {
    const userId = req.query.id;
    let profileContent = '';

    if (userId) {
        const user = usersDatabase[userId];
        if (user) {
            profileContent = `
                <div style="margin-top: 20px; padding: 10px; background: #ffeaa7; border-radius: 6px; text-align: left; font-size: 13px; color: #333;">
                    <b>Profil Ditemukan (ID: ${userId})</b><br>
                    Nama: ${user.name}<br>
                    Role: ${user.role}<br>
                    <b>Data Rahasia:</b> <span style="color: #d63031; font-weight: bold;">${user.secret}</span>
                </div>
            `;
        } else {
            profileContent = `<p style="color: red; font-size: 13px; margin-top: 15px;">Pengguna tidak ditemukan.</p>`;
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Latihan IDOR</title>
        </head>
        <body style="font-family: Arial; padding: 20px; text-align: center; background: #f5f7fa;">
            <div style="background: white; padding: 20px; border-radius: 10px; display: inline-block; max-width: 350px; width: 100%;">
                <h2 style="color: #ff4757;">Uji Coba IDOR 🕵️‍♂️</h2>
                <p>Tambah parameter <b>?id=1</b> atau <b>?id=2</b> di URL atas.</p>
                ${profileContent}
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server aktif di port ${port}`);
});
