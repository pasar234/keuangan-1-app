// 1. Navigasi Layar
function openScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(screenId);
    if (target) target.style.display = 'block';

    if (screenId === 'data') tampilkanData();
}

// 2. Logika Simpan Data
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('financeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const data = {
                id: Date.now(),
                jenis: document.getElementById('jenis').value,
                tanggal: document.getElementById('tanggal').value,
                jatuh_tempo: document.getElementById('jatuh_tempo').value || '-',
                jumlah: parseFloat(document.getElementById('jumlah').value),
                bayar: 0,
                keterangan: document.getElementById('keterangan').value
            };

            let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
            list.push(data);
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            
            alert("Berhasil Disimpan!");
            form.reset();
            openScreen('data');
        });
    }
});

// 3. Tampilkan Data dengan Format Tgl-Bln-Thn & Warna Merah
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;

    const searchFilter = document.getElementById('inputCari') ? document.getElementById('inputCari').value.toLowerCase() : '';
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    
    let totalHutang = 0;
    let totalPiutang = 0;
    tbody.innerHTML = '';

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const formatTgl = (tgl) => {
        if (!tgl || tgl === '-') return '-';
        const p = tgl.split('-');
        return `${p[2]}-${p[1]}-${p[0]}`; // Mengubah ke Tanggal-Bulan-Tahun
    };

    list.forEach((item, index) => {
        if (item.keterangan.toLowerCase().includes(searchFilter)) {
            const sisa = item.jumlah - item.bayar;
            if (item.jenis === 'hutang') totalHutang += sisa;
            else totalPiutang += sisa;

            // Logika Warna Merah jika Jatuh Tempo sudah masuk/lewat
            let styleJT = "";
            if (item.jatuh_tempo && item.jatuh_tempo !== '-') {
                const tglJT = new Date(item.jatuh_tempo);
                tglJT.setHours(0, 0, 0, 0);
                if (tglJT <= hariIni && sisa > 0) {
                    styleJT = "color: red; font-weight: bold; background-color: #fff0f0;";
                }
            }

            tbody.innerHTML += `
                <tr>
                    <td>${formatTgl(item.tanggal)}</td>
                    <td style="${styleJT}">${formatTgl(item.jatuh_tempo)}</td>
                    <td>${item.keterangan}</td>
                    <td>${item.jumlah.toLocaleString()}</td>
                    <td><button onclick="inputBayar(${index})" class="btn-bayar">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button></td>
                    <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; border-radius:4px; padding:5px 10px;">X</button></td>
                </tr>`;
        }
    });

    document.getElementById('totalHutang').innerText = totalHutang.toLocaleString();
    document.getElementById('totalPiutang').innerText = totalPiutang.toLocaleString();
}

// 4. Fungsi Pembayaran
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let sisa = list[index].jumlah - list[index].bayar;
    let nominal = prompt("Masukkan jumlah pembayaran:", sisa);
    
    if (nominal !== null && !isNaN(nominal)) {
        list[index].bayar += parseFloat(nominal);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

// 5. Fungsi Hapus
function hapusData(index) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
        list.splice(index, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

// 6. Backup & Restore
function exportData() {
    const data = localStorage.getItem('data_keuangan');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_keuangan.json';
    a.click();
}

function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (!file) return alert("Pilih file backup dulu!");

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            localStorage.setItem('data_keuangan', JSON.stringify(importedData));
            alert("Data Berhasil Dipulihkan!");
            location.reload();
        } catch (err) {
            alert("File tidak valid!");
        }
    };
    reader.readAsText(file);
            }
