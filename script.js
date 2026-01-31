// 1. Fungsi Pindah Layar
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    if (screenId === 'data') tampilkanData();
}

// 2. Logika Simpan Transaksi Baru
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
            alert("Data Berhasil Disimpan!");
            form.reset();
        });
    }
});

// 3. Menampilkan Data, Fitur Cari, dan Hitung Total
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    const searchFilter = document.getElementById('inputCari') ? document.getElementById('inputCari').value.toLowerCase() : '';
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    
    let totalHutang = 0;
    let totalPiutang = 0;
    tbody.innerHTML = '';

    list.forEach((item, index) => {
        if (item.keterangan.toLowerCase().includes(searchFilter)) {
            const sisa = item.jumlah - item.bayar;
            if (item.jenis === 'hutang') totalHutang += sisa;
            else totalPiutang += sisa;

            tbody.innerHTML += `
                <tr>
                    <td>${item.tanggal}</td>
                    <td>${item.jatuh_tempo}</td>
                    <td>${item.keterangan}</td>
                    <td>${item.jumlah.toLocaleString()}</td>
                    <td><button onclick="inputBayar(${index})" class="btn-bayar">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button></td>
                    <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:4px;">X</button></td>
                </tr>`;
        }
    });

    if(document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalHutang.toLocaleString();
    if(document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalPiutang.toLocaleString();
}

// 4. Fungsi Bayar (Tunai / Transfer)
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let nominal = prompt("Masukkan jumlah pembayaran:", list[index].jumlah - list[index].bayar);
    
    if (nominal !== null && !isNaN(nominal)) {
        let metode = prompt("Keterangan Pembayaran (Contoh: Tunai / Transfer):", "Tunai");
        if (metode !== null) {
            list[index].bayar = parseFloat(nominal);
            list[index].keterangan += ` (${metode})`; // Menambah keterangan pembayaran
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            tampilkanData();
            alert("Berhasil dicatat!");
        }
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

// 6. Fungsi Backup (Download File)
function exportData() {
    const data = localStorage.getItem('data_keuangan');
    if(!data) return alert("Tidak ada data untuk dibackup.");
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_keuangan.json';
    a.click();
}

// 7. Fungsi Restore (Upload File)
function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (!file) return alert("Pilih file dulu!");

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            localStorage.setItem('data_keuangan', JSON.stringify(importedData));
            alert("Restore Berhasil!");
            location.reload();
        } catch (err) {
            alert("File tidak valid!");
        }
    };
    reader.readAsText(file);
            }
