# BÁO CÁO TUẦN 3 — GIAO DIỆN & KẾT NỐI HỆ THỐNG
**Tên dự án:** Hệ thống quản lý trạm sạc xe điện (EV Charging Station Management System)

---

## 1. Xây dựng/ hoàn thiện Frontend
Hệ thống đã hoàn thiện toàn bộ giao diện cho Khách hàng (Mobile-First) và Quản trị viên (Desktop-First).
- **Giao diện người dùng**: Xây dựng bằng EJS, CSS thuần và Bootstrap 5. Tích hợp Dark Theme.
- **Kết nối API backend**: Các View (EJS) nhận dữ liệu từ Controller và Render trực tiếp. Các tác vụ bất đồng bộ (Polling trạng thái sạc xe) sử dụng Fetch API/AJAX.
- **Hiển thị dữ liệu từ MongoDB**: Các danh sách trạm sạc, thông tin tài khoản, ví tiền, lịch sử sạc đều được lấy trực tiếp và đồng bộ theo thời gian thực từ cơ sở dữ liệu MongoDB Atlas.
- **Form thêm/sửa/xoá dữ liệu**: Hoàn thiện các biểu mẫu nhập liệu đa dạng (Text, File Upload, Bản đồ chọn tọa độ, form mảng động - dynamic arrays cho súng sạc).
- **Đăng nhập/đăng xuất**: Hoàn thiện giao diện Login/Register tối giản, chuyên nghiệp.

## 2. Hoàn thiện chức năng hệ thống
- **Hoạt động đầy đủ CRUD**: Thực hiện Thêm, Đọc, Sửa, Xóa mượt mà trên các Model: Trạm sạc (Station), Người dùng (User), Sự cố/Bảo trì (Maintenance), Bảng giá (Price).
- **Authentication hoạt động ổn định**: Đăng nhập bằng session lưu trong MongoDB. Mật khẩu được mã hoá bằng `bcryptjs`. Bảo mật bằng OTP gửi qua email (Nodemailer) khi đăng ký tài khoản.
- **Phân quyền người dùng**: Hệ thống chia 2 role rõ rệt. `Customer` (chỉ được xem trạm, sạc xe, nạp ví). `Admin` (truy cập Dashboard, quản lý toàn bộ hệ thống). Middleware chặn truy cập trái phép cực kỳ nghiêm ngặt.
- **Tìm kiếm/lọc dữ liệu**: Sử dụng MongoDB 2D Sphere Index để tìm trạm sạc gần nhất trên bản đồ. Lọc báo cáo tài chính theo thời gian.
- **Upload ảnh/file**: Cho phép quản trị viên tải hình ảnh trạm sạc và sơ đồ lên hệ thống (lưu trên Cloudinary hoặc thư mục local).

## 3. Xử lý lỗi & tối ưu
- **Kiểm tra lỗi hệ thống**: Xây dựng Global Error Handler (middleware bắt lỗi tập trung), đảm bảo server không bao giờ bị sập (crash) khi có lỗi.
- **Validate dữ liệu**:
  - *Frontend*: Sử dụng thuộc tính HTML5 (`required`, `min`, `max`) và script chặn submit.
  - *Backend*: Ràng buộc logic nghiệp vụ (không cho sửa email đã tồn tại, không cho sạc xe khi số dư ví < 200.000đ, mật khẩu phải có ký tự đặc biệt).
- **Thông báo lỗi/thành công rõ ràng**: 
  - Hiển thị Toast thông báo ở góc màn hình.
  - Sử dụng thư viện popup SweetAlert2 để xác nhận trước khi Xóa dữ liệu nhằm tránh thao tác nhầm.

## 4. Cấu hình Deploy hệ thống
- Hệ thống đã được đẩy (push) toàn bộ Source code lên kho lưu trữ **GitHub**.
- **Cơ sở dữ liệu**: Đã tích hợp và kết nối thành công với **MongoDB Atlas** (Cloud Database) để lưu trữ dữ liệu online.
- **Server Application**: Hệ thống được cấu hình và chạy ổn định trên môi trường **Localhost** (Node.js). Đã chuẩn bị sẵn sàng các biến môi trường và cấu hình cần thiết để đẩy lên môi trường mạng thực tế khi có yêu cầu.

