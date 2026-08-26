const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Database simulasi IDOR
const usersDatabase = {
    "1": { name: "Admin Ganteng", role: "Super Administrator", secret: "FLAG{XSS_Aman_Tapi_IDOR_Masuk}" },
    "2": { name: "Budi Biasa", role: "Member Regular", secret: "Tidak ada rahasia di sini." }
};

app.get('/', (req, res) => {
    const userId = req.query.id;
    let profileContent = '';

    if (userId && usersDatabase[userId]) {
        const user = usersDatabase[userId];
        profileContent = `
            <div style="margin-top: 20px; padding: 15px; background: #ffeaa7; border-radius: 8px; text-align: left; font-size: 14px; color: #333;">
                <b>Profil Ditemukan (ID: ${userId})</b><br>
                Nama: ${user.name}<br>
                Role: ${user.role}<br>
                <b>Data Rahasia:</b> <span style="color: #d63031; font-weight: bold;">${user.secret}</span>
            </div>
        `;
    } else if (userId) {
        profileContent = `<p style="color: red; font-size: 14px; margin-top: 15px;">Pengguna dengan ID "${userId}" tidak ditemukan.</p>`;
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Latihan IDOR</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background: #f5f7fa; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <div style="background: white; padding: 25px; border-radius: 12px; max-width: 380px; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #ff4757; margin-top: 0;">Uji Coba IDOR 🕵️‍♂️</h2>
                <p style="font-size: 14px; color: #555;">Coba akses link dengan tambahan <b>?id=1</b> atau <b>?id=2</b> di ujung URL.</p>
                ${profileContent}
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server aktif di port ${port}`);
});
