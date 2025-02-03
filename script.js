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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Tham chiếu đến node "sensorData" trong Realtime Database
const sensorDataRef = database.ref("sensorData");

// Lắng nghe sự thay đổi dữ liệu
sensorDataRef.on("value", (snapshot) => {
  const sensorDataList = document.getElementById("sensor-data");
  sensorDataList.innerHTML = ""; // Xóa dữ liệu cũ

  const data = snapshot.val(); // Lấy dữ liệu từ snapshot

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

// Hàm thêm dữ liệu mẫu vào Realtime Database (tùy chọn)
function addSampleData() {
  const timestamp = new Date().toISOString();
  const value = Math.floor(Math.random() * 100); // Giá trị ngẫu nhiên từ 0 đến 100

  sensorDataRef.push({
    timestamp: timestamp,
    value: value
  })
  .then(() => {
    console.log("Sample data added successfully!");
  })
  .catch((error) => {
    console.error("Error adding sample data: ", error);
  });
}

// Gọi hàm để thêm dữ liệu mẫu (tùy chọn)
// addSampleData();
