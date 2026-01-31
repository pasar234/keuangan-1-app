function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    if (screenId === 'data') tampilkanData();
}

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
                bayar: 0, // Awalnya 0
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

function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';

    list.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.tanggal}</td>
                <td>${item.jatuh_tempo}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td><button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button></td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
            </tr>`;
    });
}

function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let nominal = prompt("Masukkan jumlah pembayaran:", list[index].jumlah - list[index].bayar);
    
    if (nominal !== null && !isNaN(nominal)) {
        list[index].bayar = parseFloat(nominal);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

function hapusData(index) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
        list.splice(index, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}
