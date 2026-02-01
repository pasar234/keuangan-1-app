function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;

    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';

    // Ambil tanggal hari ini dan hilangkan jamnya
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const formatTgl = (tgl) => {
        if (!tgl || tgl === '-') return '-';
        const p = tgl.split('-');
        return `${p[2]}-${p[1]}-${p[0]}`;
    };

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        let warnaMerah = "";

        // CEK JATUH TEMPO
        if (item.jatuh_tempo && item.jatuh_tempo !== '-') {
            const tglJT = new Date(item.jatuh_tempo);
            tglJT.setHours(0, 0, 0, 0);

            // Jika hari ini sudah melewati atau sama dengan tanggal jatuh tempo
            if (tglJT <= hariIni && sisa > 0) {
                warnaMerah = "color: red !important; font-weight: bold;";
            }
        }

        tbody.innerHTML += `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${warnaMerah}">${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td><button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button></td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
            </tr>`;
    });
}
