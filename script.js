// Cấu hình Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Lấy dữ liệu từ Firestore và hiển thị lên trang web
db.collection("sensorData").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
    const sensorDataList = document.getElementById("sensor-data");
    sensorDataList.innerHTML = ""; // Xóa dữ liệu cũ

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `Timestamp: ${data.timestamp.toDate()}, Value: ${data.value}`;
        sensorDataList.appendChild(listItem);
    });
});
