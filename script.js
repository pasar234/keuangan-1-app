let currentEditIndex = null;

// Navigasi Layar
function openScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        if (id === 'data') tampilkanData();
    }
}

// Simpan Data
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
        riwayat: []
    };
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    list.push(data);
    localStorage.setItem('data_keuangan', JSON.stringify(list));
    alert("Tersimpan!");
    this.reset();
    openScreen('data');
});

// Tampilkan Data + Sisa Biru + Tgl di Kolom Bayar
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';
    let tH = 0, tP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        if (item.jenis === 'hutang') tH += sisa; else tP += sisa;

        // Warna Merah Jatuh Tempo
        let styleJT = "";
        if (item.jatuh_tempo !== '-') {
            if (new Date(item.jatuh_tempo) <= hariIni && sisa > 0) styleJT = "color:red; font-weight:bold;";
        }

        // List Tanggal di bawah tombol bayar
        const riwayatList = item.riwayat.map(r => `<div style="font-size:9px; color:gray;">${r.tgl}: ${r.amt.toLocaleString()}</div>`).join('');

        tbody.innerHTML += `
            <tr>
                <td>${item.tanggal}</td>
                <td style="${styleJT}">${item.jatuh_tempo}</td>
                <td style="max-width:100px; overflow:hidden;">${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                    ${riwayatList}
                    <div style="color:blue; font-weight:bold; font-size:10px; margin-top:2px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none;">X</button></td>
            </tr>`;
    });
    document.getElementById('totalHutang').innerText = tH.toLocaleString();
    document.getElementById('totalPiutang').innerText = tP.toLocaleString();
}

// Fungsi Modal Pembayaran
function inputBayar(index) {
    currentEditIndex = index;
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let sisa = list[index].jumlah - list[index].bayar;
    document.getElementById('nominalInput').value = sisa;
    document.getElementById('tglBayarInput').valueAsDate = new Date();
    document.getElementById('metodeInput').value = "Tunai";
    document.getElementById('paymentModal').style.display = 'block';
}

function tutupModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function prosesBayar() {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let nominal = parseFloat(document.getElementById('nominalInput').value);
    let tgl = document.getElementById('tglBayarInput').value;
    let metode = document.getElementById('metodeInput').value;

    if (nominal && tgl) {
        let d = tgl.split('-');
        let tglFormat = `${d[2]}-${d[1]}-${d[0]}`;
        
        // Rekam Riwayat & Update Keterangan
        list[currentEditIndex].riwayat.push({ tgl: tglFormat, amt: nominal });
        list[currentEditIndex].bayar += nominal;
        list[currentEditIndex].keterangan += ` [${tglFormat}: ${metode} Rp${nominal.toLocaleString()}]`;

        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tutupModal();
        tampilkanData();
    }
}

function hapusData(i) {
    if(confirm("Hapus?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan'));
        list.splice(i, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
        }
