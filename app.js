const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Fungsi untuk membersihkan XSS
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Simulasi database rahasia pengguna
const usersDatabase = {
    1: { name: "Admin Ganteng", role: "Super Administrator", secret: "FLAG{XSS_Aman_Tapi_IDOR_Masuk}" },
    2: { name: "Budi Biasa", role: "Member Regular", secret: "Tidak ada rahasia di sini." }
};

app.get('/', (req, res) => {
    const rawKeyword = req.query.q || '';
    const keyword = escapeHtml(rawKeyword); 
    
        // Fitur Baru: Cek parameter ID untuk melihat profil (diubah agar lebih aman dari salah baca tipe data)
    const userId = req.query.id;
    let profileContent = '';

    if (userId) {
        // Kita gunakan .toString() untuk memastikan pencocokkan datanya akurat
        const user = usersDatabase[userId.toString()];
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
            profileContent = `<p style="color: red; font-size: 13px; margin-top: 15px;">Pengguna dengan ID "${userId}" tidak ditemukan.</p>`;
        }
    }


    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Website Latihan Keamanan (IDOR Test)</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 15px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #f5f7fa, #c3cfe2); color: #333; }
                .container { background: white; padding: 20px; border-radius: 12px; width: 100%; max-width: 380px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); box-sizing: border-box; text-align: center; }
                h1 { color: #ff4757; font-size: 20px; }
                .welcome-text { color: #555; font-weight: bold; font-size: 14px; }
                input[type="text"] { padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; margin-top: 10px; }
                button { padding: 10px; background-color: #ff4757; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>RESEARCH! 🕵️‍♂️</h1>
                <p class="welcome-text">✨ Uji Coba Celah IDOR ✨</p>
                <div>
                    <form action="" method="GET">
                        <input type="text" name="q" placeholder="Ketik pencarian..." value="${keyword}">
                        <button type="submit">telusuri</button>
                    </form>
                    <div style="margin-top: 15px; text-align: left; font-size: 13px;">
                        <b>Hasil pencarian untuk:</b> ${keyword}
                    </div>
                    ${profileContent}
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server IDOR test berjalan di port ${port}`);
});
