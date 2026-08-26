const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const keyword = req.query.q || '';
    
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Website Latihan Keamanan</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 15px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #f5f7fa, #c3cfe2); color: #333; }
                .container { background: white; padding: 20px; border-radius: 12px; width: 100%; max-width: 380px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); box-sizing: border-box; text-align: center; }
                h1 { color: #ff4757; font-size: 20px; }
                .welcome-text { color: #2ed573; font-weight: bold; font-size: 14px; }
                img { width: 100%; max-width: 180px; height: auto; border-radius: 8px; margin-top: 10px; }
                form { margin-top: 15px; display: flex; flex-direction: column; gap: 10px; }
                input[type="text"] { padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                button { padding: 10px; background-color: #ff4757; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>RESEARCH! 🚀</h1>
                <p class="welcome-text">✨ Selamat datang di lab uji coba. ✨</p>
                <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" alt="Ilustrasi">
                <div>
                    <h3>Cari Sesuatu disini?</h3>
                    <form action="" method="GET">
                        <input type="text" name="q" placeholder="Ketik pencarian..." value="${keyword}">
                        <button type="submit">telusuri</button>
                    </form>
                    <div style="margin-top: 15px; text-align: left; font-size: 13px;">
                        <b>Hasil pencarian untuk:</b> ${keyword}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server jalan di port ${port}`);
});