---

## 5. KIỂM THỬ & DEMO (HƯỚNG DẪN TEST CÁC CHỨC NĂNG CHÍNH)

Dưới đây là kịch bản chạy thử (Demo) và kết quả kiểm thử (Test) các chức năng chính để nghiệm thu hệ thống.

### 5.1. Kịch bản 1: Đăng nhập & Đăng xuất
* **Đăng nhập Admin:**
  1. Mở trang chủ, chọn Đăng nhập.
  2. Nhập Email: `admin@evcharge.vn` / Mật khẩu: `admin123`.
  3. **Kết quả**: Hệ thống xác thực mật khẩu (đã hash bcypt) thành công, tự động chuyển hướng vào trang quản trị Dashboard `/admin/dashboard`. Nút Đăng xuất hoạt động, xóa sạch Session.
* **Đăng nhập Khách hàng:**
  1. Nhập Email: `customer@evcharge.vn` / Mật khẩu: `customer123`.
  2. **Kết quả**: Hệ thống chuyển hướng về trang bản đồ tìm trạm sạc `/customer`. Các menu quản trị viên hoàn toàn bị ẩn và chặn truy cập.

### 5.2. Kịch bản 2: Thêm dữ liệu (Thêm trạm sạc mới)
1. Đăng nhập tài khoản Admin. Vào menu **Quản lý trạm sạc**.
2. Nhấn nút **Thêm trạm mới**. 
3. Nhập đầy đủ Tên trạm, Địa chỉ, Giá điện cơ bản, và bấm thêm 2 súng sạc (CCS 60kW và Type2 22kW). Nhấn **Lưu**.
4. **Kết quả**: Popup báo "Thêm thành công!". Database nhận dữ liệu mới. Trạm sạc mới xuất hiện ngay trên danh sách và hiển thị ngay lập tức lên bản đồ của Khách hàng.

### 5.3. Kịch bản 3: Sửa dữ liệu (Cập nhật thông tin trạm sạc)
1. Tại danh sách trạm sạc của Admin, chọn trạm vừa tạo, nhấn biểu tượng **Sửa (Edit)**.
2. Đổi giá điện cơ bản từ `3500 VNĐ` thành `3800 VNĐ`. Nhấn **Cập nhật**.
3. **Kết quả**: Hệ thống kiểm tra hợp lệ và lưu đè thông tin. Khi khách hàng bấm vào xem chi tiết trạm sạc này, giá hiển thị đã được cập nhật thành 3800đ/kWh.

### 5.4. Kịch bản 4: Tìm kiếm (Lọc và tìm kiếm trên bản đồ)
1. Đăng nhập tài khoản Khách hàng, vào mục **Tìm trạm sạc** trên bản đồ.
2. Trên thanh tìm kiếm, gõ từ khóa `Quy Nhơn` hoặc `CCS`.
3. **Kết quả**: Thuật toán tìm kiếm Text Search và Regex của MongoDB lọc tức thì và chỉ hiển thị trên bản đồ các marker của trạm sạc nằm ở Quy Nhơn hoặc có hỗ trợ súng sạc loại CCS.

### 5.5. Kịch bản 5: Xóa dữ liệu (Xóa trạm sạc)
1. Tại danh sách trạm sạc của Admin, nhấn nút **Xóa (Delete)** vào một trạm sạc.
2. **Kết quả**: Hệ thống không xóa ngay mà hiện lên hộp thoại cảnh báo (SweetAlert2): *"Bạn có chắc chắn muốn xóa trạm này không? Dữ liệu không thể khôi phục"*.
3. Bấm **Xác nhận xóa**.
4. **Kết quả**: Trạm sạc bị gỡ hoàn toàn khỏi Database và biến mất khỏi bản đồ của khách hàng ngay lập tức. Thông báo toast hiện "Xóa thành công!".
