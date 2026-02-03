// Fungsi Bayar dengan Riwayat Tersusun Rapi (Ke Bawah)
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    const sisaSekarang = list[index].jumlah - (list[index].bayar || 0);
    
    let nominal = prompt(`Jumlah Pembayaran (Sisa: ${sisaSekarang.toLocaleString()}):`, sisaSekarang);
    if (nominal) {
        let met = prompt("Metode/Nama (Contoh: Tunai vv / Transfer Vr):", "Tunai");
        let tgl = prompt("Tanggal Bayar (Tgl-Bln-Thn):", new Date().toLocaleDateString('id-ID').replace(/\//g, '-'));
        
        // Format catatan: Metode - Nominal - Tanggal
        let nominalFormatted = parseFloat(nominal).toLocaleString('id-ID');
        let catatan = `• ${met} (${nominalFormatted}) - ${tgl}`;
        
        // Menggunakan <br> agar riwayat selanjutnya otomatis turun ke bawah
        if (!list[index].riwayat_bayar) {
            list[index].riwayat_bayar = catatan;
        } else {
            list[index].riwayat_bayar += `<br>${catatan}`;
        }
        
        list[index].bayar += parseFloat(nominal);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
}

// Update Tampilan Tabel agar Kotak Keterangan Rapi
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
            if (new Date(item.jatuh_tempo).getTime() < hariIni) styleTempo = "color:red; font-weight:bold;";
        }

        const baris = `
            <tr>
                <td style="vertical-align: top;">${formatTgl(item.tanggal)}</td>
                <td style="vertical-align: top; ${styleTempo}">${formatTgl(item.jatuh_tempo)}</td>
                <td style="vertical-align: top; text-align: left; padding: 5px;">
                    <strong>${item.keterangan}</strong>
                    ${item.riwayat_bayar ? `<div style="margin-top: 5px; padding-top: 5px; border-top: 1px dashed #ccc; font-size: 11px; color: blue; line-height: 1.4;">${item.riwayat_bayar}</div>` : ''}
                </td>
                <td style="vertical-align: top;">${item.jumlah.toLocaleString('id-ID')}</td>
                <td align="center" style="vertical-align: top;">
                    <button onclick="inputBayar(${index})" style="background:#007bff; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer;">Bayar</button>
                    <div style="font-size:10px; font-weight:bold; margin-top:2px;">Sisa: ${sisa.toLocaleString('id-ID')}</div>
                </td>
                <td align="center" style="vertical-align: top;">
                    <button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer;">X</button>
                </td>
            </tr>`;

        if (item.jenis === 'hutang') { tbodyH.innerHTML += baris; totalH += sisa; }
        else { tbodyP.innerHTML += baris; totalP += sisa; }
    });
    document.getElementById('totalHutang').innerText = totalH.toLocaleString('id-ID');
    document.getElementById('totalPiutang').innerText = totalP.toLocaleString('id-ID');
}
