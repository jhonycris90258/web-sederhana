<div>
    <h3>Cari Sesuatu disini?</h3>
    <!-- Action dikosongkan agar dikirim ke server kita sendiri -->
    <form action="" method="GET">
        <input type="text" name="q" placeholder="Ketik pencarian..." value="${keyword}">
        <button type="submit">telusuri</button>
    </form>

    <!-- Tambahkan bagian ini untuk menampilkan hasil pencarian dari input user -->
    <div style="margin-top: 15px; text-align: left; font-size: 13px;">
        <b>Hasil pencarian untuk:</b> ${keyword}
    </div>
</div>
