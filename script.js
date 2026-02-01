function renderTables() {
    const list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    const hBody = document.querySelector('#tableHutang tbody');
    const pBody = document.querySelector('#tablePiutang tbody');
    
    // Ambil tanggal hari ini (set ke jam 00:00 agar perbandingan akurat)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    hBody.innerHTML = '';
    pBody.innerHTML = '';

    list.forEach(item => {
        // Logika warna merah: Cek jika jatuh tempo <= hari ini
        const tglJatuhTempo = new Date(item.jatuh_tempo);
        const isOverdue = tglJatuhTempo <= today;
        
        // Jika overdue, tambahkan style warna merah dan tebal
        const styleRed = isOverdue ? 'style="color: red; font-weight: bold;"' : '';

        const row = `<tr>
            <td>${item.tanggal}</td>
            <td>${item.keterangan}</td>
            <td>${item.jumlah}</td>
            <td ${styleRed}>${item.jatuh_tempo || '-'}</td>
            <td>${item.bayar}</td>
        </tr>`;
        
        if(item.jenis === 'hutang') {
            hBody.innerHTML += row;
        } else {
            pBody.innerHTML += row;
        }
    });
}
