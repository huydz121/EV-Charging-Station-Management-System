# BÁO CÁO TIẾN ĐỘ DỰ ÁN — TUẦN 1

## PHÂN TÍCH & THIẾT KẾ HỆ THỐNG

---

## 1. MÔ TẢ ĐỀ TÀI

### Tên hệ thống

**EV Charging Station Management System** — Hệ thống Quản lý Trạm Sạc Xe Điện.

### Mục tiêu

- Xây dựng ứng dụng Web giúp khách hàng tìm kiếm trạm sạc xe điện trên bản đồ, đặt chỗ sạc, theo dõi quá trình sạc thời gian thực và thanh toán qua ví điện tử.
- Cung cấp bảng quản trị (Admin Dashboard) cho phép vận hành viên quản lý hạ tầng trạm sạc, theo dõi doanh thu và xử lý sự cố bảo trì.
- Tích hợp cổng thanh toán PayOS để khách hàng nạp tiền qua VietQR một cách tự động.

### Đối tượng sử dụng

- **Khách hàng (Customer)**: Người sử dụng dịch vụ sạc xe, tạo doanh thu.
- **Quản trị viên (Admin)**: Nhân viên vận hành hệ thống, quản lý hạ tầng.
- **PayOS Gateway**: Hệ thống bên ngoài, tự động xác nhận giao dịch ngân hàng qua Webhook.

### Chức năng chính

- **Xác thực**: Đăng ký, Đăng nhập, Xác thực OTP qua Email, Khôi phục mật khẩu.
- **Khách hàng**: Xem bản đồ trạm sạc (GIS), Đặt chỗ sạc, Bắt đầu/Dừng phiên sạc, Nạp ví điện tử, Xem lịch sử giao dịch, Quản lý hồ sơ cá nhân.
- **Quản trị**: Dashboard thống kê doanh thu, CRUD Trạm sạc, Quản lý người dùng, Cấu hình bảng giá điện, Báo cáo kế toán, Quản lý bảo trì.

---

## 2. PHÂN TÍCH CHỨC NĂNG

### 2.1. Đăng nhập / Đăng ký

- Người dùng đăng ký bằng Email + Mật khẩu mạnh (yêu cầu ít nhất 1 chữ hoa + 1 ký tự đặc biệt).
- Server băm mật khẩu bằng bcrypt (12 rounds) trước khi lưu vào CSDL.
- Gửi mã OTP 6 số qua Email (Nodemailer) để kích hoạt tài khoản.
- Đăng nhập bằng Email + Mật khẩu → Server tạo Session Cookie (lưu trong MongoDB qua connect-mongo, thời hạn 7 ngày) → Phân quyền theo role (`customer` / `admin`).

### 2.2. Quản lý người dùng (Admin)

- Admin xem danh sách toàn bộ khách hàng.
- Admin khóa/mở tài khoản người dùng vi phạm (toggle trạng thái `isActive`).
- Admin xóa tài khoản.

### 2.3. CRUD dữ liệu (Trạm sạc)

- **Create**: Admin thêm mới trạm sạc, nhập tên, địa chỉ, tọa độ GPS (GeoJSON), đơn giá điện, danh sách súng sạc (connectors) với loại đầu cắm và công suất.
- **Read**: Hiển thị danh sách trạm sạc dạng Grid Card có tìm kiếm. Khách hàng xem trạm trên bản đồ Leaflet.js.
- **Update**: Admin sửa thông tin trạm, thêm/bớt súng sạc, điều chỉnh giá, thay đổi trạng thái (active/inactive/maintenance).
- **Delete**: Admin xóa trạm sạc kèm xác nhận SweetAlert2 chống xóa nhầm.

### 2.4. Tìm kiếm

- Khách hàng tìm trạm sạc theo tên hoặc địa chỉ trên bản đồ.
- Hệ thống sử dụng chỉ mục `2dsphere` của MongoDB để truy vấn không gian (Geospatial Query), hỗ trợ lọc các trạm theo tọa độ lân cận.
- Client-side search: lọc và highlight trạm trên bản đồ Leaflet theo từ khóa.

