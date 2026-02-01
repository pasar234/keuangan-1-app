let currentEditIndex = null;

// Buka Modal Kalender
function inputBayar(index) {
    currentEditIndex = index;
    let list = JSON.parse(localStorage.getItem('data_keuangan'));
    let sisa = list[index].jumlah - list[index].bayar;
    
    // Isi default nilai di modal
    document.getElementById('nominalInput').value = sisa;
    document.getElementById('tglBayarInput').valueAsDate = new Date(); // Kalender otomatis hari ini
    document.getElementById('metodeInput').value = "Tunai";
    document.getElementById('paymentModal').style.display = 'block';
}

function tutupModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Proses Pembayaran Setelah Oke
function prosesBayar() {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let nominal = parseFloat(document.getElementById('nominalInput').value);
    let tglSelected = document.getElementById('tglBayarInput').value; // Ambil tgl dari kalender
    let metode = document.getElementById('metodeInput').value;

    if (!nominal || !tglSelected) return alert("Mohon isi semua data!");

    // Format tanggal kalender ke d-m-y
    let d = tglSelected.split('-');
    let tglFormated = `${d[2]}-${d[1]}-${d[0]}`;

    // Simpan ke riwayat & update sisa
    list[currentEditIndex].riwayat_bayar.push({ tgl: tglFormated, amt: nominal });
    list[currentEditIndex].bayar += nominal;
    
    // Tambah ke kolom Keterangan
    list[currentEditIndex].keterangan += ` (${tglFormated}: ${metode} Rp${nominal.toLocaleString()})`;

    localStorage.setItem('data_keuangan', JSON.stringify(list));
    tutupModal();
    tampilkanData();
}

// Update fungsi tampilkanData agar kolom Bayar/Sisa rapi
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;

    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';
    
    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        
        // Buat daftar tanggal pembayaran per baris
        const riwayatHtml = item.riwayat_bayar.map(r => 
            `<div style="font-size:10px; color:#555;">${r.tgl}: ${r.amt.toLocaleString()}</div>`
        ).join('');

        tbody.innerHTML += `
            <tr>
                <td>${item.tanggal}</td>
                <td>${item.jatuh_tempo}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                    ${riwayatHtml}
                    <div style="color:blue; font-weight:bold; font-size:11px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white;">X</button></td>
            </tr>`;
    });
    // Jangan lupa panggil fungsi hitung total di sini
                                               }
