function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id === 'data-hutang' || id === 'data-piutang') tampilkanData();
    }
}

function formatTgl(tgl) {
    if (!tgl || tgl === '-') return '-';
    const parts = tgl.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : tgl;
}

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
    alert("Data Berhasil Disimpan!");
    this.reset();
    openScreen(data.jenis === 'hutang' ? 'data-hutang' : 'data-piutang');
});

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
            if (new Date(item.jatuh_tempo).getTime() < hariIni) {
                styleTempo = "color:red; font-weight:bold;";
            }
        }

        const barisHtml = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleTempo}">${formatTgl(item.jatuh_tempo)}</td>
                <td>
                    ${item.keterangan}
                    ${item.riwayat_bayar ? `<br><small style="color:blue;"><i>(${item.riwayat_bayar})</i></small>` : ''}
                </td>
                <td>${item.jumlah.toLocaleString('id-ID')}</td>
                <td align="center">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:4px 8px; border-radius:3px;">Bayar</button>
                    <div style="font-size:10px; margin-top:3px; font-weight:bold;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
                </td>
                <td align="center">
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:4px 8px; border-radius:3px;">X</button>
                </td>
            </tr>`;

        if (item.jenis === 'hutang') { tbodyH.innerHTML += barisHtml; totalH += sisa; } 
        else { tbodyP.innerHTML += barisHtml; totalP += sisa; }
    });

    document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
}

function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    const sisaSekarang = list[index].jumlah - (list[index].bayar || 0);
    
    let nominal = prompt(`Jumlah Pembayaran (Sisa: ${sisaSekarang.toLocaleString()}):`, sisaSekarang);
    if (nominal) {
        let met = prompt("Metode & Nama (Contoh: Tunai Marlon / Transfer Vr):", "Tunai");
        let tglInput = prompt("Tanggal Bayar (Tgl-Bln-Thn):", new Date().toLocaleDateString('id-ID').replace(/\//g, '-'));
        
        let catatanBaru = `${met} ${tglInput}`;
        if (!list[index].riwayat_bayar) {
            list[index].riwayat_bayar = catatanBaru;
        } else {
            list[index].riwayat_bayar += `, lanjut ${catatanBaru}`;
        }
        
        list[index].bayar += parseFloat(nominal);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function hapusData(i) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function eksporData() {
    const data = localStorage.getItem('data_keuangan');
    const blob = new Blob([data], {type: "application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "backup_keuangan.json";
    a.click();
}

function imporData() {
    try {
        const txt = document.getElementById('importDataText').value;
        localStorage.setItem('data_keuangan', JSON.stringify(JSON.parse(txt)));
        alert("Data Berhasil Dipulihkan!");
        location.reload();
    } catch(e) { alert("Format data salah!"); }
        }
