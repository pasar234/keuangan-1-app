function openScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    if (screenId === 'data') renderTables();
}

document.getElementById('financeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const dataBaru = {
        jenis: document.getElementById('jenis').value,
        tanggal: formatDate(document.getElementById('tanggal').value),
        jatuh_tempo: formatDate(document.getElementById('jatuh_tempo').value),
        raw_jatuh_tempo: document.getElementById('jatuh_tempo').value, // Untuk perbandingan warna
        jumlah: parseInt(document.getElementById('jumlah').value) || 0,
        keterangan: document.getElementById('keterangan').value
    };

    let listData = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    listData.push(dataBaru);
    localStorage.setItem('keuangan_data', JSON.stringify(listData));
    
    alert('Data Berhasil Disimpan!');
    this.reset();
    openScreen('data');
});

// Fungsi mengubah format YYYY-MM-DD ke DD-MM-YYYY
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

function renderTables() {
    const list = JSON.parse(localStorage.getItem('keuangan_data')) || [];
    const tableBody = document.getElementById('tableBody');
    const displayHutang = document.getElementById('totalHutang');
    const displayPiutang = document.getElementById('totalPiutang');
    
    let totalH = 0;
    let totalP = 0;
    const hariIni = new Date();
    hariIni.setHours(0,0,0,0);

    tableBody.innerHTML = '';

    list.forEach((item, index) => {
        // Logika Warna Merah Jatuh Tempo
        const tglJT = new Date(item.raw_jatuh_tempo);
        const isOverdue = tglJT <= hariIni;
        const styleMerah = isOverdue ? 'style="color:red; font-weight:bold;"' : '';

        const row = `<tr>
            <td>${item.tanggal}</td>
            <td ${styleMerah}>${item.jatuh_tempo}</td>
            <td>${item.keterangan}</td>
            <td>${item.jumlah.toLocaleString('id-ID')}</td>
            <td>
                <button onclick="hapusData(${index})" style="background:none; border:none; color:red; cursor:pointer;">❌</button>
            </td>
        </tr>`;
        
        tableBody.innerHTML += row;

        if (item.jenis === 'hutang') totalH += item.jumlah;
        else totalP += item.jumlah;
    });

    displayHutang.innerText = `Rp ${totalH.toLocaleString('id-ID')}`;
    displayPiutang.innerText = `Rp ${totalP.toLocaleString('id-ID')}`;
}

function hapusData(index) {
    if (confirm("Hapus data ini?")) {
        let listData = JSON.parse(localStorage.getItem('keuangan_data')) || [];
        listData.splice(index, 1);
        localStorage.setItem('keuangan_data', JSON.stringify(listData));
        renderTables();
    }
}

// Fungsi Pencarian
function searchTable() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.getElementById("tableBody").getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let text = rows[i].getElementsByTagName("td")[2].textContent.toLowerCase();
        rows[i].style.display = text.includes(input) ? "" : "none";
    }
}
