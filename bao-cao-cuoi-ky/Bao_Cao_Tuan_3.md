# BÁO CÁO TIẾN ĐỘ DỰ ÁN — TUẦN 3

## GIAO DIỆN & KẾT NỐI HỆ THỐNG

---

## 1. XÂY DỰNG & HOÀN THIỆN FRONTEND

Trong tuần 3, dự án đã tập trung xây dựng hoàn thiện giao diện người dùng (UI) và trải nghiệm người dùng (UX) dựa trên công nghệ EJS, HTML5, CSS3 và Javascript thuần, đảm bảo tương tác mượt mà và kết nối đồng bộ với Backend API.

### 1.1. Giao diện người dùng (User Interface)
- **Thiết kế tổng quan**: Áp dụng phong cách thiết kế hiện đại (Glassmorphism, Dark mode/Light mode) với tông màu xanh lá (Eco-friendly) đặc trưng của ngành xe điện. 
- **Bố cục (Layout)**: Sử dụng hệ thống lưới CSS Flexbox và Grid để đảm bảo giao diện hiển thị tốt trên cả máy tính (PC) và thiết bị di động (Responsive Design).
- **Thành phần giao diện**: Xây dựng hoàn chỉnh các trang cốt lõi bao gồm: Trang chủ khách hàng, Bản đồ trạm sạc, Trang quản trị Admin (Dashboard), Lịch sử giao dịch, Hồ sơ cá nhân.

### 1.2. Kết nối API Backend & Hiển thị dữ liệu từ MongoDB
- **Fetch API**: Toàn bộ dữ liệu hiển thị trên giao diện (danh sách trạm sạc, trạng thái súng sạc, lịch sử sạc) được gọi trực tiếp từ các RESTful API đã xây dựng ở Tuần 2 thông qua Fetch API của Javascript.
- **Render dữ liệu động**: Giao diện EJS nhận dữ liệu JSON từ MongoDB thông qua Controller, lặp mảng (for-loop) để tự động sinh ra các thẻ HTML tương ứng (ví dụ: tạo Grid Card cho từng trạm sạc).
- **Dữ liệu thời gian thực (Real-time)**: Áp dụng cơ chế Polling (gọi API định kỳ mỗi 2 giây) để cập nhật liên tục tiến độ sạc pin và số dư ví điện tử mà không cần tải lại trang.

### 1.3. Hệ thống Form (Thêm / Sửa / Xoá dữ liệu)
- Tích hợp các Form tương tác cho phép Admin dễ dàng thao tác CRUD dữ liệu.
- Các Form được thiết kế với giao diện trực quan, rõ ràng các trường nhập liệu (Input, Select, Textarea).
- Nút Xóa dữ liệu (Delete) được gắn sự kiện xác nhận bằng thư viện **SweetAlert2** để hiển thị Popup cảnh báo chống xóa nhầm.

### 1.4. Đăng nhập / Đăng xuất (Authentication UI)
- Giao diện đăng nhập/đăng ký được thiết kế dạng Card Popup nổi bật ở giữa màn hình.
- Nút Đăng xuất được đặt tại Header của cả Customer và Admin, gọi API `/auth/logout` để xóa Session và điều hướng về trang chủ.

---

## 2. HOÀN THIỆN CHỨC NĂNG HỆ THỐNG

### 2.1. Hoạt động đầy đủ CRUD
Tất cả các chức năng cốt lõi của hệ thống đã vượt qua bài kiểm tra CRUD toàn diện:
- **Trạm sạc (Stations)**: Thêm mới trạm, Sửa thông tin, Xóa trạm sạc, Xem danh sách trạm.
- **Người dùng (Users)**: Đăng ký, Cập nhật hồ sơ cá nhân, Khóa/Mở khóa tài khoản bởi Admin.
- **Phiên sạc (Charging Sessions)**: Khởi tạo phiên sạc mới, Cập nhật số điện tiêu thụ, Dừng và thanh toán (Trừ tiền trong ví).

