// Navigasi Layar
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) target.style.display = 'block';
    if (screenId === 'data') tampilkanData();
}

// Simpan Data Awal
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        id: Date.now(),
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value || '-',
        jumlah: parseFloat(document.getElementById('jumlah').value),
        bayar: 0,
        keterangan: document.getElementById('keterangan').value,
        riwayat_bayar: [] // Tempat menyimpan tgl & nominal cicilan
    };

    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    list.push(data);
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    
    alert("Data Berhasil Disimpan!");
    this.reset();
    openScreen('data');
});

// Tampilkan Data ke Tabel
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;

    const cari = document.getElementById('inputCari').value.toLowerCase();
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';

    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);

    let tH = 0, tP = 0;

    const formatTgl = (tgl) => {
        if (!tgl || tgl === '-') return '-';
        const p = tgl.split('-');
        return `${p[2]}-${p[1]}-${p[0]}`;
    };

    list.forEach((item, index) => {
        if (item.keterangan.toLowerCase().includes(cari)) {
            const sisa = item.jumlah - item.bayar;
            if (item.jenis === 'hutang') tH += sisa;
            else tP += sisa;

            // Warna merah untuk jatuh tempo
            let styleJT = "";
            if (item.jatuh_tempo !== '-') {
                const tglJT = new Date(item.jatuh_tempo);
                if (tglJT <= hariIni && sisa > 0) styleJT = "color: red; font-weight: bold;";
            }

            // Gabungkan riwayat tanggal pembayaran untuk kolom Bayar/Sisa
            const infoBayar = item.riwayat_bayar.map(r => 
                `<div style="font-size:10px; border-bottom:1px solid #eee;">${r.tgl}: ${r.amt.toLocaleString()}</div>`
            ).join('');

            tbody.innerHTML += `
                <tr>
                    <td>${formatTgl(item.tanggal)}</td>
                    <td style="${styleJT}">${formatTgl(item.jatuh_tempo)}</td>
                    <td>${item.keterangan}</td>
                    <td>${item.jumlah.toLocaleString()}</td>
                    <td>
                        <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                        ${infoBayar}
                        <div style="color: blue; font-weight: bold; margin-top:4px;">Sisa: ${sisa.toLocaleString()}</div>
                    </td>
                    <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
                </tr>`;
        }
    });

    document.getElementById('totalHutang').innerText = tH.toLocaleString();
    document.getElementById('totalPiutang').innerText = tP.toLocaleString();
}

// Fungsi Bayar dengan Rekam Tanggal Otomatis
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let sisa = list[index].jumlah - list[index].bayar;
    
    let nominal = prompt("Masukkan jumlah pembayaran:", sisa);
    
    if (nominal !== null && nominal !== "" && !isNaN(nominal)) {
        let metode = prompt("Metode (Tunai / Transfer):", "Tunai");
        
        if (metode !== null) {
            const tglSekarang = new Date();
            const tglStr = `${tglSekarang.getDate()}-${tglSekarang.getMonth()+1}-${tglSekarang.getFullYear()}`;
            
            // 1. Tambah riwayat pembayaran
            list[index].riwayat_bayar.push({ tgl: tglStr, amt: parseFloat(nominal) });
            
            // 2. Update total bayar
            list[index].bayar += parseFloat(nominal);
            
            // 3. Tambahkan tanggal & metode ke kolom Keterangan sesuai perintah
            list[index].keterangan += ` [Bayar pd ${tglStr}: ${metode} Rp${parseFloat(nominal).toLocaleString()}]`;
            
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            tampilkanData();
        }
    }
}

// Fungsi Hapus & Backup tetap sama...
function hapusData(i) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function exportData() {
    const data = localStorage.getItem('data_keuangan');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keuangan_backup_${new Date().getTime()}.json`;
    a.click();
                          }
