
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Cấu hình Firebase (thay thế bằng cấu hình của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyAiR_IOyPcZbGwl9nrNFzPzWdQrxPq5YVA",
  authDomain: "newiot-487f5.firebaseapp.com",
  databaseURL: "https://newiot-487f5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "newiot-487f5",
  storageBucket: "newiot-487f5.firebasestorage.app",
  messagingSenderId: "818446454604",
  appId: "1:818446454604:web:8182040aafa6cceadac9e9",
  measurementId: "G-S6ZZ7ZQJ9B"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, 'sensor/data'); // Đường dẫn đến dữ liệu

// Khởi tạo Chart.js
const ctx = document.getElementById('realtimeChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Giá trị cảm biến',
            data: [],
            borderColor: 'blue',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            x: { display: true },
            y: { beginAtZero: true }
        }
    }
});

// Lắng nghe dữ liệu từ Firebase và cập nhật biểu đồ
onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        
        chart.data.labels = keys;
        chart.data.datasets[0].data = values;
        chart.update();
    }
});
