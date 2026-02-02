// Fungsi Bayar dengan Akumulasi Riwayat
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    const sisaSekarang = list[index].jumlah - (list[index].bayar || 0);
    
    let nominal = prompt(`Jumlah Pembayaran (Sisa: ${sisaSekarang.toLocaleString()}):`, sisaSekarang);
    
    if (nominal) {
        let met = prompt("Metode & Nama (Contoh: Tunai Marlon / Transfer Vr):", "Tunai");
        let tglInput = prompt("Tanggal Bayar (Tgl-Bln-Thn):", new Date().toLocaleDateString('id-ID').replace(/\//g, '-'));
        
        // Membuat catatan baru
        let catatanBaru = `${met} - ${tglInput}`;
        
        // Menambahkan ke riwayat yang sudah ada agar tidak terhapus
        if (!list[index].riwayat_bayar) {
            list[index].riwayat_bayar = catatanBaru;
        } else {
            list[index].riwayat_bayar += `, ${catatanBaru}`;
        }
        
        list[index].bayar = (list[index].bayar || 0) + parseFloat(nominal);
        
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

// Tampilkan Data dengan Baris Riwayat
function tampilkanData() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    const tbodyH = document.getElementById('tbody-hutang');
    const tbodyP = document.getElementById('tbody-piutang');
    
    if (tbodyH) tbodyH.innerHTML = '';
    if (tbodyP) tbodyP.innerHTML = '';
    
    let totalH = 0, totalP = 0;
    const hariIni = new Date().setHours(0,0,0,0);

    list.forEach((item, index) => {
        const sisa = item.jumlah - (item.bayar || 0);
        let styleTempo = "";
        
        if (item.jatuh_tempo !== "-" && sisa > 0) {
            if (new Date(item.jatuh_tempo).getTime() < hariIni) {
                styleTempo = "color:red; font-weight:bold;";
            }
        }

        const barisHtml = `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleTempo}">${formatTgl(item.jatuh_tempo)}</td>
                <td>
                    ${item.keterangan}
                    ${item.riwayat_bayar ? `<br><small style="color:blue;"><i>(${item.riwayat_bayar})</i></small>` : ''}
                </td>
                <td>${item.jumlah.toLocaleString('id-ID')}</td>
                <td align="center">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:4px 8px; border-radius:3px;">Bayar</button>
                    <div style="font-size:10px; margin-top:3px; font-weight:bold;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
                </td>
                <td align="center">
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:4px 8px; border-radius:3px;">X</button>
                </td>
            </tr>`;

        if (item.jenis === 'hutang') { tbodyH.innerHTML += barisHtml; totalH += sisa; } 
        else { tbodyP.innerHTML += barisHtml; totalP += sisa; }
    });

    document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
                        }
