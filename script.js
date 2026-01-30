// 1. Fungsi Pindah Layar (Tab)
function openScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    
    // Jika buka layar data, refresh tabelnya
    if (screenId === 'data') {
        tampilkanData();
    }
}

// 2. Logika Simpan Data
document.addEventListener('DOMContentLoaded', function() {
    const financeForm = document.getElementById('financeForm');

    if (financeForm) {
        financeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Ambil data dari form
            const transaksi = {
                id: Date.now(),
                jenis: document.getElementById('jenis').value,
                tanggal: document.getElementById('tanggal').value,
                jatuh_tempo: document.getElementById('jatuh_tempo').value,
                jumlah: document.getElementById('jumlah').value,
                keterangan: document.getElementById('keterangan').value
            };

            // Simpan ke LocalStorage
            let listTransaksi = JSON.parse(localStorage.getItem('data_keuangan')) || [];
            listTransaksi.push(transaksi);
            localStorage.setItem('data_keuangan', JSON.stringify(listTransaksi));

            alert("Data Berhasil Disimpan!");
            financeForm.reset();
        });
    }
});

// 3. Fungsi Menampilkan Data ke Tabel
function tampilkanData() {
    const tbody = document.getElementById('tbody-data'); // Kita akan tambahkan ID ini di HTML
    const listTransaksi = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    listTransaksi.forEach((item) => {
        const row = `<tr>
            <td>${item.tanggal}</td>
            <td>${item.jenis.toUpperCase()}</td>
            <td>Rp ${Number(item.jumlah).toLocaleString()}</td>
            <td>${item.keterangan}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
                                     }
