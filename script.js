function openScreen(screenId) {
    // Sembunyikan semua layar
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    // Tampilkan layar yang dipilih
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'block';
    }

    // Jika buka layar data, jalankan fungsi tampilkan data
    if (screenId === 'data') {
        tampilkanData();
    }
}
