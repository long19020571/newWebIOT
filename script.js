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
        maintainAspectRatio: false, // Cho phép điều chỉnh kích thước tự do
        scales: {
            x: {
                title: { display: true, text: 'Thời gian' }
            },
            y: {
                beginAtZero: true, // Giữ trục y bắt đầu từ 0
                title: { display: true, text: 'Giá trị' }
            }
        }
    }
});

// ⏳ Lắng nghe dữ liệu mới theo thời gian thực
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

// 📌 Cập nhật biểu đồ
function updateChart() {
    chart.data.labels = allTimestamps;
    chart.data.datasets[0].data = allValues;
    chart.update();
}

// 📱 Điều chỉnh kích thước khi thay đổi màn hình
window.addEventListener("resize", () => {
    chart.resize();
});
