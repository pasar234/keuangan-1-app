// Fungsi Navigasi Tab
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) target.style.display = 'block';
    
    // Jika buka tab data, refresh tabelnya
    if (screenId === 'data') renderTables();
}

// Fungsi Simpan Data (PENTING: e.preventDefault agar tidak refresh)
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const dataBaru = {
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value,
        jumlah: parseInt(document.getElementById('jumlah').value) || 0,
        keterangan: document.getElementById('keterangan').value,
        bayar: 0
    };

    // Ambil data lama dari localStorage
    let listData = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    
    // Tambah data baru
    listData.push(dataBaru);
    
    // Simpan kembali
    localStorage.setItem('keuangan_data', JSON.stringify(listData));
    
    alert('Data berhasil disimpan!');
    this.reset(); // Kosongkan form
});

// Fungsi Tampilkan Tabel dengan Logika Warna Merah
function renderTables() {
    const list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    const hBody = document.querySelector('#tableHutang tbody');
    const pBody = document.querySelector('#tablePiutang tbody');
    
    // Set Tanggal Hari Ini (untuk perbandingan)
    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);

    hBody.innerHTML = '';
    pBody.innerHTML = '';

    list.forEach(item => {
        // Logika Merah Tebal
        const tglJatuhTempo = new Date(item.jatuh_tempo);
        const sudahLewat = tglJatuhTempo <= hariIni;
        const styleMerah = sudahLewat ? 'style="color:red; font-weight:bold;"' : '';

        const row = `<tr>
            <td>${item.tanggal}</td>
            <td>${item.keterangan}</td>
            <td>Rp ${item.jumlah.toLocaleString()}</td>
            <td ${styleMerah}>${item.jatuh_tempo}</td>
            <td>${item.bayar}</td>
        </tr>`;
        
        if(item.jenis === 'hutang') hBody.innerHTML += row;
        else pBody.innerHTML += row;
    });
}