### 2.5. Thống kê

- Admin Dashboard hiển thị các chỉ số KPI: Tổng trạm sạc (active/total), Tổng phiên sạc (đang sạc/tổng), Doanh thu (triệu VNĐ), Số phiếu bảo trì.
- Biểu đồ doanh thu theo thời gian — tuần/tháng/năm (Chart.js Bar Chart).
- Biểu đồ trạng thái trạm sạc (Chart.js Doughnut Chart).
- Bảng 10 phiên sạc gần đây nhất.

---

## 3. THIẾT KẾ MONGODB

### 3.1. Danh sách Collections

- **`users`**: Tài khoản người dùng (Customer & Admin).
- **`stations`**: Hạ tầng trạm sạc + súng sạc nhúng (embedded).
- **`chargingsessions`**: Hóa đơn phiên sạc điện.
- **`payments`**: Lịch sử giao dịch tài chính (nạp ví / trừ tiền / hoàn tiền).
- **`vehicles`**: Phương tiện xe điện của khách.
- **`reservations`**: Phiếu đặt chỗ giữ súng sạc.
- **`pricerates`**: Bảng giá điện theo khung giờ.
- **`maintenances`**: Nhật ký bảo trì sự cố.

### 3.2. Document mẫu

**Collection `users`:**

```json
{
  "_id": "ObjectId('665a1b2c3d4e5f6789012345')",
  "fullName": "Nguyễn Văn An",
  "email": "an.nguyen@gmail.com",
  "password": "$2b$12$hashedPasswordHere...",
  "role": "customer",
  "balance": 500000,
  "isActive": true,
  "otp": null,
  "otpExpires": null,
  "vehicles": [
    { "name": "VinFast VF8", "licensePlate": "77A-12345", "batteryCapacity": 82 }
  ],
  "createdAt": "2026-05-01T08:00:00Z"
}
```

**Collection `stations` (có embedded documents):**

```json
{
  "_id": "ObjectId('665b2c3d4e5f67890124567')",
  "name": "Trạm sạc VinFast Quy Nhơn",
  "address": "123 Nguyễn Huệ, TP Quy Nhơn, Bình Định",
  "location": {
    "type": "Point",
    "coordinates": [109.2215, 13.7788]
  },
  "pricePerKwh": 4500,
  "status": "active",
  "connectors": [
    { "type": "CCS", "power": 50, "status": "available" },
    { "type": "Type2", "power": 22, "status": "in_use" }
  ],
  "operatingHours": { "open": "00:00", "close": "23:59" },
  "rating": 4.5,
  "totalRatings": 12,
  "totalSessions": 80,
  "totalRevenue": 5600000,
  "createdAt": "2026-05-01T00:00:00Z"
}
```

**Collection `chargingsessions` (reference):**

```json
{
  "_id": "ObjectId('665c3d4e5f678901234567890')",
  "user": "ObjectId('665a1b2c...')",
  "station": "ObjectId('665b2c3d...')",
  "connectorIndex": 0,
  "status": "completed",
  "startTime": "2026-05-10T14:00:00Z",
  "endTime": "2026-05-10T14:45:00Z",
  "energyDelivered": 15.5,
  "pricePerKwh": 4500,
  "totalCost": 69750,
  "batteryStart": 20,
  "batteryEnd": 85,
  "paymentStatus": "paid"
}
```

**Collection `payments`:**

```json
{
  "_id": "ObjectId('665d4e5f67890123456789001')",
  "user": "ObjectId('665a1b2c...')",
  "session": "ObjectId('665c3d4e...')",
  "type": "topup",
  "amount": 500000,
  "method": "payos",
  "status": "completed",
  "payosOrderCode": 241001,
  "payosPaymentLink": "https://pay.payos.vn/...",
  "description": "Nạp ví qua VietQR",
  "transactionDate": "2026-05-10T13:30:00Z"
}
```

