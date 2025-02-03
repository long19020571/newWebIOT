import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Cấu hình Firebase
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

// Tham chiếu đến node "sensorData"
const sensorDataRef = ref(database, "sensorData");

// Lắng nghe sự thay đổi dữ liệu
onValue(sensorDataRef, (snapshot) => {
    const sensorDataList = document.getElementById("sensor-data");
    sensorDataList.innerHTML = "";

    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((key) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Timestamp: ${data[key].timestamp}, Value: ${data[key].value}`;
            sensorDataList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement("li");
        listItem.textContent = "No data available";
        sensorDataList.appendChild(listItem);
    }
});
