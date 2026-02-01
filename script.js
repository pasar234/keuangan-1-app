function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;

    const searchFilter = document.getElementById('inputCari') ? document.getElementById('inputCari').value.toLowerCase() : '';
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    
    let totalHutang = 0;
    let totalPiutang = 0;
    tbody.innerHTML = '';

    // Ambil tanggal hari ini (tanpa jam) untuk perbandingan
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

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

            // LOGIKA WARNA MERAH JATUH TEMPO
            let styleJatuhTempo = "";
            if (item.jatuh_tempo && item.jatuh_tempo !== '-') {
                const tglJatuhTempo = new Date(item.jatuh_tempo);
                // Jika sudah masuk atau lewat tanggalnya, beri warna merah & tebal
                if (tglJatuhTempo <= hariIni && sisa > 0) {
                    styleJatuhTempo = "color: red; font-weight: bold;";
                }
            }

            tbody.innerHTML += `
                <tr>
                    <td>${formatTgl(item.tanggal)}</td>
                    <td style="${styleJatuhTempo}">${formatTgl(item.jatuh_tempo)}</td>
                    <td>${item.keterangan}</td>
                    <td>${item.jumlah.toLocaleString()}</td>
                    <td><button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button></td>
                    <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
                </tr>`;
        }
    });

    if(document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalHutang.toLocaleString();
    if(document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalPiutang.toLocaleString();
            }