### 3.3. Quan hệ dữ liệu (Data Relationships)

Hệ thống sử dụng linh hoạt các mối quan hệ **1-N (One-to-Many)** và **N-N (Many-to-Many)** thông qua collection trung gian để mô tả thực tế:

```
User ──1:N──► Vehicle          (Một khách hàng sở hữu nhiều xe)
User ──1:N──► Payment          (Một khách có nhiều lịch sử giao dịch)
User ──1:N──► Reservation      (Một khách đặt nhiều lịch sạc)
User ──1:N──► ChargingSession  ◄──N:1── Station
              ↑ Collection trung gian giải quyết quan hệ N-N giữa User và Station
Station ──1:N──► Maintenance   (Một trạm có nhiều phiếu bảo trì)
ChargingSession ──1:N──► Payment (Một phiên sạc có thể sinh nhiều giao dịch)
```

### 3.4. Chiến lược Thiết kế: Embedded vs Reference

Để tối ưu hóa hiệu suất truy vấn trong MongoDB (NoSQL), hệ thống kết hợp cả hai mô hình thiết kế:

**1. Mô hình Embedded (Nhúng Dữ liệu):**

- **Áp dụng cho:** Mảng súng sạc (`connectors`) bên trong `stations`; Mảng xe (`vehicles`) bên trong `users`.
- **Lý do thiết kế:** Súng sạc là thành phần phụ thuộc chặt chẽ vào trạm sạc. Vòng đời của súng sạc sinh ra và mất đi cùng với trạm sạc. Ứng dụng khách hàng luôn cần hiển thị thông tin trạm sạc KÈM THEO trạng thái súng sạc ngay trên bản đồ. Việc nhúng thẳng mảng `connectors` vào document `stations` giúp MongoDB chỉ cần thực hiện **1 thao tác đọc** (Read Operation) là lấy được toàn bộ dữ liệu, tối ưu hóa tốc độ load bản đồ thay vì phải JOIN (`$lookup`) từ một collection khác.

**2. Mô hình Reference (Tham chiếu Khóa ngoại):**

- **Áp dụng cho:** Các collection giao dịch cốt lõi (`chargingsessions`, `payments`, `reservations`, `maintenances`).
- **Lý do thiết kế:** Dữ liệu giao dịch có tốc độ tăng trưởng rất nhanh và không có giới hạn (Unbounded Growth). Nếu dùng mô hình Embedded sẽ gây phình to document vượt quá giới hạn 16MB của MongoDB. Do đó, hệ thống bắt buộc dùng Reference (tham chiếu qua `ObjectId`) trỏ về `users` và `stations`. Việc này đảm bảo chuẩn hóa dữ liệu, tránh dư thừa và chống dị thường cập nhật (Ví dụ: Admin đổi tên Trạm sạc thì tên trạm trong toàn bộ lịch sử hóa đơn cũng tự động cập nhật theo do chỉ lưu Khóa ngoại).

---

## 4. THIẾT KẾ API

Hệ thống được thiết kế theo mô hình MVC, định tuyến phân nhóm theo vai trò người dùng. Mỗi nhóm route được bảo vệ bởi middleware xác thực (`isAuthenticated`) và phân quyền (`isAdmin` / `isCustomer`).

### API Xác thực — `/auth`

- `GET /auth/login` : Hiển thị trang đăng nhập.
- `POST /auth/login` : Xác thực thông tin, tạo Session Cookie.
- `GET /auth/register` : Hiển thị trang đăng ký.
- `POST /auth/register` : Đăng ký tài khoản, gửi OTP xác thực Email.
- `GET /auth/verify-otp` : Hiển thị trang nhập mã OTP.
- `POST /auth/verify-otp` : Xác nhận OTP, kích hoạt tài khoản.
- `GET /auth/forgot-password` : Hiển thị trang quên mật khẩu.
- `POST /auth/forgot-password` : Gửi OTP khôi phục mật khẩu qua Email.
- `GET /auth/reset-password` : Hiển thị trang đặt lại mật khẩu.
- `POST /auth/reset-password` : Lưu mật khẩu mới (hash bcrypt).
- `GET /auth/logout` : Hủy Session, đăng xuất.

