# BÀI 5: THIẾT KẾ CƠ SỞ DỮ LIỆU

---

## 5.1. CÁC THỰC THỂ VÀ THUỘC TÍNH

Dựa trên cấu trúc lớp ở Bài 4, hệ thống Quản lý trạm sạc xe điện được xây dựng cơ sở dữ liệu quan hệ với các thực thể và thuộc tính tiếng Anh đồng bộ như sau:

* **Customer (Khách hàng)**
  - Thuộc tính: `customerID`, `name`, `gender`, `phoneNumber`, `email`, `password`, `address`, `paymentMethods`, `balance`
* **Administrator (Quản trị viên)**
  - Thuộc tính: `adminID`, `username`, `password`, `managementPermissions`
* **ElectricVehicle (Xe điện)**
  - Thuộc tính: `vehicleId`, `customerId`, `licensePlate`, `vehicleModel`, `batteryCapacity`
* **ChargingStation (Trạm sạc)**
  - Thuộc tính: `stationId`, `name`, `address`, `locationCoordinates`, `totalChargers`, `operationStatus`
* **Charger (Trụ sạc)**
  - Thuộc tính: `chargerId`, `stationId`, `chargerType`, `maxPower`, `status`
* **Reservation (Đặt chỗ trước)**
  - Thuộc tính: `reservationId`, `customerId`, `chargerId`, `reservedStartTime`, `reservedEndTime`, `status`
* **ChargingSession (Phiên sạc)**
  - Thuộc tính: `sessionId`, `customerId`, `vehicleId`, `chargerId`, `startTime`, `endTime`, `energyConsumed`, `totalPrice`, `status`
* **PaymentInvoice (Hóa đơn thanh toán)**
  - Thuộc tính: `invoiceId`, `sessionId`, `amount`, `paymentMethod`, `transactionCode`, `timestamp`, `status`
* **StationReview (Đánh giá trạm sạc)**
  - Thuộc tính: `reviewId`, `customerId`, `stationId`, `rating`, `comment`, `timestamp`
* **StationMaintenance (Bảo trì trạm sạc)**
  - Thuộc tính: `maintenanceId`, `stationId`, `chargerId`, `maintenanceDate`, `status`
* **StationIncident (Sự cố trạm sạc)**
  - Thuộc tính: `incidentId`, `stationId`, `chargerId`, `description`, `timestamp`, `status`

---

## 5.2. MỐI QUAN HỆ GIỮA CÁC THỰC THỂ

* **Customer – Owns – ElectricVehicle**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 khách hàng sở hữu nhiều xe điện).
* **Customer – Makes – Reservation**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 khách hàng thực hiện nhiều đơn đặt chỗ trước).
* **Charger – Receives – Reservation**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 trụ sạc nhận nhiều lượt đặt chỗ theo thời gian).
* **Customer – Initiates – ChargingSession**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 khách hàng thực hiện nhiều phiên sạc).
* **ElectricVehicle – Undergoes – ChargingSession**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 xe điện tham gia vào nhiều phiên sạc).
* **Charger – Hosts – ChargingSession**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 trụ sạc phục vụ nhiều phiên sạc).
* **ChargingSession – Generates – PaymentInvoice**
  - *Mô tả:* Quan hệ 1 - 1 (1 phiên sạc tạo ra duy nhất 1 hóa đơn thanh toán).
* **ChargingStation – Contains – Charger**
  - *Mô tả:* Quan hệ thành phần (1 trạm sạc chứa nhiều trụ sạc).
* **Customer – Writes – StationReview**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 khách hàng gửi nhiều đánh giá trạm sạc).
* **ChargingStation – Receives – StationReview**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 trạm sạc nhận nhiều đánh giá từ khách hàng).
* **ChargingStation – Incident/Maintenance**
  - *Mô tả:* Quan hệ 1 - Nhiều (1 trạm sạc có nhiều phiếu bảo trì và báo cáo sự cố kỹ thuật).

---

## 5.3. CHUẨN HÓA 3NF

