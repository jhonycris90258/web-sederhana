const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Parental Control Center</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: white; text-align: center; padding-top: 100px; }
                .card { background: #1e293b; max-width: 400px; margin: auto; padding: 30px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
                h1 { color: #38bdf8; font-size: 24px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🛡️ Server Berjalan Mulus!</h1>
                <p>Aplikasi Parental Control berhasil aktif di Railway.</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server aktif di port ${PORT}`);
});