### API Khách hàng — `/customer` (yêu cầu `isAuthenticated` + `isCustomer`)

- `GET /customer` : Trang chủ — danh sách trạm sạc + số dư ví.
- `GET /customer/map` : Bản đồ trạm sạc (Leaflet.js).
- `GET /customer/stations/search` : Tìm kiếm trạm sạc (geo/text).
- `GET /customer/stations/:id` : Xem chi tiết trạm sạc + danh sách súng sạc.
- `POST /customer/reservations` : Đặt chỗ giữ súng sạc.
- `PUT /customer/reservations/:id/cancel` : Hủy lệnh đặt chỗ.
- `POST /customer/charging/start` : Bắt đầu phiên sạc (kiểm tra ví ≥ 200.000đ).
- `GET /customer/charging/:id` : Xem giao diện phiên sạc (timer, tiến độ).
- `GET /customer/charging/:id/status` : Polling trạng thái sạc real-time (JSON).
- `POST /customer/charging/:id/stop` : Dừng sạc, tính tiền, trừ ví.
- `POST /customer/payment/topup` : Tạo lệnh nạp tiền — sinh mã VietQR (PayOS).
- `GET /customer/payment/check/:orderCode` : Polling kiểm tra trạng thái nạp tiền.
- `GET /customer/payment/success` : Callback PayOS khi thanh toán thành công.
- `GET /customer/payment/cancel` : Callback PayOS khi hủy thanh toán.
- `GET /customer/history` : Lịch sử phiên sạc (phân trang).
- `GET /customer/history/:id` : Chi tiết một phiên sạc.
- `GET /customer/profile` : Xem hồ sơ cá nhân + ví điện tử.
- `PUT /customer/profile` : Cập nhật thông tin cá nhân.
- `PUT /customer/profile/password` : Đổi mật khẩu.

### API Quản trị — `/admin` (yêu cầu `isAuthenticated` + `isAdmin`)

- `GET /admin/dashboard` : Dashboard thống kê KPI + biểu đồ.
- `GET /admin/stations` : Danh sách trạm sạc (Grid Card).
- `GET /admin/stations/create` : Form thêm trạm sạc mới.
- `POST /admin/stations` : Lưu trạm sạc mới vào CSDL.
- `GET /admin/stations/:id/edit` : Form sửa thông tin trạm sạc.
- `PUT /admin/stations/:id` : Cập nhật thông tin trạm sạc.
- `DELETE /admin/stations/:id` : Xóa trạm sạc.
- `GET /admin/users` : Danh sách người dùng.
- `PUT /admin/users/:id/toggle` : Khóa/Mở tài khoản người dùng.
- `DELETE /admin/users/:id` : Xóa tài khoản người dùng.
- `GET /admin/maintenance` : Danh sách phiếu bảo trì.
- `POST /admin/maintenance` : Tạo phiếu bảo trì mới.
- `PUT /admin/maintenance/:id` : Cập nhật trạng thái bảo trì.
- `GET /admin/reports` : Báo cáo doanh thu + thống kê.
- `GET /admin/settings` : Trang cấu hình hệ thống.
- `GET /admin/prices` : Danh sách bảng giá điện (JSON).
- `POST /admin/prices` : Tạo bảng giá mới.
- `PUT /admin/prices/:id` : Cập nhật bảng giá.
- `DELETE /admin/prices/:id` : Xóa bảng giá.
- `POST /admin/refunds` : Xử lý hoàn tiền cho khách hàng.
- `GET /admin/profile` : Xem hồ sơ quản trị viên.

### Webhook — Public (không yêu cầu xác thực)