### 2.2. Authentication & Phân quyền người dùng
- **Hoạt động ổn định**: Hệ thống Session Cookie bảo mật hoạt động xuyên suốt. Hỗ trợ xác thực qua mã OTP gửi về Email (Nodemailer) nhanh chóng.
- **Phân quyền (Authorization)**: 
  - `Admin`: Được phép truy cập vào `/admin/*` để xem Dashboard, quản lý trạm sạc, người dùng, giá điện.
  - `Customer`: Bị giới hạn truy cập tại `/customer/*` để sử dụng dịch vụ sạc và quản lý cá nhân.
  - Chặn tuyệt đối việc leo thang đặc quyền (Privilege Escalation) thông qua hệ thống Middleware trung gian.

### 2.3. Tìm kiếm / Lọc dữ liệu
- Khách hàng có thể tìm kiếm trạm sạc thông qua thanh công cụ tìm kiếm.
- Backend sử dụng biểu thức chính quy (Regex) và chỉ mục không gian (2dsphere của MongoDB) để trả về danh sách trạm sạc khớp với tên, địa chỉ hoặc nằm trong bán kính lân cận.
- Dữ liệu trả về được tự động lọc và vẽ lại Marker trên bản đồ Leaflet.js.



---

## 3. XỬ LÝ LỖI & TỐI ƯU HỆ THỐNG

### 3.1. Validate dữ liệu Frontend + Backend
- **Frontend**: Gắn thuộc tính `required`, `type="email"`, `min`, `max` vào các form HTML5. Sử dụng Javascript để kiểm tra mật khẩu xác nhận trùng khớp trước khi cho phép submit form.
- **Backend**: Xử lý Regex bảo mật mật khẩu, kiểm tra trùng lặp Email trong database, bắt buộc điền đủ các trường thiết yếu để chống lại việc bypass form từ phía client.

### 3.2. Kiểm tra & Xử lý lỗi hệ thống
- Toàn bộ các API được bọc trong cấu trúc `try...catch`.
- Xây dựng Middleware `errorHandler.js` làm chốt chặn cuối cùng. Khi xảy ra lỗi rò rỉ CSDL hoặc lỗi mạng, hệ thống không bị crash (sập) mà sẽ trả về một mã JSON thông báo an toàn hoặc chuyển hướng về trang báo lỗi.

### 3.3. Thông báo lỗi/thành công rõ ràng
- Tích hợp thư viện **Toastify** và **SweetAlert2** để hiển thị các thông báo động góc màn hình (Toast) khi thao tác thành công (ví dụ: "Cập nhật trạm sạc thành công", "Đăng nhập thành công").
- Các lỗi từ backend (ví dụ: "Số dư không đủ", "Email đã tồn tại") được gửi về và hiển thị rõ ràng bằng chữ màu đỏ ngay trên giao diện form tương ứng.

---

## 4. TRIỂN KHAI HỆ THỐNG (DEPLOYMENT)

- Mặc dù hệ thống đã được đóng gói hoàn chỉnh và sẵn sàng để đẩy lên các dịch vụ đám mây (Cloud Server) để chạy online. Tuy nhiên, để đảm bảo tốc độ phản hồi nhanh nhất và không bị gián đoạn do giới hạn của các máy chủ miễn phí (bị sleep/chậm), nhóm quyết định triển khai chạy trực tiếp trên môi trường máy chủ cục bộ (Localhost) phục vụ cho buổi Demo.
- **Nền tảng chạy máy chủ**: Node.js Local Server.
- **Cơ sở dữ liệu**: Dịch vụ đám mây **MongoDB Atlas** (vẫn chạy online để đồng bộ dữ liệu an toàn 24/7).
- **Trạng thái**: Hệ thống chạy ổn định 100%, thao tác cực kỳ mượt mà không có độ trễ.
- **Đường dẫn Web truy cập**: `http://localhost:3000`

