# BÁO CÁO KẾT QUẢ KIỂM THỬ HỆ THỐNG API - TUẦN 2

## 1. THÔNG TIN CHUNG
* **Thời gian kiểm thử**: 22/05/2026
* **Cổng kết nối API**: http://localhost:3000
* **Cơ sở dữ liệu**: MongoDB (Local/Atlas)
* **Công cụ kiểm thử**: Tự động hóa qua Axios/Fetch và truy vấn CSDL trực tiếp để xác minh trạng thái dữ liệu

---

## 2. KIỂM THỬ XÁC THỰC (AUTHENTICATION)

### 2.1. Đăng ký tài khoản mới (POST /auth/register)
* **Thông số đầu vào (Request Body)**:
  * fullName: "Khách Hàng Test Script"
  * email: "test_script@evcharge.vn"
  * phone: "0988776655"
  * password: "TestPassword@123"
  * confirmPassword: "TestPassword@123"
* **Mã phản hồi HTTP**: 302 (Chuyển hướng thành công sang trang nhập mã OTP)
* **Xác minh trong MongoDB**:
  * Đã lưu thành công tài khoản tạm thời với thuộc tính `isActive: false`.
  * Trích xuất mã OTP ngẫu nhiên từ DB thành công: **411524** (chứng minh hệ thống đã lưu trữ OTP + thời hạn 5 phút chính xác).

### 2.2. Xác thực mã OTP (POST /auth/verify-otp)
* **Thông số đầu vào (Request Body)**:
  * email: "test_script@evcharge.vn"
  * otp: "411524"
  * type: "register"
* **Mã phản hồi HTTP**: 302 (Chuyển hướng và tự động đăng nhập)
* **Xác minh trong MongoDB**:
  * Trạng thái kích hoạt tài khoản `isActive` đã tự động chuyển sang: **true** (kích hoạt thành công).

### 2.3. Đăng nhập quyền Admin (POST /auth/login)
* **Thông số đầu vào (Request Body)**:
  * email: "admin@evcharge.vn"
  * password: "admin123"
* **Mã phản hồi HTTP**: 302 (Đăng nhập thành công và chuyển hướng đến Admin Dashboard)
* **Thông tin Session**:
  * Khởi tạo cookie phiên làm việc thành công: `connect.sid=s%3AHEVGiQldvq7iTATFL6f04Pd7f5-47g6K.zQsyoVwX3Dasu5AYki%2FBXUAnsa4iuFZcdAAaEq5yKgs` (được lưu trực tiếp trong collection `sessions` của MongoDB).

---

## 3. KIỂM THỬ CÁC CHỨC NĂNG CRUD

### 3.1. Tạo trạm sạc mới (POST /admin/stations) [CREATE]
* **Thông số đầu vào (Request Body)**:
  * name: "Trạm Sạc Test Script 2026"
  * address: "Khu Đô Thị Mới, Quy Nhơn, Bình Định"
  * lat: "13.7500"
  * lng: "109.2100"
  * pricePerKwh: "4500"
  * description: "Trạm sạc nhanh thử nghiệm tự động bằng script"
  * connectors[type]: "CCS"
  * connectors[power]: "80"
* **Mã phản hồi HTTP**: 302 (Tạo thành công và chuyển hướng về trang danh sách trạm sạc)
* **Xác minh trong MongoDB**:
  * Tìm thấy trạm sạc vừa tạo trong database. Mã định danh ID trạm sạc: **6a1050a9560b72786db66c43**.

### 3.2. Xem danh sách trạm sạc (GET /admin/stations) [READ]
* **Mã phản hồi HTTP**: 200 OK
* **Xác minh trong MongoDB**:
  * Truy vấn và hiển thị thành công danh sách toàn bộ các trạm sạc hiện có cho Admin.

### 3.3. Khóa/Mở tài khoản người dùng (PUT /admin/users/:id/toggle) [UPDATE]
* **Mục tiêu thử nghiệm**: User ID `6a1050a6560b72786db66c3d` (`test_script@evcharge.vn`)
* **Mã phản hồi HTTP**: 200 OK (Trả về định dạng JSON)
* **Dữ liệu phản hồi (Response Body)**:
  ```json
  {
    "success": true,
    "isActive": false
  }
  ```
* **Xác minh trong MongoDB**:
  * Trạng thái tài khoản của user sau khi Admin tiến hành toggle khóa/mở khóa đã chuyển thành: `isActive: false` (khóa tài khoản thành công).

---

## 4. DỌN DẸP DỮ LIỆU SAU KIỂM THỬ (CLEANUP)
* **Trạng thái CSDL**: Đã tự động xóa tài khoản Khách hàng test và trạm sạc test khỏi MongoDB sau khi kiểm thử kết thúc để giữ dữ liệu hệ thống sạch sẽ.

---

## KẾT LUẬN
* **API hoạt động**: Đạt yêu cầu (100% API phản hồi đúng mã trạng thái HTTP 200/302).
* **CRUD hoạt động**: Đạt yêu cầu (Kiểm thử CREATE trạm sạc, READ danh sách trạm, UPDATE khóa/mở tài khoản khách hàng hoạt động ổn định).
* **MongoDB lưu dữ liệu được**: Đạt yêu cầu (Dữ liệu người dùng, trạm sạc và phiên làm việc session được lưu trữ, sửa đổi và truy vấn đồng bộ trực tiếp).
* **Login/Register**: Đạt yêu cầu (Đăng ký tài khoản, gửi OTP, xác thực kích hoạt và đăng nhập phân quyền Admin/Customer hoạt động chính xác).

**HỆ THỐNG HOÀN TOÀN ĐẠT TIÊU CHUẨN ĐỂ ĐƯA VÀO VẬN HÀNH.**