- `POST /webhook/payos` : Nhận callback từ PayOS khi giao dịch thành công → cập nhật ví.

---

## 5. SETUP PROJECT

Dự án đã được khởi tạo và cài đặt thành công theo đúng yêu cầu:

### 5.1. NodeJS

- **Môi trường Runtime:** NodeJS v22+.
- **Quản lý Package:** Sử dụng `npm init -y` để khởi tạo `package.json`.
- **Cấu hình:** Khai báo script `"start": "node server.js"` để dễ dàng khởi động máy chủ.

### 5.2. Express

- **Framework:** Cài đặt thư viện `express` (phiên bản 5.x) làm web server.
- **Middleware:** Tích hợp `express.json()` và `express.urlencoded()` để nhận dữ liệu API. Sử dụng `method-override` để hỗ trợ PUT/DELETE từ HTML form.
- **Routing:** Phân tách các file định tuyến riêng biệt theo vai trò (`authRoutes.js`, `customerRoutes.js`, `adminRoutes.js`).
- **Session:** Sử dụng `express-session` kết hợp `connect-mongo` để lưu session trực tiếp trong MongoDB.
- **Trạng thái:** File `server.js` đã hoạt động thành công trên `http://localhost:3000`.

### 5.3. MongoDB

- **Cơ sở dữ liệu:** Hệ thống dùng MongoDB Atlas (Cloud) đảm bảo tính sẵn sàng cao.
- **ODM (Object Data Modeling):** Sử dụng thư viện `mongoose` v9.x để quản lý Schema.
- **Kết nối:** Viết hàm `connectDB()` trong `config/database.js` gọi đến `MONGODB_URI` từ biến môi trường.
- **GeoIndex:** Collection `stations` sử dụng chỉ mục `2dsphere` trên trường `location` để hỗ trợ truy vấn không gian.
- **Trạng thái:** Kết nối cơ sở dữ liệu thành công — `MongoDB connected successfully`.

### 5.4. GitHub Repository

- **Khởi tạo:** Đã khởi tạo Git cục bộ (`git init`) và liên kết Remote Repository trên GitHub.
- **Bảo mật:** Tạo file `.gitignore` để ẩn thư mục `node_modules/` và cấu hình biến môi trường `.env` chống rò rỉ khóa bí mật.
- **Trạng thái:** Đã commit các cấu trúc nền tảng của Tuần 1 và Push code lên nhánh `main`.
- **Link Git:** https://github.com/huydz121/EV-Charging-Station-Management-System

### Cấu trúc thư mục Tuần 1 trên GitHub:

```
EV-Charging-Station-Management-System/
├── config/
│   ├── database.js          # Kết nối MongoDB
│   └── index.js             # Export biến môi trường
├── models/
│   ├── User.js              # Schema người dùng
│   ├── Station.js           # Schema trạm sạc (embedded connectors)
│   ├── ChargingSession.js   # Schema phiên sạc
│   ├── Payment.js           # Schema giao dịch
│   ├── Vehicle.js           # Schema xe điện
│   ├── Reservation.js       # Schema đặt chỗ
│   ├── PriceRate.js         # Schema bảng giá
│   └── Maintenance.js       # Schema bảo trì
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── server.js                # Entry point — Express server
```

---

## SẢN PHẨM TUẦN 1

- **Sản phẩm 1**: Báo cáo phân tích & thiết kế — **Hoàn thành**
- **Sản phẩm 2**: Link GitHub (https://github.com/huydz121/EV-Charging-Station-Management-System) — **Hoàn thành**
- **Sản phẩm 3**: MongoDB Schema (8 models) — **Hoàn thành**
- **Sản phẩm 4**: API Design (50+ endpoints) — **Hoàn thành**
- **Sản phẩm 5**: Express server chạy được (`http://localhost:3000`) — **Hoàn thành**
- **Sản phẩm 6**: Connect MongoDB thành công (MongoDB Atlas connected) — **Hoàn thành**
