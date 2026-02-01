// 1. Fungsi Pindah Layar (Sudah diperbaiki agar navigasi lancar)
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) target.style.display = 'block';
    
    // Refresh tabel setiap kali masuk ke layar data
    if (screenId === 'data') tampilkanData();
}

// 2. Logika Simpan Transaksi (Ditambah pemanggilan tampilkanData)
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
            
            // PENTING: Langsung update tabel setelah simpan
            tampilkanData();
        });
    }
});

// 3. Menampilkan Data dengan Format Tanggal d-m-y
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return; // Mencegah error jika elemen tidak ada

    const searchFilter = document.getElementById('inputCari') ? document.getElementById('inputCari').value.toLowerCase() : '';
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    
    let totalHutang = 0;
    let totalPiutang = 0;
    tbody.innerHTML = '';

    // Fungsi pembalik tanggal
    const formatTgl = (tgl) => {
        if (!tgl || tgl === '-') return '-';
        const parts = tgl.split('-');
        return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : tgl;
    };

    list.forEach((item, index) => {
        if (item.keterangan.toLowerCase().includes(searchFilter)) {
            const sisa = item.jumlah - item.bayar;
            if (item.jenis === 'hutang') totalHutang += sisa;
            else totalPiutang += sisa;

            tbody.innerHTML += `
                <tr>
                    <td>${formatTgl(item.tanggal)}</td>
                    <td>${formatTgl(item.jatuh_tempo)}</td>
                    <td>${item.keterangan}</td>
                    <td>${item.jumlah.toLocaleString()}</td>
                    <td><button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button></td>
                    <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
                </tr>`;
        }
    });

    // Update Ringkasan Saldo
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
            list[index].keterangan += ` (${metode})`; 
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            tampilkanData();
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

// 6. Fungsi Backup & Restore
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
