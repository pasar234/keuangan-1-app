document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Mengambil nilai dari input yang sudah kamu buat
    const jenis = document.getElementById('jenis').value;
    const tanggal = document.getElementById('tanggal').value;
    const jumlah = document.getElementById('jumlah').value;
    const keterangan = document.getElementById('keterangan').value;

    // 2. Validasi sederhana
    if (!tanggal || !jumlah) {
        alert("Mohon isi tanggal dan jumlah uang!");
        return;
    }

    // 3. Membuat objek data
    const dataBaru = {
        jenis: jenis,
        tanggal: tanggal,
        jumlah: jumlah,
        keterangan: keterangan
    };

    console.log("Data berhasil ditangkap:", dataBaru);
    
    // 4. Munculkan pesan sukses
    alert("Transaksi " + jenis + " sebesar " + jumlah + " telah disimpan!");
    
    // 5. Kosongkan form kembali
    this.reset();
});
