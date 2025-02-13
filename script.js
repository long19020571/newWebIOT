// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// 📅 Format thời gian theo múi giờ Việt Nam
const formatter = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false
});

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
                min: 0, 
                max: 100, 
                title: { display: true, text: 'Giá trị' }
            }
        }
    }
});

// ⏳ Lắng nghe dữ liệu mới theo thời gian thực (chỉ cập nhật dữ liệu mới)
onChildAdded(dataRef, (snapshot) => {
    const ts = parseInt(snapshot.key);
    const value = parseFloat(String(snapshot.val()).replace(/[^0-9.]/g, ""));

    if (!isNaN(ts) && !isNaN(value)) {
        allTimestamps.push(formatter.format(new Date(ts)));
        allValues.push(value);

        if (allTimestamps.length > maxPoints) {
            allTimestamps.shift();
            allValues.shift();
        }

        updateChart();
    }
});

// 📌 Cập nhật biểu đồ dựa trên khoảng thời gian đã chọn
function updateChart() {
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    let filteredData = allTimestamps.map((timestamp, i) => ({ timestamp, value: allValues[i] }))
        .filter(entry => (!startTime || entry.timestamp >= startTime) && (!endTime || entry.timestamp <= endTime));

    let filteredTimestamps = filteredData.map(entry => entry.timestamp);
    let filteredValues = filteredData.map(entry => entry.value);

    // Giới hạn số điểm hiển thị
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

// 📜 Xử lý cuộn dữ liệu
document.getElementById("scrollRange").addEventListener("input", (e) => {
    const scrollValue = parseInt(e.target.value);
    const totalPoints = allTimestamps.length;
    const range = Math.min(maxPoints, totalPoints);
    const startIdx = Math.max(0, totalPoints - scrollValue - range);
    const endIdx = Math.min(totalPoints, startIdx + range);

    chart.data.labels = allTimestamps.slice(startIdx, endIdx);
    chart.data.datasets[0].data = allValues.slice(startIdx, endIdx);
    chart.update();
});