Các bảng dữ liệu trên hoàn toàn đạt chuẩn hóa 3NF:
* **Đạt chuẩn 1NF:** Tất cả các thuộc tính đều chứa giá trị nguyên tố đơn trị. Không có mảng hoặc nhóm lặp trong các ô dữ liệu (ví dụ: `paymentMethods` và `managementPermissions` được phân rã hoặc lưu dưới dạng quan hệ chuẩn).
* **Đạt chuẩn 2NF:** Đạt 1NF và toàn bộ các cột không phải khóa đều phụ thuộc hoàn toàn vào khóa chính (các bảng đều sử dụng khóa đơn duy nhất).
* **Đạt chuẩn 3NF:** Đạt 2NF và loại bỏ hoàn toàn các phụ thuộc bắc cầu. Các thông tin thực thể liên đới đều được phân tách rõ ràng thành các bảng riêng biệt (`Customer`, `ElectricVehicle`, `ChargingStation`, `Charger`), chỉ giữ lại các khóa ngoại để tham chiếu liên kết.

---

## 5.4. SƠ ĐỒ DATABASE DIAGRAM (ERD)

```plantuml
@startuml ERD_HeThong_English
skinparam linetype ortho
skinparam EntityBackgroundColor #F8F9FA
skinparam EntityBorderColor #343A40
skinparam EntityHeaderBackgroundColor #E9ECEF
skinparam ArrowColor #495057

entity "Customer" as cust {
  * customerID : VARCHAR [PK]
  --
  name : VARCHAR
  gender : VARCHAR
  phoneNumber : VARCHAR
  email : VARCHAR
  password : VARCHAR
  address : VARCHAR
  paymentMethods : VARCHAR
  balance : DECIMAL
}

entity "Administrator" as admin {
  * adminID : VARCHAR [PK]
  --
  username : VARCHAR
  password : VARCHAR
  managementPermissions : VARCHAR
}

entity "ElectricVehicle" as ev {
  * vehicleId : VARCHAR [PK]
  --
  * customerId : VARCHAR [FK]
  licensePlate : VARCHAR
  vehicleModel : VARCHAR
  batteryCapacity : FLOAT
}

entity "ChargingStation" as station {
  * stationId : VARCHAR [PK]
  --
  name : VARCHAR
  address : VARCHAR
  locationCoordinates : VARCHAR
  totalChargers : INT
  operationStatus : VARCHAR
}

entity "Charger" as charger {
  * chargerId : VARCHAR [PK]
  --
  * stationId : VARCHAR [FK]
  chargerType : VARCHAR
  maxPower : FLOAT
  status : VARCHAR
}

entity "Reservation" as res {
  * reservationId : VARCHAR [PK]
  --
  * customerId : VARCHAR [FK]
  * chargerId : VARCHAR [FK]
  reservedStartTime : DATETIME
  reservedEndTime : DATETIME
  status : VARCHAR
}

entity "ChargingSession" as session {
  * sessionId : VARCHAR [PK]
  --
  * customerId : VARCHAR [FK]
  * vehicleId : VARCHAR [FK]
  * chargerId : VARCHAR [FK]
  startTime : DATETIME
  endTime : DATETIME
  energyConsumed : FLOAT
  totalPrice : DECIMAL
  status : VARCHAR
}

entity "PaymentInvoice" as invoice {
  * invoiceId : VARCHAR [PK]
  --
  * sessionId : VARCHAR [FK]
  amount : DECIMAL
  paymentMethod : VARCHAR
  transactionCode : VARCHAR
  timestamp : DATETIME
  status : VARCHAR
}

entity "StationReview" as review {
  * reviewId : VARCHAR [PK]
  --
  * customerId : VARCHAR [FK]
  * stationId : VARCHAR [FK]
  rating : INT
  comment : TEXT
  timestamp : DATETIME
}

entity "StationMaintenance" as maint {
  * maintenanceId : VARCHAR [PK]
  --
  * stationId : VARCHAR [FK]
  * chargerId : VARCHAR [FK]
  maintenanceDate : DATETIME
  status : VARCHAR
}

entity "StationIncident" as incident {
  * incidentId : VARCHAR [PK]
  --
  * stationId : VARCHAR [FK]
  * chargerId : VARCHAR [FK]
  description : TEXT
  timestamp : DATETIME
  status : VARCHAR
}

cust ||--o{ ev : "owns"
cust ||--o{ res : "makes"
cust ||--o{ session : "starts"
cust ||--o{ review : "writes"
station ||--o{ charger : "contains"
station ||--o{ review : "receives"
station ||--o{ maint : "needs"
station ||--o{ incident : "has"
charger ||--o{ res : "reserved"
charger ||--o{ session : "hosts"
ev ||--o{ session : "charged"
session ||--o| invoice : "generates"
@enduml
```
