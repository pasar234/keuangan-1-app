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

            // --- KODE PEMBALIK TANGGAL ---
            const formatTgl = (tgl) => {
                if (!tgl || tgl === '-') return '-';
                const [y, m, d] = tgl.split('-');
                return `${d}-${m}-${y}`; // Hasil: 31-01-2026
            };

            tbody.innerHTML += `
                <tr>
                    <td>${formatTgl(item.tanggal)}</td>
                    <td>${formatTgl(item.jatuh_tempo)}</td>
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
