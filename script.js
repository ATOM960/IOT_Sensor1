
// --- 1. KONFIGURASI GRAFIK (Chart.js) ---
const ctx = document.getElementById('sensorChart').getContext('2d');
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Waktu
        datasets: [{
            label: 'Kelembaban Tanah (%)',
            data: [],
            borderColor: '#e94560',
            backgroundColor: 'rgba(233, 69, 96, 0.2)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#2a2a40' },
                ticks: { color: '#aeb8c4' }
            },
            x: {
                grid: { color: '#2a2a40' },
                ticks: { color: '#aeb8c4' }
            }
        },
        plugins: {
            legend: { labels: { color: '#fff' } }
        }
    }
});

// --- 2. FUNGSI UPDATE DATA ---

// Fungsi ini mensimulasikan data dari sensor (Ganti ini dengan fetch() nanti)
function getSensorData() {
    // Simulasi angka acak
    const moisture = Math.floor(Math.random() * (80 - 30) + 30); // 30-80%
    const temp = (Math.random() * (35 - 20) + 20).toFixed(1);    // 20-35 C
    const ph = (Math.random() * (7.5 - 5.5) + 5.5).toFixed(1);   // 5.5-7.5 pH
    
    return { moisture, temp, ph };
}

function updateDashboard() {
    const data = getSensorData();

    // Update Angka di Kartu
    document.getElementById('moisture-val').innerText = data.moisture;
    document.getElementById('temp-val').innerText = data.temp;
    document.getElementById('ph-val').innerText = data.ph;

    // Update Waktu
    const now = new Date();
    document.getElementById('time').innerText = now.toLocaleTimeString();

    // Update Grafik (Hanya kelembaban untuk contoh)
    const timeLabel = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    
    // Tambah data ke grafik
    sensorChart.data.labels.push(timeLabel);
    sensorChart.data.datasets[0].data.push(data.moisture);

    // Batasi grafik agar tidak terlalu panjang (max 10 data)
    if (sensorChart.data.labels.length > 10) {
        sensorChart.data.labels.shift();
        sensorChart.data.datasets[0].data.shift();
    }
    sensorChart.update();

    // Logika Warna (Indikator)
    updateColor('moisture-val', data.moisture, 40, 70);
    updateColor('ph-val', data.ph, 6.0, 7.0);
}

function updateColor(elementId, value, min, max) {
    const el = document.getElementById(elementId);
    el.className = 'value'; // Reset class
    
    if (value < min) {
        el.classList.add('status-danger'); // Merah
    } else if (value > max) {
        el.classList.add('status-warning'); // Kuning
    } else {
        el.classList.add('status-good'); // Hijau
    }
}

// Jalankan update setiap 2 detik
// setInterval(updateDashboard, 2000);

// Jalankan sekali saat load
updateDashboard();

/* 
--- CATATAN UNTUK PENGEMBANG ---
Untuk menghubungkan dengan ESP32/Arduino asli, ganti fungsi getSensorData() 
dengan kode fetch() seperti ini:

async function getSensorData() {
    try {
        const response = await fetch('http://192.168.1.100/data'); // IP ESP32 Anda
        const data = await response.json();
        return {
            moisture: data.kelembaban,
            temp: data.suhu,
            ph: data.ph
        };
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}
*/
