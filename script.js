// 1. Fungsi untuk Pindah Layar (Tab)
function openScreen(screenId) {
    // Sembunyikan semua layar
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');

    // Tampilkan layar yang dipilih
    document.getElementById(screenId).style.display = 'block';
}

// 2. Fungsi Simpan Transaksi
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('financeForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Ambil data dari input
            const jenis = document.getElementById('jenis').value;
            const tanggal = document.getElementById('tanggal').value;
            const jumlah = document.getElementById('jumlah').value;
            const keterangan = document.getElementById('keterangan').value;

            if (!jumlah || !tanggal) {
                alert("Tanggal dan Jumlah harus diisi!");
                return;
            }

            // Simpan ke LocalStorage (Memori HP/Tablet)
            const transaksiBaru = { jenis, tanggal, jumlah, keterangan };
            let semuaData = JSON.parse(localStorage.getItem('data_keuangan')) || [];
            semuaData.push(transaksiBaru);
            localStorage.setItem('data_keuangan', JSON.stringify(semuaData));

            alert("Data Berhasil Disimpan!");
            form.reset();
        });
    }
});
