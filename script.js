// 1. Fungsi Tampilkan Data (Menampilkan Sisa Hutang & Keterangan)
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
        
        // Logika Warna Merah Jatuh Tempo
        let styleJT = "";
        if (item.jatuh_tempo && item.jatuh_tempo !== '-') {
            const tglJT = new Date(item.jatuh_tempo);
            tglJT.setHours(0, 0, 0, 0);
            if (tglJT <= hariIni && sisa > 0) {
                styleJT = "color: red; font-weight: bold; background-color: #fff0f0;";
            }
        }

        // Tampilkan Baris Tabel
        tbody.innerHTML += `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleJT}">${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})" class="btn-bayar">
                        ${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}
                    </button>
                    <div style="font-size: 0.8em; color: blue;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td>
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; border-radius:4px;">X</button>
                </td>
            </tr>`;
    });
}

// 2. Fungsi Bayar (Agar keterangan Tunai/Transfer tersimpan di 'keterangan')
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let sisa = list[index].jumlah - list[index].bayar;
    
    let nominal = prompt("Masukkan jumlah pembayaran:", sisa);
    
    if (nominal !== null && !isNaN(nominal) && nominal !== "") {
        let metode = prompt("Metode Pembayaran (Tunai / Transfer):", "Tunai");
        
        if (metode !== null) {
            list[index].bayar += parseFloat(nominal);
            // Menambahkan catatan pembayaran ke kolom keterangan agar tidak hilang
            list[index].keterangan += ` [Bayar: ${parseFloat(nominal).toLocaleString()} via ${metode}]`;
            
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            tampilkanData();
        }
    }
}
