// Fungsi Pindah Layar
function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    if (screenId === 'data') tampilkanData();
}

// Logika Simpan
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('financeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const data = {
                id: Date.now(),
                jenis: document.getElementById('jenis').value,
                tanggal: document.getElementById('tanggal').value,
                jumlah: document.getElementById('jumlah').value,
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

// Fungsi Tampilkan Data & Hapus
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';

    list.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.tanggal}</td>
                <td>${item.jenis}</td>
                <td>${Number(item.jumlah).toLocaleString()}</td>
                <td>${item.keterangan}</td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; border-radius:4px;">X</button></td>
            </tr>`;
    });
}

function hapusData(index) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
        list.splice(index, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}
