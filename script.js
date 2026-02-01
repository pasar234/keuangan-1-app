function openScreen(screenId) {
    // Sembunyikan semua screen
    document.querySelectorAll('.screen').forEach(s => {
        s.style.display = 'none';
    });
    
    // Tampilkan screen yang dipilih
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.style.display = 'block';
    }

    // Refresh tabel jika membuka tab Data
    if (screenId === 'data') {
        renderTables();
    }
}
