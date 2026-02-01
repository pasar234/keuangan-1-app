let editIndex = null;

// Fungsi Simpan Data Baru
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dataBaru = {
        jenis: document.getElementById('jenis').value,
        tanggal: formatDate(document.getElementById('tanggal').value),
        jatuh_tempo: formatDate(document.getElementById('jatuh_tempo').value),
        raw_jatuh_tempo: document.getElementById('jatuh_tempo').value,
        jumlah: parseInt(document.getElementById('jumlah').value) || 0,
        keterangan: document.getElementById('keterangan').value,
        bayar: 0 // Default bayar adalah 0
    };

    let listData = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    listData.push(dataBaru);
    localStorage.setItem('keuangan_data', JSON.stringify(listData));
    alert('Data Tersimpan!');
    this.reset();
    openScreen('data');
});

function renderTables() {
    const list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    const tableBody = document.getElementById('tableBody');
    let totalH = 0, totalP = 0;
    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);

    tableBody.innerHTML = '';

    list.forEach((item, index) => {
        const tglJT = new Date(item.raw_jatuh_tempo);
        const isOverdue = tglJT <= hariIni;
        const styleMerah = isOverdue ? 'style="color:red; font-weight:bold;"' : '';
        
        // Hitung Sisa (Nilai - Bayar)
        const sisa = item.jumlah - (item.bayar || 0);

        const row = `<tr>
            <td>${item.tanggal}</td>
            <td ${styleMerah}>${item.jatuh_tempo}</td>
            <td>${item.keterangan}</td>
            <td>${item.jumlah.toLocaleString('id-ID')}</td>
            <td>${(item.bayar || 0).toLocaleString('id-ID')}</td>
            <td style="font-weight:bold;">${sisa.toLocaleString('id-ID')}</td>
            <td>
                <button onclick="bukaEdit(${index})" title="Edit Pembayaran">✏️</button>
                <button onclick="hapusData(${index})" title="Hapus">❌</button>
            </td>
        </tr>`;
        
        tableBody.innerHTML += row;
        if (item.jenis === 'hutang') totalH += sisa;
        else totalP += sisa;
    });

    document.getElementById('totalHutang').innerText = `Rp ${totalH.toLocaleString('id-ID')}`;
    document.getElementById('totalPiutang').innerText = `Rp ${totalP.toLocaleString('id-ID')}`;
}

// Logika Edit Pembayaran
function bukaEdit(index) {
    editIndex = index;
    const list = JSON.parse(localStorage.getItem('keuangan_data'));
    document.getElementById('editBayar').value = list[index].bayar || 0;
    document.getElementById('editModal').style.display = 'block';
}

function simpanEdit() {
    let list = JSON.parse(localStorage.getItem('keuangan_data'));
    list[editIndex].bayar = parseInt(document.getElementById('editBayar').value) || 0;
    localStorage.setItem('keuangan_data', JSON.stringify(list));
    tutupEdit();
    renderTables();
}

function tutupEdit() {
    document.getElementById('editModal').style.display = 'none';
}

function formatDate(dateString) {
    if(!dateString) return "-";
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}
