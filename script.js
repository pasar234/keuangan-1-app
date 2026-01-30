// Navigasi Antar Screen
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    if(screenId === 'data') renderTables();
}

// Simpan Data
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value,
        jumlah: document.getElementById('jumlah').value,
        keterangan: document.getElementById('keterangan').value,
        bayar: 0
    };

    let list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    list.push(data);
    localStorage.setItem('keuangan_data', JSON.stringify(list));
    
    alert('Data Berhasil Disimpan!');
    this.reset();
});

// Tampilkan Data ke Tabel (Screen 2)
function renderTables() {
    const list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    const hBody = document.querySelector('#tableHutang tbody');
    const pBody = document.querySelector('#tablePiutang tbody');
    
    hBody.innerHTML = '';
    pBody.innerHTML = '';

    list.forEach(item => {
        const row = `<tr>
            <td>${item.tanggal}</td>
            <td>${item.keterangan}</td>
            <td>${item.jumlah}</td>
            <td>${item.bayar}</td>
        </tr>`;
        
        if(item.jenis === 'hutang') hBody.innerHTML += row;
        else pBody.innerHTML += row;
    });
}

// Backup Data (Screen 3)
function exportData() {
    const data = localStorage.getItem('keuangan_data');
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_keuangan.json';
    a.click();
      }
