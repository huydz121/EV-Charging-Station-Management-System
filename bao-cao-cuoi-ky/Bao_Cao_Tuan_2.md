# BÁO CÁO TIẾN ĐỘ DỰ ÁN — TUẦN 2

## XÂY DỰNG BACKEND

---

## 1. TỔ CHỨC MÃ NGUỒN

### 1.1. Kiến trúc MVC (Model – View – Controller)

Hệ thống được tổ chức theo mô hình **MVC** (Model–View–Controller) kết hợp thêm tầng **Service**, **Middleware** và **Config** để tách biệt rõ ràng trách nhiệm từng module:

* **Thư mục config/**: Chứa các cấu hình hệ thống
  * **database.js**: Quản lý kết nối cơ sở dữ liệu MongoDB (sử dụng Mongoose)
  * **index.js**: Export các biến môi trường cấu hình trong file .env
* **Thư mục models/**: Tầng Model — Định nghĩa cấu trúc (Schema) cơ sở dữ liệu MongoDB
  * **User.js**: Thông tin người dùng (Khách hàng & Admin)
  * **Station.js**: Thông tin trạm sạc và trụ sạc (connector)
  * **ChargingSession.js**: Lưu thông tin phiên sạc điện
  * **Payment.js**: Ghi nhận các giao dịch thanh toán
  * **Vehicle.js**: Quản lý phương tiện xe điện của khách hàng
  * **Reservation.js**: Thông tin đặt chỗ trước tại trạm sạc
  * **PriceRate.js**: Khung giá sạc theo khung giờ
  * **Maintenance.js**: Quản lý lịch bảo trì, sửa chữa trạm sạc
* **Thư mục controllers/**: Tầng Controller — Xử lý logic nghiệp vụ
  * **authController.js**: Đảm nhận việc đăng ký, đăng nhập, OTP và đổi mật khẩu
  * **Thư mục admin/**: Chứa các xử lý nghiệp vụ cho quản trị viên
    * **dashboardController.js**: Tổng hợp số liệu thống kê dashboard
    * **stationController.js**: Quản lý danh sách trạm sạc, trụ sạc (CRUD)
    * **userController.js**: Quản lý thông tin tài khoản người dùng (CRUD)
    * **maintenanceController.js**: Quản lý lịch trình bảo trì trạm sạc (CRUD)
    * **priceController.js**: Cập nhật biểu giá sạc điện (CRUD)
    * **reportController.js**: Xuất báo cáo doanh thu & công suất
    * **refundController.js**: Xử lý yêu cầu hoàn tiền cho khách hàng
  * **Thư mục customer/**: Chứa các xử lý nghiệp vụ cho khách hàng
    * **chargingController.js**: Logic bắt đầu, dừng sạc và cập nhật điện năng sạc
    * **paymentController.js**: Xử lý nạp tiền ví thông qua tích hợp cổng thanh toán
    * **mapController.js**: Tìm kiếm trạm sạc gần nhất trên bản đồ
    * **profileController.js**: Cập nhật thông tin cá nhân khách hàng
    * **historyController.js**: Xem lịch sử sạc và lịch sử thanh toán
    * **reservationController.js**: Đặt chỗ trước trụ sạc
* **Thư mục routes/**: Tầng Route — Định tuyến URL
  * **authRoutes.js**: Định tuyến các chức năng xác thực như /auth/*
  * **adminRoutes.js**: Định tuyến các chức năng quản trị như /admin/*
  * **customerRoutes.js**: Định tuyến các chức năng khách hàng như /customer/*
* **Thư mục middlewares/**: Middleware — Xử lý trung gian trước khi chuyển giao tiếp nhận đến Controller
  * **auth.js**: Kiểm tra đăng nhập (xác nhận Session)
  * **role.js**: Phân quyền truy cập (Admin hoặc Customer)
  * **layoutHelper.js**: Thiết lập tự động giao diện khung (layout EJS)
  * **errorHandler.js**: Xử lý lỗi toàn cục và trả về giao diện/JSON phù hợp
* **Thư mục services/**: Tầng Service — Logic nghiệp vụ tích hợp bên thứ ba
  * **mailer.js**: Kết nối SMTP gửi email mã xác thực OTP
  * **paymentService.js**: Tích hợp cổng thanh toán trực tuyến PayOS
* **Thư mục views/**: Tầng View — Chứa các file giao diện EJS
* **Thư mục public/**: Chứa các file tĩnh (CSS, Client-side JS, hình ảnh)
* **server.js**: Entry point — Điểm khởi đầu khởi tạo ứng dụng và kết nối cổng dịch vụ Express
* **seed.js**: Script tạo dữ liệu mẫu ban đầu để chạy thử hệ thống

### 1.2. Luồng xử lý Request / Response

Mọi request từ trình duyệt đều đi qua chuỗi xử lý sau:

1. **Client Request**: Người dùng gửi yêu cầu từ trình duyệt.
2. **server.js (Express App)**: Tiếp nhận request đầu vào.
3. **Global Middleware**: Giải nén dữ liệu JSON, URL Encoded, Method Override và phục vụ tài nguyên tĩnh.
4. **Session Middleware**: Kiểm tra và đồng bộ trạng thái Session thông qua `express-session` kết hợp với `connect-mongo`.
5. **Global Variables**: Gán biến toàn cục dùng chung cho giao diện EJS như thông tin người dùng đang đăng nhập (`res.locals.user`), trạng thái trang hiện tại (`activePage`), có ẩn navbar hay không (`hideNav`).
6. **Route Matching**: Xác định module định tuyến tương ứng (/auth/*, /customer/*, /admin/*).
7. **Route Middleware**: Thực thi kiểm tra trạng thái đăng nhập (`isAuthenticated`), quyền hạn vai trò (`isAdmin` hoặc `isCustomer`) và chuẩn bị layout giao diện tương ứng (`layoutHelper`).
8. **Controller**: Xử lý logic nghiệp vụ và tương tác với cơ sở dữ liệu MongoDB thông qua các Model.
9. **Response**: Trả kết quả về cho client qua hàm render layout (`res.renderAdmin()`, `res.renderCustomer()`), trả về dữ liệu API (`res.json()`) hoặc chuyển hướng trang (`res.redirect()`).

### 1.3. Kết nối MongoDB

Kết nối cơ sở dữ liệu được cấu hình tập trung trong `config/database.js`:

```javascript
const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```

* **Công nghệ sử dụng**: Thư viện Mongoose v9.x để quản lý mô hình dữ liệu (ODM).
* **Lưu trữ Session**: Sử dụng thư viện `connect-mongo` để lưu thông tin phiên làm việc (Session) trực tiếp trong collection `sessions` của MongoDB thay vì lưu trong bộ nhớ RAM tạm thời của NodeJS. Cơ chế này giúp phiên làm việc của người dùng được duy trì liên tục ngay cả khi server NodeJS khởi động lại. Thời gian sống mặc định của Session Cookie được thiết lập là 7 ngày.
* **Biến cấu hình**: Đường dẫn kết nối CSDL được đọc tự động từ biến môi trường `MONGODB_URI` trong file `.env` (mặc định trỏ đến database cục bộ `mongodb://localhost:27017/ev-charging`).

---

## 2. HOÀN THÀNH CRUD CHO CÁC ĐỐI TƯỢNG CHÍNH

Hệ thống đã triển khai đầy đủ các thao tác CRUD (Create, Read, Update, Delete) trên cơ sở dữ liệu MongoDB đối với 4 đối tượng nghiệp vụ cốt lõi:

### 2.1. CRUD Trạm sạc (Stations)

Được quản lý hoàn toàn bởi quản trị viên (Admin) và cấu hình tại `controllers/admin/stationController.js`.

* **Xem danh sách trạm sạc (Read)**:
  * Route: `GET /admin/stations`
  * Action: `stationController.listStations`
  * Logic: Tìm kiếm các trạm sạc hiện có trong hệ thống bằng hàm `Station.find()`, hỗ trợ lọc tên/địa chỉ theo từ khóa tìm kiếm (`?search=`) thông qua biểu thức chính quy (regex), đồng thời sắp xếp giảm dần theo thời gian tạo mới nhất.
* **Tạo trạm sạc mới (Create)**:
  * Route: `POST /admin/stations`
  * Action: `stationController.createStation`
  * Logic: Thu thập thông tin tên trạm, địa chỉ, vĩ độ (lat), kinh độ (lng), đơn giá sạc, mô tả và cấu hình súng sạc (connectors). Parse thông tin GPS sang định dạng chuẩn GeoJSON dạng `Point` và lưu dữ liệu bằng `Station.create()`. Đồng thời đẩy thông báo cập nhật lên Dashboard chung của hệ thống.
  * Code mẫu xử lý lưu trạm sạc:
```javascript
exports.createStation = async (req, res) => {
  try {
    const { name, address, lat, lng, pricePerKwh, description, connectors } = req.body;
    const parsedConnectors = [];
    if (connectors && Array.isArray(connectors.type)) {
      for (let i = 0; i < connectors.type.length; i++) {
        parsedConnectors.push({ 
          type: connectors.type[i], 
          power: parseInt(connectors.power[i]) || 22, 
          status: 'available' 
        });
      }
    } else if (connectors && connectors.type) {
      parsedConnectors.push({ 
        type: connectors.type, 
        power: parseInt(connectors.power) || 22, 
        status: 'available' 
      });
    }
    if (parsedConnectors.length === 0) parsedConnectors.push({ type: 'Type2', power: 22, status: 'available' });
    await Station.create({ 
      name, 
      address, 
      location: { type: 'Point', coordinates: [parseFloat(lng) || 106.6297, parseFloat(lat) || 10.8231] }, 
      pricePerKwh: parseInt(pricePerKwh) || 5000, 
      description, 
      connectors: parsedConnectors 
    });
    global.adminNotifications.push({ text: `Đã thêm trạm sạc: ${name}`, time: new Date() });
    res.redirect('/admin/stations?msg=created');
  } catch (error) { 
    console.error(error); 
    res.redirect('/admin/stations/create?error=1'); 
  }
};
```
* **Sửa thông tin trạm sạc (Update)**:
  * Route: `PUT /admin/stations/:id`
  * Action: `stationController.updateStation`
  * Logic: Nhận ID từ URL và thông tin cập nhật từ biểu mẫu body. Thực hiện cập nhật thông tin qua hàm `Station.findByIdAndUpdate()` để ghi đè các trường thông tin cơ bản, tọa độ định vị GPS, đơn giá sạc, danh sách súng sạc và trạng thái trạm sạc.
* **Xóa trạm sạc (Delete)**:
  * Route: `DELETE /admin/stations/:id`
  * Action: `stationController.deleteStation`
  * Logic: Thực thi lệnh xóa vĩnh viễn trạm sạc khỏi hệ thống qua `Station.findByIdAndDelete()`.

---

### 2.2. CRUD Người dùng (Users)

* **Tạo tài khoản khách hàng mới (Create)**:
  * Route: `POST /auth/register`
  * Action: `authController.postRegister`
  * Logic: Khách hàng đăng ký tài khoản từ giao diện bên ngoài. Tiến hành kiểm tra tính hợp lệ của mật khẩu và kiểm tra trùng lặp email. Nếu thông tin đúng, lưu thông tin tài khoản ở trạng thái chưa kích hoạt (`isActive: false`), tạo mã OTP gồm 6 chữ số gửi về hòm thư người dùng.
* **Xem danh sách người dùng (Read)**:
  * Route: `GET /admin/users`
  * Action: `userController.listUsers`
  * Logic: Quản trị viên truy vấn toàn bộ người dùng bằng `User.find().sort({ createdAt: -1 })` để quản lý trạng thái tài khoản.
* **Khóa hoặc mở khóa tài khoản (Update)**:
  * Route: `PUT /admin/users/:id/toggle`
  * Action: `userController.toggleUserStatus`
  * Logic: Cho phép Admin thay đổi luân phiên trạng thái hoạt động của tài khoản khách hàng bằng API JSON phản hồi trực tiếp:
```javascript
exports.toggleUserStatus = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.json({ success: false, message: 'User not found' });
    targetUser.isActive = !targetUser.isActive; 
    await targetUser.save();
    res.json({ success: true, isActive: targetUser.isActive });
  } catch (error) { res.json({ success: false, message: error.message }); }
};
```
* **Khách hàng tự cập nhật hồ sơ & đổi mật khẩu (Update)**:
  * Route: `PUT /customer/profile` và `PUT /customer/profile/password`
  * Action: `profileController.updateProfile` và `profileController.changePassword`
  * Logic: Khách hàng thay đổi thông tin cá nhân (họ tên, số điện thoại) hoặc thực hiện đổi mật khẩu sau khi so sánh chính xác mật khẩu hiện tại bằng phương thức `comparePassword()`.
* **Xóa tài khoản người dùng (Delete)**:
  * Route: `DELETE /admin/users/:id`
  * Action: `userController.deleteUser`
  * Logic: Quản trị viên xóa hoàn toàn thông tin người dùng khỏi hệ thống thông qua hàm `User.findByIdAndDelete()`.

---

### 2.3. CRUD Lịch trình Bảo trì (Maintenance)

Quản lý tình trạng sự cố hỏng hóc và lên lịch bảo dưỡng thiết bị trạm sạc được định nghĩa tại `controllers/admin/maintenanceController.js`.

* **Tạo phiếu bảo trì trạm sạc (Create)**:
  * Route: `POST /admin/maintenance`
  * Action: `maintenanceController.createMaintenance`
  * Logic: Tạo một bản ghi bảo trì mới trong CSDL ghi nhận loại sự cố, mô tả lỗi, người thực hiện và ngày lên lịch. Đồng thời cập nhật trạng thái của trạm sạc tương ứng sang trạng thái `maintenance` (Đang bảo trì) để hệ thống tự động khóa súng sạc, ngăn khách hàng đặt chỗ hoặc sử dụng trạm.
```javascript
exports.createMaintenance = async (req, res) => {
  try {
    const { station, type, description, assignedTo, scheduledDate } = req.body;
    await Maintenance.create({ 
      station, 
      type, 
      description, 
      assignedTo, 
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date() 
    });
    await Station.findByIdAndUpdate(station, { status: 'maintenance' });
    res.redirect('/admin/maintenance');
  } catch (error) { res.redirect('/admin/maintenance'); }
};
```
* **Xem lịch sử bảo trì (Read)**:
  * Route: `GET /admin/maintenance`
  * Action: `maintenanceController.listMaintenance`
  * Logic: Truy vấn danh sách các phiếu bảo trì từ CSDL. Sử dụng phương thức `.populate('station', 'name address')` của Mongoose để nhúng tự động thông tin tên trạm và địa chỉ trạm sạc tương ứng vào kết quả hiển thị.
* **Hoàn tất bảo trì trạm sạc (Update)**:
  * Route: `PUT /admin/maintenance/:id`
  * Action: `maintenanceController.updateMaintenanceStatus`
  * Logic: Cập nhật trạng thái xử lý bảo trì. Khi phiếu bảo trì được chuyển sang trạng thái hoàn thành (`completed`), hệ thống tự động thiết lập ngày hoàn thành và khôi phục trạng thái hoạt động của trạm sạc tương ứng về `active` (Hoạt động bình thường).
```javascript
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const record = await Maintenance.findByIdAndUpdate(
      req.params.id, 
      { status, ...(status === 'completed' ? { completedDate: new Date() } : {}) }, 
      { new: true }
    );
    if (status === 'completed') {
      await Station.findByIdAndUpdate(record.station, { status: 'active' });
    }
    res.json({ success: true, record });
  } catch (error) { res.json({ success: false, message: error.message }); }
};
```

---

### 2.4. CRUD Bảng giá (PriceRates)

Quản lý khung giá dịch vụ sạc điện linh hoạt theo thời gian thực tại `controllers/admin/priceController.js`.

* **Tạo khung giá mới (Create)**:
  * Route: `POST /admin/prices`
  * Action: `priceController.createPrice`
  * Logic: Admin định nghĩa các khung giờ sạc cao điểm, thấp điểm kèm giá tiền tương ứng và lưu dữ liệu bằng `PriceRate.create(req.body)`.
* **Xem danh sách khung giá (Read)**:
  * Route: `GET /admin/prices`
  * Action: `priceController.listPrices`
  * Logic: Truy vấn toàn bộ cấu hình khung giá điện sạc trong hệ thống sắp xếp theo ngày tạo giảm dần.
* **Cập nhật khung giá (Update)**:
  * Route: `PUT /admin/prices/:id`
  * Action: `priceController.updatePrice`
  * Logic: Sửa đổi khoảng thời gian áp dụng hoặc đơn giá dịch vụ của khung giá qua hàm `PriceRate.findByIdAndUpdate()`.
* **Xóa khung giá (Delete)**:
  * Route: `DELETE /admin/prices/:id`
  * Action: `priceController.deletePrice`
  * Logic: Xóa bỏ khung giá cũ bằng `PriceRate.findByIdAndDelete()`.

---

## 3. CƠ CHẾ XÁC THỰC (AUTHENTICATION & AUTHORIZATION)

### 3.1. Cơ chế xác thực: Session-based

Hệ thống sử dụng cơ chế **Session-based Authentication** kết hợp lưu trữ trong database MongoDB nhằm duy trì tính an toàn và quản lý trạng thái đăng nhập của người dùng một cách hiệu quả nhất:

* **Cấu hình Session trong `server.js`**:
```javascript
app.use(session({
  secret: config.sessionSecret || 'default_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.mongodbUri,
    ttl: 7 * 24 * 60 * 60 // Đảm bảo phiên làm việc lưu trong DB tồn tại trong 7 ngày
  }),
  cookie: {
    secure: false, // Thiết lập thành true nếu chạy ứng dụng trên HTTPS ở môi trường Production
    httpOnly: true, // Tăng cường bảo mật, ngăn chặn việc đọc cookie từ mã Javascript phía client (giảm thiểu tấn công XSS)
    maxAge: 7 * 24 * 60 * 60 * 1000 // Hạn dùng cookie 7 ngày
  }
}));
```

Khi người dùng thực hiện đăng nhập thành công, máy chủ sẽ tạo ra một Session chứa thông tin định danh cơ bản của người dùng, lưu dữ liệu đó vào collection `sessions` của MongoDB và gửi lại cho trình duyệt một Session ID đã được mã hóa thông qua Cookie.

---

### 3.2. Luồng Đăng ký (Register) với OTP Email

Quy trình đăng ký tài khoản mới được cài đặt chặt chẽ bao gồm 8 bước xử lý nghiệp vụ liên tiếp như sau:

1. **Người dùng nhập thông tin**: Khách hàng điền đầy đủ các thông tin gồm: họ tên (`fullName`), địa chỉ email (`email`), số điện thoại (`phone`), mật khẩu (`password`) và xác nhận mật khẩu (`confirmPassword`).
2. **Kiểm tra dữ liệu đầu vào (Validate)**: Phía máy chủ kiểm tra định dạng mật khẩu bằng biểu thức chính quy (Regex). Mật khẩu bắt buộc phải có độ dài an toàn, chứa ít nhất 1 chữ cái viết hoa và ít nhất 1 ký tự đặc biệt (ví dụ: @, #, $, %).
3. **Kiểm tra trùng lặp email**: Máy chủ thực hiện tìm kiếm trong CSDL xem email đã tồn tại hay chưa thông qua câu lệnh `User.findOne({ email })`. Nếu email đã được sử dụng bởi một tài khoản đã kích hoạt, hệ thống sẽ trả về lỗi cảnh báo.
4. **Tự động băm mật khẩu (Hash)**: Khi lưu thông tin người dùng vào CSDL, Mongoose hook `pre('save')` tự động can thiệp để mã hóa mật khẩu thô bằng thuật toán bcrypt với 12 vòng băm bảo mật (`bcrypt.genSalt(12)`).
5. **Khởi tạo mã xác thực OTP**: Hệ thống tạo một mã OTP ngẫu nhiên gồm 6 chữ số, lưu trữ mã OTP này vào trường `otp` kèm theo thời hạn hết hạn là 5 phút lưu tại trường `otpExpires` trong tài liệu (document) người dùng. Tài khoản lúc này có trạng thái hoạt động là chưa kích hoạt (`isActive: false`).
6. **Gửi mã OTP về Email**: Hệ thống gọi dịch vụ gửi thư Nodemailer (`mailer.sendOTP`) kết nối với SMTP server của Gmail để chuyển mã OTP đến hòm thư mà khách hàng đã đăng ký.
7. **Chuyển hướng trang (Redirect)**: Trình duyệt tự động chuyển hướng khách hàng sang màn hình nhập mã xác thực tại địa chỉ `/auth/verify-otp`.
8. **Kích hoạt tài khoản & Tự động đăng nhập**: Khi khách hàng nhập chính xác mã OTP và mã vẫn còn hạn, hệ thống cập nhật trường trạng thái tài khoản thành hoạt động (`isActive = true`), đồng thời tự động lưu trữ thông tin tài khoản vào Session để đăng nhập trực tiếp và đưa người dùng về trang chủ khách hàng `/customer`.

**Code xử lý đăng ký tài khoản (`controllers/authController.js`):**
```javascript
exports.postRegister = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])/;
    if (!passwordRegex.test(password)) {
      return res.render('customer/login', {
        layout: false,
        error: 'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 ký tự đặc biệt (@, #, $...)',
        isRegister: true
      });
    }

    if (password !== confirmPassword) {
      return res.render('customer/login', {
        layout: false,
        error: 'Mật khẩu xác nhận không khớp',
        isRegister: true
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isActive) {
      return res.render('customer/login', {
        layout: false,
        error: 'Email đã được sử dụng',
        isRegister: true
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60000); // Hạn dùng 5 phút

    if (existingUser && !existingUser.isActive) {
      // Trường hợp đăng ký lại với tài khoản chưa kích hoạt trước đó
      existingUser.fullName = fullName;
      existingUser.phone = phone;
      existingUser.password = password; // Sẽ được tự động băm ở pre('save') hook
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      // Tạo tài khoản khách hàng mới hoàn toàn
      await User.create({
        fullName,
        email,
        phone,
        password,
        role: 'customer',
        balance: 0,
        isActive: false,
        otp,
        otpExpires
      });
    }

    await mailer.sendOTP(email, otp, true);

    return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=register`);
  } catch (error) {
    console.error('Register error:', error);
    res.render('customer/login', {
      layout: false,
      error: 'Đã xảy ra lỗi khi đăng ký',
      isRegister: true
    });
  }
};
```

---

### 3.3. Luồng Đăng nhập (Login)

Quy trình đăng nhập được thực thi theo các bước nghiệp vụ sau:

1. **Người dùng điền thông tin**: Nhập email đăng nhập và mật khẩu truy cập.
2. **Truy vấn tài khoản**: Máy chủ tìm kiếm tài khoản khớp với email thông qua `User.findOne({ email })`. Nếu không tìm thấy, trả về lỗi chung "Email hoặc mật khẩu không đúng" để tăng tính bảo mật.
3. **So khớp mật khẩu**: Sử dụng phương thức so sánh băm mật khẩu `user.comparePassword(password)` hoạt động dựa trên thuật toán `bcrypt.compare()`.
4. **Kiểm tra trạng thái kích hoạt (Active)**: Nếu tài khoản tồn tại nhưng chưa được kích hoạt (`isActive` là false), hệ thống tự động sinh lại mã OTP mới, lưu lại vào database, gửi email OTP mới và chuyển hướng người dùng đến màn hình xác thực `/auth/verify-otp`.
5. **Tạo phiên làm việc (Session)**: Nếu tài khoản đã kích hoạt và mật khẩu chính xác, máy chủ cập nhật mốc thời gian đăng nhập mới nhất (`lastLogin`) và gán các thông tin định danh quan trọng vào bộ nhớ Session:
```javascript
req.session.user = {
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar,
  balance: user.balance
};
```
6. **Điều hướng theo vai trò (Role-based redirection)**: Kiểm tra vai trò của người dùng để chuyển hướng hợp lệ: nếu vai trò là `admin` chuyển hướng về `/admin/dashboard`, ngược lại nếu là `customer` chuyển hướng về giao diện `/customer`.

**Code xử lý đăng nhập tài khoản (`controllers/authController.js`):**
```javascript
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('customer/login', {
        layout: false,
        error: 'Email hoặc mật khẩu không đúng',
        isRegister: false
      });
    }

    if (!user.isActive) {
      // Tài khoản chưa được kích hoạt -> gửi lại mã OTP và chuyển sang verify-otp
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60000); // Hạn dùng 5 phút
      await user.save();
      await mailer.sendOTP(user.email, otp, true);
      return res.redirect(`/auth/verify-otp?email=${encodeURIComponent(user.email)}&type=register`);
    }

    user.lastLogin = new Date();
    await user.save();

    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      balance: user.balance
    };

    const returnTo = req.session.returnTo;
    delete req.session.returnTo;

    if (user.role === 'admin') {
      return res.redirect(returnTo || '/admin/dashboard');
    }
    return res.redirect(returnTo || '/customer');
  } catch (error) {
    console.error('Login error:', error);
    res.render('customer/login', {
      layout: false,
      error: 'Đã xảy ra lỗi, vui lòng thử lại',
      isRegister: false
    });
  }
};
```

---

### 3.4. Hệ thống Middleware phân quyền

Hệ thống bảo vệ toàn diện các tài nguyên nội bộ thông qua các middleware trung gian:

#### 3.4.1. Middleware kiểm soát truy cập chung (`middlewares/auth.js`)

* **Hàm `isAuthenticated`**: Đảm bảo các router nội bộ chỉ được truy cập bởi người dùng đã có phiên đăng nhập hợp lệ. Nếu người dùng chưa đăng nhập, hệ thống tự động lưu lại địa chỉ URL mà người dùng đang cố truy cập vào biến `req.session.returnTo` và chuyển hướng về trang đăng nhập `/auth/login`.
```javascript
isAuthenticated: (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect('/auth/login');
}
```
* **Hàm `isGuest`**: Ngăn cấm người dùng đã đăng nhập quay lại các trang xác thực công khai (như đăng nhập, đăng ký). Nếu đã đăng nhập, hệ thống tự động điều hướng họ về trang quản trị hoặc trang khách hàng tùy thuộc vào quyền hạn tài khoản.
```javascript
isGuest: (req, res, next) => {
  if (req.session && req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/customer');
  }
  return next();
}
```

#### 3.4.2. Middleware phân quyền truy cập theo vai trò (`middlewares/role.js`)

* **Hàm `isAdmin`**: Chỉ cho phép các tài khoản có vai trò là `admin` truy cập vào các API hoặc giao diện quản lý dành riêng cho ban quản trị. Nếu sai quyền hạn, hệ thống trả về mã lỗi HTTP 403 Forbidden và render trang cảnh báo từ chối truy cập.
```javascript
isAdmin: (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).render('customer/login', {
    layout: false,
    error: 'Bạn không có quyền truy cập trang này'
  });
}
```
* **Hàm `isCustomer`**: Đảm bảo các API hoặc giao diện dành riêng cho khách hàng sử dụng dịch vụ sạc điện không bị truy cập bởi tài khoản khác. Nếu sai quyền hạn, hệ thống tự động chuyển hướng về trang đăng nhập `/auth/login`.
```javascript
isCustomer: (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'customer') {
    return next();
  }
  return res.status(403).redirect('/auth/login');
}
```

#### 3.4.3. Middleware dựng giao diện khung EJS Layout (`middlewares/layoutHelper.js`)

Nhằm tránh việc lặp lại các thẻ cấu trúc HTML cố định (như header, sidebar, footer) ở mỗi trang giao diện, hệ thống xây dựng middleware tự động ghép nối layout động:

* **Hàm `renderWithLayout`**: Thực hiện render nội dung trang giao diện chi tiết trước để thu về chuỗi mã HTML nội dung. Sau đó, gán chuỗi mã này vào biến dữ liệu chung và tiến hành lồng chuỗi nội dung đó vào khung giao diện tổng (`layout`) trước khi gửi phản hồi cuối cùng về trình duyệt người dùng.
```javascript
function renderWithLayout(res, view, layout, data = {}) {
  const viewsDir = path.join(__dirname, '..', 'views');
  const viewPath = path.join(viewsDir, view + '.ejs');
  const layoutPath = path.join(viewsDir, layout + '.ejs');

  ejs.renderFile(viewPath, data, (err, contentHtml) => {
    if (err) {
      console.error('View render error:', err);
      return res.status(500).send('View render error: ' + err.message);
    }
    data.contentHtml = contentHtml;
    ejs.renderFile(layoutPath, data, (err2, html) => {
      if (err2) {
        console.error('Layout render error:', err2);
        return res.status(500).send('Layout render error: ' + err2.message);
      }
      res.send(html);
    });
  });
}
```

Tầng Router quản trị (`routes/adminRoutes.js`) và Router khách hàng (`routes/customerRoutes.js`) sẽ tự động gán hàm này thành phương thức của đối tượng phản hồi (`res.renderAdmin` và `res.renderCustomer`) giúp tối giản hóa cấu trúc code trong các Controller.

---

### 3.5. Hash Password tự động (Mongoose Hook)

Quá trình mã hóa một chiều mật khẩu để lưu trữ an toàn dưới cơ sở dữ liệu được cấu hình tập trung thông qua Mongoose middleware trong `models/User.js`:

```javascript
const bcrypt = require('bcryptjs');

// Tự động mã hóa mật khẩu trước khi lưu vào MongoDB
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12); // Băm mật khẩu qua 12 vòng để tối ưu bảo mật
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// So khớp mật khẩu đăng nhập với mã băm trong DB
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

---

## 4. KIỂM TRA DỮ LIỆU ĐẦU VÀO & XỬ LÝ LỖI

### 4.1. Kiểm tra tính hợp lệ dữ liệu xác thực (Validation)

* **Thiếu trường email**: Kiểm tra điều kiện `!email`, hiển thị cảnh báo yêu cầu người dùng điền đầy đủ email.
* **Mật khẩu không khớp**: Kiểm tra điều kiện `password !== confirmPassword`, hiển thị cảnh báo mật khẩu xác nhận phải trùng khớp với mật khẩu đã nhập.
* **Mật khẩu yếu**: Áp dụng Regex kiểm tra mật khẩu. Nếu thiếu chữ cái viết hoa hoặc ký tự đặc biệt, hiển thị cảnh báo "Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 ký tự đặc biệt (@, #, $...)".
* **Email đã tồn tại**: Truy vấn CSDL kiểm tra trùng lặp email. Nếu phát hiện trùng, hiển thị cảnh báo "Email đã được sử dụng".
* **Thông tin đăng nhập sai**: Kiểm tra tài khoản không tồn tại hoặc sai mật khẩu băm, trả về cảnh báo chung "Email hoặc mật khẩu không đúng" (ẩn thông tin cụ thể để phòng tránh dò tìm tài khoản).
* **Mã OTP sai hoặc hết hạn**: Kiểm tra khớp mã OTP và so sánh thời gian hiện tại với mốc `otpExpires`, trả về cảnh báo "Mã OTP không hợp lệ hoặc đã hết hạn".

### 4.2. Kiểm tra tính hợp lệ dữ liệu nghiệp vụ

* **Số dư ví tối thiểu khi sạc**: Khi người dùng gửi yêu cầu bắt đầu sạc xe, hệ thống kiểm tra nếu số dư tài khoản khách hàng dưới 200.000 VNĐ, từ chối thực hiện dịch vụ sạc và trả về thông báo lỗi: "Số dư không đủ. Vui lòng nạp ít nhất 200,000đ".
* **Trạng thái trạm sạc & súng sạc**: Kiểm tra sự tồn tại của trạm sạc và đảm bảo trạng thái súng sạc được chọn phải là `available` (sẵn sàng sạc). Nếu không thỏa mãn, báo lỗi trạm hoặc trụ sạc không khả dụng.
* **Giới hạn số tiền nạp ví**: Khi khách hàng nạp tiền qua ví, số tiền nạp yêu cầu phải đạt tối thiểu 10.000 VNĐ. Nếu dưới giới hạn, báo lỗi từ chối giao dịch.
* **Cấu hình thanh toán PayOS**: Kiểm tra cấu hình kết nối PayOS trong file môi trường. Nếu thiếu thông số cấu hình, từ chối nạp tiền và báo lỗi: "Hệ thống thanh toán chưa được cấu hình".
* **Xác thực mật khẩu cũ**: Khi khách hàng thực hiện đổi mật khẩu trong trang hồ sơ cá nhân, bắt buộc mật khẩu hiện tại nhập vào phải trùng khớp với mật khẩu cũ lưu trong database.

---

### 4.3. Xử lý lỗi toàn cục (`middlewares/errorHandler.js`)

Hệ thống bắt giữ các lỗi chưa được xử lý phát sinh trong quá trình vận hành để ngăn chặn việc ứng dụng bị dừng đột ngột, đồng thời trả về phản hồi chuẩn xác cho người dùng:

```javascript
module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Đã xảy ra lỗi server';

  // Trả về JSON lỗi nếu yêu cầu từ Client là gọi API (AJAX/Fetch)
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    return res.status(statusCode).json({ success: false, message });
  }

  // Render trang giao diện kèm thông báo lỗi cho người dùng đối với các yêu cầu chuyển hướng thường
  res.status(statusCode).render('customer/login', {
    layout: false,
    error: message
  });
};
```

---

## 5. KỊCH BẢN KIỂM THỬ API BẰNG POSTMAN

Hệ thống đã trải qua quá trình kiểm thử tích hợp tự động (Integration Testing) bằng bộ công cụ Postman thông qua 12 kịch bản chi tiết:

### 5.1. Nhóm Đăng ký & Đăng nhập tài khoản

* **Kịch bản 1 — Đăng ký tài khoản mới thành công**:
  * Phương thức gửi: POST
  * Đường dẫn API: http://localhost:3000/auth/register
  * Dữ liệu gửi đi (form-data): fullName = Nguyễn Văn Test, email = test@gmail.com, phone = 0901234567, password = Test@123, confirmPassword = Test@123.
  * Phản hồi mong đợi: Chuyển hướng sang trang xác thực mã OTP có đường dẫn `/auth/verify-otp?email=test@gmail.com&type=register`.
* **Kịch bản 2 — Đăng nhập tài khoản thành công**:
  * Phương thức gửi: POST
  * Đường dẫn API: http://localhost:3000/auth/login
  * Dữ liệu gửi đi (form-data): email = customer@test.com, password = Test@123.
  * Phản hồi mong đợi: Chuyển hướng thành công về trang chủ dịch vụ khách hàng `/customer` (đối với khách hàng) hoặc trang quản trị `/admin/dashboard` (đối với Admin). Trình kiểm thử Postman tự động lưu Session Cookie cho các yêu cầu tiếp theo.
* **Kịch bản 3 — Đăng nhập thất bại do mật khẩu sai**:
  * Phương thức gửi: POST
  * Đường dẫn API: http://localhost:3000/auth/login
  * Dữ liệu gửi đi (form-data): email = customer@test.com, password = saimatkhau123.
  * Phản hồi mong đợi: Render lại giao diện trang đăng nhập kèm theo chuỗi thông báo lỗi "Email hoặc mật khẩu không đúng".

---

### 5.2. Nhóm Quản lý Trạm Sạc (Yêu cầu quyền Admin)

* **Kịch bản 4 — Xem danh sách toàn bộ trạm sạc**:
  * Phương thức gửi: GET
  * Đường dẫn API: http://localhost:3000/admin/stations
  * Phản hồi mong đợi: Trả về trang HTML hiển thị đầy đủ bảng dữ liệu danh sách các trạm sạc hiện có.
* **Kịch bản 5 — Tạo thêm trạm sạc mới**:
  * Phương thức gửi: POST
  * Đường dẫn API: http://localhost:3000/admin/stations
  * Dữ liệu gửi đi (form-data): name = Trạm sạc Test Quy Nhơn, address = 456 Trần Hưng Đạo, Quy Nhơn, lat = 13.7788, lng = 109.2215, pricePerKwh = 5000, description = Trạm sạc thử nghiệm của Admin, connectors.type = CCS, connectors.power = 50.
  * Phản hồi mong đợi: Trạm sạc được khởi tạo trong CSDL thành công và chuyển hướng về trang `/admin/stations?msg=created`.
* **Kịch bản 6 — Cập nhật thông tin chi tiết trạm sạc**:
  * Phương thức gửi: PUT (thông qua _method=PUT trong body)
  * Đường dẫn API: http://localhost:3000/admin/stations/6650abc123def456
  * Dữ liệu gửi đi (form-data): name = Trạm sạc Quy Nhơn VIP, pricePerKwh = 4500, status = active.
  * Phản hồi mong đợi: Dữ liệu trạm sạc được chỉnh sửa thành công trong CSDL, chuyển hướng về `/admin/stations?msg=updated`.
* **Kịch bản 7 — Xóa bỏ trạm sạc**:
  * Phương thức gửi: DELETE (thông qua _method=DELETE trong body)
  * Đường dẫn API: http://localhost:3000/admin/stations/6650abc123def456
  * Phản hồi mong đợi: Trạm sạc bị xóa bỏ hoàn toàn khỏi hệ thống, chuyển hướng về `/admin/stations?msg=deleted`.

---

### 5.3. Nhóm Quản lý Người dùng (Yêu cầu quyền Admin)

* **Kịch bản 8 — Xem danh sách tài khoản người dùng**:
  * Phương thức gửi: GET
  * Đường dẫn API: http://localhost:3000/admin/users
  * Phản hồi mong đợi: Trả về trang HTML hiển thị toàn bộ tài khoản người dùng đã đăng ký trong hệ thống.
* **Kịch bản 9 — Khóa hoặc kích hoạt lại tài khoản**:
  * Phương thức gửi: PUT
  * Đường dẫn API: http://localhost:3000/admin/users/6650abc123def789/toggle
  * Phản hồi mong đợi: Trả về chuỗi JSON thông báo trạng thái thay đổi thành công dạng `{ success: true, isActive: false }`.

---

### 5.4. Nhóm Phiên Sạc xe (Yêu cầu quyền Customer)

* **Kịch bản 10 — Bắt đầu phiên sạc xe điện**:
  * Phương thức gửi: POST
  * Đường dẫn API: http://localhost:3000/customer/charging/start
  * Dữ liệu gửi đi (JSON): { "stationId": "6650abc123def456", "connectorIndex": 0 }
  * Phản hồi mong đợi: Trả về trạng thái thành công kèm theo mã định danh phiên sạc dạng `{ success: true, sessionId: "..." }`.
* **Kịch bản 11 — Truy vấn thông tin điện năng sạc (Polling)**:
  * Phương thức gửi: GET
  * Đường dẫn API: http://localhost:3000/customer/charging/6650session123/status
  * Phản hồi mong đợi: Trả về thông tin chi tiết dạng JSON chứa các thông số: thời gian sạc thực tế, số lượng điện năng tiêu thụ (kWh), công suất sạc hiện tại và tổng chi phí tạm tính ở thời điểm truy vấn.
* **Kịch bản 12 — Dừng phiên sạc và thanh toán**:
  * Phương thức gửi: POST
  * Đường dẫn API: http://localhost:3000/customer/charging/6650session123/stop
  * Phản hồi mong đợi: Trả về kết quả thanh toán dạng JSON `{ success: true, session: { status: "completed", totalCost: 69750 } }`. Số dư ví của khách hàng tự động được khấu trừ trực tiếp tương ứng với hóa đơn sạc điện.

---

## KẾT QUẢ SẢN PHẨM ĐẠT ĐƯỢC - TUẦN 2

* **Sản phẩm 1**: Mã nguồn API backend chạy ổn định, hoàn thiện với cấu trúc định tuyến phân biệt rõ ràng.
* **Sản phẩm 2**: Hoàn thành toàn diện các nghiệp vụ CRUD cho 4 đối tượng cốt lõi gồm: Trạm sạc, Tài khoản người dùng, Phiếu bảo trì và Khung biểu giá dịch vụ.
* **Sản phẩm 3**: Tích hợp CSDL MongoDB Atlas (Cloud) hoạt động an toàn, đồng bộ dữ liệu chặt chẽ trên 8 collections nghiệp vụ.
* **Sản phẩm 4**: Triển khai cơ chế đăng ký và đăng nhập dựa trên Session Cookie hoạt động bền bỉ, tích hợp tự động hóa dịch vụ gửi mã OTP xác nhận tài khoản qua hòm thư Email.
* **Sản phẩm 5**: Xây dựng chặt chẽ các tầng kiểm tra dữ liệu đầu vào (Validation) từ phía Client và Server giúp phát hiện sớm dữ liệu lỗi.
* **Sản phẩm 6**: Thực hiện kiểm thử API tích hợp thành công qua bộ 12 kịch bản kiểm thử Postman.
* **Sản phẩm 7**: Đẩy toàn bộ mã nguồn cập nhật lên kho lưu trữ GitHub tại địa chỉ: https://github.com/huydz121/EV-Charging-Station-Management-System
