// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 🔥 Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAJGktb1tH1uCvfHNMP1XDRAuKjb7qr0mY",
  authDomain: "long4-96478.firebaseapp.com",
  databaseURL: "https://long4-96478-default-rtdb.firebaseio.com",
  projectId: "long4-96478",
  storageBucket: "long4-96478.firebasestorage.app",
  messagingSenderId: "329904377529",
  appId: "1:329904377529:web:98a114073f5fef27795568"
};

// ⚡ Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, 'temp');

// Lưu dữ liệu để xử lý
let allTimestamps = [];
let allValues = [];
const maxPoints = 50; // Giới hạn số điểm hiển thị

// 🖌 Khởi tạo biểu đồ Chart.js
const ctx = document.getElementById('realtimeChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Dữ liệu cảm biến',
            data: [],
            borderColor: 'blue',
            borderWidth: 2,
            pointRadius: 3,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Thời gian' }
            },
            y: {
                min: 0, // Giá trị nhỏ nhất
                max: 100, // Điều chỉnh theo cảm biến thực tế
                title: { display: true, text: 'Giá trị' }
            }
        }
    }
});

// ⏳ Lắng nghe dữ liệu theo thời gian thực
onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        allTimestamps = Object.keys(data);
        allValues = parseFloat(Object.values(data).replace(/[^0-9.]/g, ""));
      console.log("📊 Dữ liệu allValues sau khi xử lý:", data);
        updateChart();
    }
});

// 📌 Cập nhật biểu đồ dựa trên khoảng thời gian đã chọn
function updateChart() {
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    let filteredTimestamps = [];
    let filteredValues = [];

    for (let i = 0; i < allTimestamps.length; i++) {
        if ((!startTime || allTimestamps[i] >= startTime) && (!endTime || allTimestamps[i] <= endTime)) {
            filteredTimestamps.push(allTimestamps[i]);
            filteredValues.push(allValues[i]);
        }
    }

    // Giới hạn số điểm hiển thị để tránh lag
    if (filteredTimestamps.length > maxPoints) {
        const step = Math.ceil(filteredTimestamps.length / maxPoints);
        filteredTimestamps = filteredTimestamps.filter((_, i) => i % step === 0);
        filteredValues = filteredValues.filter((_, i) => i % step === 0);
    }

    chart.data.labels = filteredTimestamps;
    chart.data.datasets[0].data = filteredValues;
    chart.update();
}

// 🎛 Xử lý sự kiện khi chọn thời gian
document.getElementById("startTime").addEventListener("change", updateChart);
document.getElementById("endTime").addEventListener("change", updateChart);
document.getElementById("scrollRange").addEventListener("input", (e) => {
    const scrollValue = parseInt(e.target.value);
    const totalPoints = allTimestamps.length;
    const startIdx = Math.max(0, totalPoints - scrollValue - maxPoints);
    const endIdx = Math.min(totalPoints, startIdx + maxPoints);

    chart.data.labels = allTimestamps.slice(startIdx, endIdx);
    chart.data.datasets[0].data = allValues.slice(startIdx, endIdx);
    chart.update();
});
