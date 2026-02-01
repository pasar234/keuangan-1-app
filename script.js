// --- 1. FUNGSI NAVIGASI ---
function openScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'block';
        if (screenId === 'data') tampilkanData();
    }
}

// --- 2. LOGIKA SIMPAN DATA ---
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('financeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                id: Date.now(),
                jenis: document.getElementById('jenis').value,
                tanggal: document.getElementById('tanggal').value,
                jatuh_tempo: document.getElementById('jatuh_tempo').value || '-',
                jumlah: parseFloat(document.getElementById('jumlah').value),
                bayar: 0,
                keterangan: document.getElementById('keterangan').value
            };
            let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
            list.push(data);
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            alert("Data Berhasil Disimpan!");
            form.reset();
            openScreen('data');
        });
    }
});

// --- 3. TAMPILKAN DATA + SISA HUTANG + WARNA MERAH ---
function tampilkanData() {
    const tbody = document.getElementById('tbody-data');
    if (!tbody) return;

    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    tbody.innerHTML = '';
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    let totalH = 0, totalP = 0;

    list.forEach((item, index) => {
        const sisa = item.jumlah - item.bayar;
        if (item.jenis === 'hutang') totalH += sisa;
        else totalP += sisa;

        // Logika warna merah jatuh tempo
        let styleJT = "";
        if (item.jatuh_tempo && item.jatuh_tempo !== '-') {
            const tglJT = new Date(item.jatuh_tempo);
            tglJT.setHours(0, 0, 0, 0);
            if (tglJT <= hariIni && sisa > 0) {
                styleJT = "color: red; font-weight: bold; background-color: #fff0f0;";
            }
        }

        const formatTgl = (tgl) => {
            if (!tgl || tgl === '-') return '-';
            const p = tgl.split('-');
            return `${p[2]}-${p[1]}-${p[0]}`;
        };

        tbody.innerHTML += `
            <tr>
                <td>${formatTgl(item.tanggal)}</td>
                <td style="${styleJT}">${formatTgl(item.jatuh_tempo)}</td>
                <td>${item.keterangan}</td>
                <td>${item.jumlah.toLocaleString()}</td>
                <td>
                    <button onclick="inputBayar(${index})">${item.bayar > 0 ? item.bayar.toLocaleString() : 'Bayar'}</button>
                    <div style="font-size: 11px; color: blue; font-weight: bold; margin-top:2px;">Sisa: ${sisa.toLocaleString()}</div>
                </td>
                <td><button onclick="hapusData(${index})" style="background:red; color:white; border:none; padding:5px;">X</button></td>
            </tr>`;
    });

    if(document.getElementById('totalHutang')) document.getElementById('totalHutang').innerText = totalH.toLocaleString();
    if(document.getElementById('totalPiutang')) document.getElementById('totalPiutang').innerText = totalP.toLocaleString();
}

// --- 4. FUNGSI BAYAR + METODE ---
function inputBayar(index) {
    let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
    let sisa = list[index].jumlah - list[index].bayar;
    
    let nominal = prompt("Masukkan jumlah pembayaran:", sisa);
    if (nominal !== null && nominal !== "" && !isNaN(nominal)) {
        let metode = prompt("Metode (Tunai / Transfer):", "Tunai");
        if (metode !== null) {
            list[index].bayar += parseFloat(nominal);
            list[index].keterangan += ` (${metode})`; // Tambah metode ke keterangan
            localStorage.setItem('data_keuangan', JSON.stringify(list));
            tampilkanData();
        }
    }
}

// --- 5. FUNGSI HAPUS ---
function hapusData(index) {
    if(confirm("Hapus data ini?")) {
        let list = JSON.parse(localStorage.getItem('data_keuangan')) || [];
        list.splice(index, 1);
        localStorage.setItem('data_keuangan', JSON.stringify(list));
        tampilkanData();
    }
                       }
