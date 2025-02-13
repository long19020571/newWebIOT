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
                beginAtZero: true, // Giữ trục Y bắt đầu từ 0
                title: { display: true, text: 'Giá trị' }
            }
        }
    }
});

// ⏳ Lắng nghe dữ liệu theo thời gian thực
onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        allTimestamps = Object.keys(data).map(ts => new Date(parseInt(ts)).toLocaleString());
        allValues = Object.values(data).map(value => parseFloat(String(value).replace(/[^0-9.]/g, "")));
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

    // 🔥 Cập nhật trục Y theo giá trị lớn nhất của tập dữ liệu
    const maxValue = Math.max(...filteredValues, 0); // Giá trị lớn nhất (luôn ≥ 0)
    chart.options.scales.y.max = maxValue + 5; // Thêm khoảng trống trên biểu đồ

    // Cập nhật dữ liệu biểu đồ
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

// 📌 Biến lưu số điểm hiển thị (mặc định: 50)
let displayPoints = maxPoints;

// 🔄 Xử lý sự kiện cuộn chuột trên biểu đồ
document.getElementById("realtimeChart").addEventListener("wheel", (e) => {
    e.preventDefault(); // Ngăn chặn cuộn trang

    // Điều chỉnh số điểm hiển thị theo hướng cuộn
    if (e.deltaY < 0) {
        displayPoints = Math.min(displayPoints + 5, allTimestamps.length); // Cuộn lên: tăng số điểm
    } else {
        displayPoints = Math.max(displayPoints - 5, 10); // Cuộn xuống: giảm số điểm (tối thiểu 10)
    }

    updateChartWithScroll();
});

// 📌 Cập nhật biểu đồ khi cuộn
function updateChartWithScroll() {
    const totalPoints = allTimestamps.length;
    const startIdx = Math.max(0, totalPoints - displayPoints);
    const endIdx = totalPoints;

    chart.data.labels = allTimestamps.slice(startIdx, endIdx);
    chart.data.datasets[0].data = allValues.slice(startIdx, endIdx);
    chart.update();
}

