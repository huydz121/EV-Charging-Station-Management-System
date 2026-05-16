# ⚡ EV Charging Station Management System

Hệ thống quản lý trạm sạc xe điện với giao diện Dark Theme hiện đại.

## 🚀 Công nghệ

- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **View Engine:** EJS + Bootstrap 5
- **Charts:** Chart.js
- **Map:** Leaflet.js (OpenStreetMap)
- **Payment:** PayOS
- **Auth:** Session-based (express-session + connect-mongo)

## 📦 Cài đặt

```bash
# 1. Cài đặt dependencies
npm install

# 2. Cấu hình .env (đã có sẵn file mẫu)
# Chỉnh sửa MONGODB_URI nếu cần

# 3. Seed dữ liệu mẫu
npm run seed

# 4. Chạy server
npm run dev
```

## 🔐 Tài khoản mặc định

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | admin@evcharge.vn      | admin123      |
| Customer | customer@evcharge.vn   | customer123   |

## 🔗 URL

- **Trang chủ:** http://localhost:3000
- **Customer Login:** http://localhost:3000/auth/login
- **Admin Login:** http://localhost:3000/auth/admin/login

## 📱 Tính năng

### Khách hàng (Mobile)
- Đăng ký / Đăng nhập
- Xem trạm sạc gần đây
- Tìm trạm trên bản đồ
- Xem chi tiết trạm + bắt đầu sạc
- Theo dõi phiên sạc realtime
- Lịch sử sạc
- Ví điện tử (nạp tiền qua PayOS)
- Quản lý tài khoản

### Quản trị viên (Desktop)
- Dashboard với KPI và biểu đồ
- Quản lý trạm sạc (CRUD)
- Quản lý người dùng
- Báo cáo doanh thu
- Quản lý bảo trì
- Hoàn tiền

## 📂 Cấu trúc thư mục

```
ev-charging-system/
├── config/         # Cấu hình DB & env
├── controllers/    # Logic xử lý (admin + customer)
├── middlewares/     # Auth, role, error handler
├── models/         # Mongoose models
├── public/         # Static files (CSS, JS, images)
├── routes/         # Express routes
├── services/       # PayOS payment service
├── views/          # EJS templates
├── server.js       # Entry point
├── seed.js         # Seed data
└── .env            # Environment variables
```
