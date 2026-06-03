# ⚡ EV Charging Station Management System

Hệ thống quản lý trạm sạc xe điện với giao diện Dark Theme hiện đại, được xây dựng bài bản theo kiến trúc **MVC**, tích hợp sâu các module nâng cao của Node.js như **Socket.IO, File System, Stream, và EventEmitter**.

## 🚀 Công nghệ
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **View Engine:** EJS + Bootstrap 5 + Tự code CSS Component
- **Map:** Leaflet.js (OpenStreetMap)
- **Realtime & Event:** Socket.IO, EventEmitter
- **Tệp tĩnh & Upload:** Multer, File System (fs), Fast-csv
- **Payment:** PayOS API (Quét mã VietQR)
- **Auth:** Session-based (express-session + connect-mongo), Mã hóa Bcrypt, Xác thực OTP qua Email (Nodemailer).

## 📦 Cài đặt
### 1. Cài đặt thư viện (Dependencies)
```bash
npm install
```

### 2. Cấu hình .env
Hệ thống sử dụng các biến môi trường để bảo mật. (File `.env` mẫu đã có sẵn trong dự án).
```bash
# Chỉnh sửa MONGODB_URI nếu cần thiết để trỏ tới DB của bạn
```

### 3. Đổ dữ liệu mẫu (Seed Data)
Chạy lệnh sau để tự động tạo tài khoản Admin và tạo sẵn các trạm sạc mẫu trên bản đồ:
```bash
npm run seed
```

### 4. Chạy server
```bash
npm start
```
*Ghi chú: Nếu dùng môi trường phát triển (Dev) có thể dùng `npm run dev`.*

## 🔐 Tài khoản mặc định
| Vai trò | Email | Mật khẩu (Password) |
| --- | --- | --- |
| **Admin** (Quản trị) | admin@evcharge.vn | admin |
| **Customer** (Khách) | Mở web lên và tự Đăng ký tài khoản bằng Email cá nhân | (Theo bạn đặt) |

## 🔗 URL (Đường dẫn truy cập)
- **Trang chủ / Đăng nhập:** `http://localhost:3000` hoặc `http://localhost:3000/auth/login`
*(Lưu ý: Hệ thống chỉ dùng chung 1 cổng Đăng nhập. Nếu tài khoản là Admin, hệ thống tự điều hướng vào Dashboard quản trị. Nếu là Khách, tự điều hướng ra Bản đồ).*

## 📱 Các tính năng cốt lõi
### Khách hàng (Giao diện Web App / Mobile)
- Đăng ký / Đăng nhập / Xác thực OTP qua Email / Quên mật khẩu.
- Xem trạm sạc xung quanh và Tìm trạm trên bản đồ số.
- Xem chi tiết trạm sạc (khoảng cách, cổng sạc) + Bắt đầu mô phỏng phiên sạc.
- Ví điện tử: Nạp tiền thông qua quét mã QR động PayOS.
- Lịch sử sạc và lịch sử giao dịch.
- Quản lý tài khoản: Upload đổi ảnh đại diện (Avatar).

### Quản trị viên (Giao diện Desktop Dashboard)
- **Dashboard:** Thống kê KPI, biểu đồ doanh thu và nhận **Thông báo nạp tiền Realtime** (Socket.IO).
- **Quản lý trạm sạc:** Thêm, Sửa, Xóa và theo dõi trạng thái trạm.
- **Quản lý người dùng:** Phong chức Admin, Khóa tài khoản vi phạm.
- **Báo cáo doanh thu:** Xuất dữ liệu thống kê ra file `.csv` (Tải về máy tính).
- **Nhật ký hệ thống:** Tự động bắt sự kiện lỗi (Event) và ghi Log vào tệp `app.log`.

## 📂 Cấu trúc thư mục chuẩn MVC
```text
ev-charging-system/
├── controllers/    # Logic xử lý chính (Admin & Customer)
├── middlewares/    # Phân quyền Auth, Role, Hứng File (Multer)
├── models/         # Khai báo schema Mongoose (Database)
├── public/         # File tĩnh (CSS, JS, Hình ảnh, Thư mục uploads chứa Avatar & CSV)
├── routes/         # Khai báo các đường dẫn API / Web
├── services/       # Giao tiếp API bên thứ 3 (PayOS, Nodemailer)
├── utils/          # Các tệp tiện ích mở rộng (System Logger)
├── views/          # Giao diện HTML (EJS templates)
├── server.js       # Entry point khởi chạy Server
├── seed.js         # Kịch bản đổ dữ liệu mẫu
└── .env            # Biến môi trường
```