---

## 5. KIỂM THỬ & DEMO (KẾT QUẢ TEST HỆ THỐNG)

Hệ thống đã trải qua quá trình kiểm thử hộp đen (Black-box testing) trên môi trường Online thực tế. Dưới đây là các chức năng chính đã được test thành công:

### 5.1. Kịch bản 1: Đăng nhập & Đăng ký
- **Hành động**: Truy cập `/auth/login`, chọn Đăng ký tài khoản mới. Điền thông tin hợp lệ. Nhận mã OTP từ email và nhập vào hệ thống.
- **Kết quả**: 
  - Tạo tài khoản thành công.
  - Hệ thống tự động phân quyền Customer.
  - Đăng nhập mượt mà, chuyển hướng vào màn hình Dashboard cá nhân.
  - Có thông báo "Đăng nhập thành công" góc màn hình.

### 5.2. Kịch bản 2: Thêm dữ liệu (Admin thêm Trạm sạc)
- **Hành động**: Đăng nhập tài khoản Admin. Truy cập trang Quản lý Trạm sạc -> Bấm "Thêm Trạm Mới". Điền tên trạm, tọa độ, giá điện, cấu hình loại súng sạc (CCS 50kW) và bấm Lưu.
- **Kết quả**: 
  - Form được submit không xảy ra lỗi.
  - Database nhận dữ liệu mới lập tức.
  - Hệ thống điều hướng về danh sách trạm sạc, hiển thị trạm sạc mới vừa thêm ở đầu danh sách.

### 5.3. Kịch bản 3: Sửa dữ liệu (Admin cập nhật giá điện)
- **Hành động**: Tại danh sách trạm sạc, Admin bấm nút Sửa (biểu tượng cây bút) ở trạm sạc vừa thêm. Chỉnh sửa giá điện từ 5000đ thành 5500đ và cập nhật.
- **Kết quả**: 
  - Giá điện mới được cập nhật lập tức trên màn hình danh sách trạm sạc.
  - Khách hàng xem trên ứng dụng cũng thấy giá trị cập nhật thành 5500đ.

### 5.4. Kịch bản 4: Tìm kiếm & Lọc dữ liệu
- **Hành động**: Đăng nhập tài khoản Customer. Truy cập bản đồ trạm sạc. Gõ tên trạm sạc hoặc khu vực vào thanh tìm kiếm.
- **Kết quả**: 
  - Hệ thống gợi ý danh sách các trạm sạc liên quan.
  - Khi bấm chọn, bản đồ (Leaflet.js) tự động Zoom in và bay đến đúng tọa độ của trạm sạc đó. Mở ra Popup thông tin chi tiết trạm.

### 5.5. Kịch bản 5: Xóa dữ liệu (Admin xóa trạm sạc)
- **Hành động**: Admin bấm nút Xóa (biểu tượng thùng rác) một trạm sạc.
- **Kết quả**:
  - Giao diện hiện Popup Cảnh báo (SweetAlert2) yêu cầu xác nhận "Bạn có chắc chắn muốn xóa?".
  - Sau khi chọn "Đồng ý", dữ liệu bị xóa khỏi MongoDB.
  - Trạm sạc biến mất hoàn toàn khỏi danh sách Admin và bản đồ khách hàng.

---

## 6. THÔNG TIN NỘP BÀI

- **Môn học**: Phát triển ứng dụng Web
- **Sinh viên thực hiện**: [Tên sinh viên của bạn]
- **Source Code GitHub**: [https://github.com/huydz121/testwweb](https://github.com/huydz121/testwweb) (Nhánh triển khai) & [https://github.com/huydz121/EV-Charging-Station-Management-System-](https://github.com/huydz121/EV-Charging-Station-Management-System-) (Kho báo cáo)
- **Link Website (Live)**: [https://tram-sac.onrender.com](https://tram-sac.onrender.com)
