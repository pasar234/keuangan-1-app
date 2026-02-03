// Navigasi Layar
function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id === 'data-hutang' || id === 'data-piutang') tampilkanData();
    }
}

// Format Tanggal
function formatTgl(tgl) {
    if (!tgl || tgl === '-') return '-';
    const parts = tgl.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : tgl;
}

// Simpan Data
document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
        jenis: document.getElementById('jenis').value,
        tanggal: document.getElementById('tanggal').value,
        jatuh_tempo: document.getElementById('jatuh_tempo').value || '-',
        jumlah: parseFloat(document.getElementById('jumlah').value),
        bayar: 0,
        riwayat_bayar: '', 
        keterangan: document.getElementById('keterangan').value
    };
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    list.push(data);
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    alert("Berhasil Disimpan!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

// Tampilkan Tabel dengan Riwayat Vertikal
function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        let styleTempo = "";
        if (item.jatuh_tempo !== "-" && sisa > 0) {
            if (new Date(item.jatuh_tempo).getTime() < hariIni) styleTempo = "color:red; font-weight:bold;";
        }

        const baris = `
            <tr>
                <td style="vertical-align:top">${formatTgl(item.tanggal)}</td>
                <td style="vertical-align:top; ${styleTempo}">${formatTgl(item.jatuh_tempo)}</td>
                <td style="vertical-align:top; text-align:left;">
                    <strong>${item.keterangan}</strong>
                    ${item.riwayat_bayar ? `<div class="riwayat-box">${item.riwayat_bayar}</div>` : ''}
                </td>
                <td style="vertical-align:top">${item.jumlah.toLocaleString('id-ID')}</td>
                <td style="vertical-align:top">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:5px; border-radius:3px;">Bayar</button>
                    <div style="font-size:10px; font-weight:bold; margin-top:4px;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
                </td>
                <td style="vertical-align:top"><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px 8px; border-radius:3px;">X</button></td>
            </tr>`;

        if (item.jenis === 'hutang') { tbodyH.innerHTML += baris; totalH += sisa; }
        else { tbodyP.innerHTML += baris; totalP += sisa; }
    });
    if(document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    if(document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
}

// Fungsi Bayar Riwayat Ke Bawah
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    const sisa = list[index].jumlah - (list[index].bayar || 0);
    let nominal = prompt(`Jumlah Bayar (Sisa: ${sisa.toLocaleString()}):`, sisa);
    if (nominal && !isNaN(nominal)) {
        let met = prompt("Metode/Nama:", "Tunai");
        let tgl = prompt("Tanggal:", new Date().toLocaleDateString('id-ID').replace(/\//g, '-'));
        let catatan = `• ${met} (${parseFloat(nominal).toLocaleString('id-ID')}) - ${tgl}`;
        
        // Gunakan <br> untuk baris baru
        list[index].riwayat_bayar = list[index].riwayat_bayar ? `${list[index].riwayat_bayar}<br>${catatan}` : catatan;
        list[index].bayar += parseFloat(nominal);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function hapusData(i) { if(confirm("Hapus?")) { let list = JSON.parse(localStorage.getItem('data_keuangan')); list.splice(i, 1); localStorage.setItem('data_keuangan', JSON.stringify(list)); tampilkanData(); } }
function eksporData() { const data = localStorage.getItem('data_keuangan'); const blob = new Blob([data], {type: "application/json"}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "backup.json"; a.click(); }
function imporData() { try { const txt = document.getElementById('importDataText').value; localStorage.setItem('data_keuangan', JSON.stringify(JSON.parse(txt))); alert("Sukses!"); location.reload(); } catch(e) { alert("Format Error!"); } }
