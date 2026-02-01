let currentEditIndex = null;

function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if(id === 'data') renderTables();
}

document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        jenis: document.getElementById('jenis').value,
        tgl: formatDate(document.getElementById('tanggal').value),
        jt_raw: document.getElementById('jatuh_tempo').value, // Untuk cek warna
        jt: formatDate(document.getElementById('jatuh_tempo').value),
        nilai: parseInt(document.getElementById('jumlah').value) || 0,
        ket: document.getElementById('keterangan').value,
        bayar: 0
    };

    let list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    list.push(data);
    localStorage.setItem('keuangan_data', JSON.stringify(list));
    alert('Data Tersimpan!');
    this.reset();
    openScreen('data');
});

function renderTables() {
    const list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    const body = document.getElementById('tableBody');
    let h = 0, p = 0;
    const today = new Date();
    today.setHours(0,0,0,0);

    body.innerHTML = '';
    list.forEach((item, i) => {
        const tglJT = new Date(item.jt_raw);
        const overdue = tglJT <= today;
        const styleRed = overdue ? 'style="color:red; font-weight:bold;"' : '';
        const sisa = item.nilai - item.bayar;

        body.innerHTML += `<tr>
            <td>${item.tgl}</td>
            <td ${styleRed}>${item.jt}</td>
            <td>${item.ket}</td>
            <td>${item.nilai.toLocaleString()}</td>
            <td>${item.bayar.toLocaleString()}</td>
            <td>${sisa.toLocaleString()}</td>
            <td>
                <button onclick="tombolEdit(${i})">✏️</button>
                <button onclick="hapus(${i})">❌</button>
            </td>
        </tr>`;
        if(item.jenis === 'hutang') h += sisa; else p += sisa;
    });
    document.getElementById('totalHutang').innerText = 'Rp ' + h.toLocaleString();
    document.getElementById('totalPiutang').innerText = 'Rp ' + p.toLocaleString();
}

function tombolEdit(i) {
    currentEditIndex = i;
    const list = JSON.parse(localStorage.getItem('keuangan_data'));
    document.getElementById('inputBayar').value = list[i].bayar;
    document.getElementById('editModal').style.display = 'block';
}

function prosesSimpanEdit() {
    let list = JSON.parse(localStorage.getItem('keuangan_data'));
    list[currentEditIndex].bayar = parseInt(document.getElementById('inputBayar').value) || 0;
    localStorage.setItem('keuangan_data', JSON.stringify(list));
    document.getElementById('editModal').style.display = 'none';
    renderTables();
}

function hapus(i) {
    if(confirm('Hapus data ini?')) {
        let list = JSON.parse(localStorage.getItem('keuangan_data'));
        list.splice(i, 1);
        localStorage.setItem('keuangan_data', JSON.stringify(list));
        renderTables();
    }
}

function formatDate(s) {
    if(!s) return "-";
    const [y, m, d] = s.split('-');
    return `${d}-${m}-${y}`;
}

function exportData() {
    const data = localStorage.getItem('keuangan_data');
    const blob = new Blob([data], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'backup_keuangan.json';
    a.click();
}
