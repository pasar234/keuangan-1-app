// 1. Fungsi Navigasi Tab
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    if (screenId === 'data') renderTables();
}

// 2. Event Listener Simpan Data
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah refresh halaman (PENTING!)

    const dataBaru = {
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value,
        jumlah: parseInt(document.getElementById('jumlah').value) || 0,
        keterangan: document.getElementById('keterangan').value
    };

    let listData = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    listData.push(dataBaru);
    localStorage.setItem('keuangan_data', JSON.stringify(listData));
    
    alert('Data Berhasil Tersimpan!');
    this.reset();
});

// 3. Fungsi Tampilkan Tabel & Fitur Hapus
function renderTables() {
    const list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    const hBody = document.querySelector('#tableHutang tbody');
    const pBody = document.querySelector('#tablePiutang tbody');
    const displayHutang = document.getElementById('totalHutang');
    const displayPiutang = document.getElementById('totalPiutang');
    
    let totalH = 0;
    let totalP = 0;
    
    // Tanggal Hari Ini untuk cek Jatuh Tempo
    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);

    hBody.innerHTML = '';
    pBody.innerHTML = '';

    list.forEach((item, index) => {
        // Logika Jatuh Tempo (Merah Tebal)
        const tglJT = new Date(item.jatuh_tempo);
        const isOverdue = tglJT <= hariIni;
        const styleJT = isOverdue ? 'style="color:red; font-weight:bold;"' : '';

        const row = `<tr>
            <td>${item.tanggal}</td>
            <td>${item.keterangan}</td>
            <td>Rp ${item.jumlah.toLocaleString()}</td>
            <td ${styleJT}>${item.jatuh_tempo}</td>
            <td>
                <button onclick="hapusData(${index})" class="btn-hapus">Hapus</button>
            </td>
        </tr>`;
        
        if (item.jenis === 'hutang') {
            hBody.innerHTML += row;
            totalH += item.jumlah;
        } else {
            pBody.innerHTML += row;
            totalP += item.jumlah;
        }
    });

    displayHutang.innerText = `Rp ${totalH.toLocaleString()}`;
    displayPiutang.innerText = `Rp ${totalP.toLocaleString()}`;
}

// 4. Fungsi Hapus Data Berdasarkan Indeks
function hapusData(index) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        let listData = JSON.parse(localStorage.getItem('keuangan_data')) || [];
        listData.splice(index, 1); // Hapus 1 item pada indeks tsb
        localStorage.setItem('keuangan_data', JSON.stringify(listData));
        renderTables(); // Refresh tampilan tabel
    }
}

// 5. Fungsi Backup
function exportData() {
    const data = localStorage.getItem('keuangan_data');
    if (!data || data === "[]") return alert("Tidak ada data untuk dibackup!");

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_keuangan_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}
