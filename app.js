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
            <title>Website Latihan Keamanan</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    margin-top: 40px; 
                    background: linear-gradient(135deg, #f5f7fa, #c3cfe2); 
                    color: #333; 
                }
                .container { 
                    background: white; 
                    padding: 25px; 
                    border-radius: 12px; 
                    display: inline-block; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
                }
                /* Mengatur warna judul utama */
                h1 { 
                    color: #ff4757; 
                    font-size: 22px; 
                }
                /* Mengatur warna teks di bawah judul */
                .welcome-text { 
                    color: #2ed573; 
                    font-weight: bold; 
                }
                img { 
                    width: 200px; 
                    border-radius: 8px; 
                    margin-top: 15px; 
                }
                input[type="text"] { 
                    padding: 8px; 
                    width: 200px; 
                    border: 1px solid #ccc; 
                    border-radius: 4px; 
                }
                /* Mengatur warna tombol telusuri */
                button { 
                    padding: 8px 15px; 
                    background-color: #ff4757; 
                    color: white; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer; 
                    font-weight: bold;
                }
                button:hover {
                    background-color: #ff6b81;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Halo! selamat datang di pencarian silahkan ketik sesuatu! 🚀</h1>
                <p class="welcome-text">✨ Selamat datang di lab uji coba pencarian Google. ✨</p>
                
                <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5" alt="Ilustrasi">

                <div style="margin-top: 20px;">
                    <h3>Cari Sesuatu disini?</h3>
                    <form action="https://www.google.com/search" method="GET">
                        <input type="text" name="q" placeholder="Ketik pencarian..." value="${keyword}">
                        <button type="submit">telusuri</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server jalan di port ${port}`);
});
