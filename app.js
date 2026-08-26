const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const keyword = req.query.search || '';
    
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>Website Latihan Keamanan</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f9; }
                .container { background: white; padding: 20px; border-radius: 8px; display: inline-block; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
                img { width: 200px; border-radius: 8px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Halo! Website pertama saya berhasil jalan di Railway! 🚀</h1>
                <p>Selamat datang di lab uji coba keamanan web sederhana.</p>
                
                <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" alt="Ilustrasi">

                <div style="margin-top: 20px;">
                    <h3>Cari Sesuatu?</h3>
                    <form action="" method="GET">
                        <input type="text" name="search" placeholder="Ketik sesuatu..." value="${keyword}">
                        <button type="submit">Cari</button>
                    </form>
                    ${keyword ? `<p>Hasil pencarian untuk: <b>${keyword}</b></p>` : ''}
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server jalan di port ${port}`);
});
