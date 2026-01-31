function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    const searchFilter = document.getElementById('inputCari').value.toLowerCase();
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    
    let totalHutang = 0;
    let totalPiutang = 0;
    
    tbody.innerHTML = '';

    list.forEach((item, index) => {
        // Logika Pencarian
        if (item.keterangan.toLowerCase().includes(searchFilter)) {
            
            // Hitung Total Otomatis
            const sisaBayar = item.jumlah - item.bayar;
            if (item.jenis === 'hutang') {
                totalHutang += sisaBayar;
            } else {
                totalPiutang += sisaBayar;
            }

            tbody.innerHTML += `
                <tr>
                    <td>${item.tanggal}</td>
                    <td>${item.jatuh_tempo}</td>
                    <td style="text-align: left;">${item.keterangan}</td>
                    <td>${item.jumlah.toLocaleString()}</td>
                    <td><button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button></td>
                    <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
                </tr>`;
        }
    });

    // Update Angka Total di Layar
    document.getElementById('totalHutang').innerText = totalHutang.toLocaleString();
    document.getElementById('totalPiutang').innerText = totalPiutang.toLocaleString();
}
