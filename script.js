// Menunggu seluruh halaman siap
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('financeForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Supaya halaman tidak refresh/kedip

        // Ambil data
        const jenis = document.getElementById('jenis').value;
        const jumlah = document.getElementById('jumlah').value;

        // Tes apakah bekerja dengan memunculkan pesan
        alert("Berhasil! Menambah " + jenis + " sebesar " + jumlah);
        
        // Kosongkan form lagi
        form.reset();
    });
});
