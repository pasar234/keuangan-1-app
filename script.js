function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;

    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';

    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const formatTgl = (tgl) => {
        if (!tgl || tgl === '-') return '-';
        const p = tgl.split('-');
        return `${p[2]}-${p[1]}-${p[0]}`;
    };

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        
        // Logika warna merah untuk jatuh tempo
        let styleJT = "";
        if (item.jatuh_tempo && item.jatuh_tempo !== '-') {
            const tglJT = new Date(item.jatuh_tempo);
            tglJT.setHours(0, 0, 0, 0);
            if (tglJT <= hariIni && sisa > 0) {
                styleJT = "color: red; font-weight: bold;";
            }
        }

        tbody.innerHTML += `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleJT}">${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">
                        ${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}
                    </button>
                    <div style="font-size: 10px; color: blue; margin-top: 4px;">
                        Sisa: ${sisa.toLocaleString()}
                    </div>
                </td>
                <td>
                    <button onclick="hapusData(${index})" style="background:red; color:white;">X</button>
                </td>
            </tr>`;
    });
    
    updateRingkasan(list);
}

function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let sisaAwal = list[index].jumlah - list[index].bayar;
    
    let nominal = prompt("Masukkan jumlah pembayaran:", sisaAwal);
    
    if (nominal !== null && nominal !== "" && !isNaN(nominal)) {
        let metode = prompt("Metode (Tunai / Transfer):", "Tunai");
        
        if (metode !== null) {
            // Update jumlah yang sudah dibayar
            list[index].bayar += parseFloat(nominal);
            
            // Tambahkan catatan ke keterangan agar tidak hilang
            let tglBayar = new Date().toLocaleDateString('id-ID');
            list[index].keterangan += ` [${tglBayar}: ${metode}]`;
            
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            tampilkanData();
        }
    }
}
