# 2. Phân tích động

Trong phần này, hệ thống sẽ được phân tích chi tiết thông qua các biểu đồ trạng thái để mô tả vòng đời của các đối tượng, biểu đồ tuần tự để mô tả tương tác giữa các đối tượng theo thời gian, và biểu đồ lớp hoàn chỉnh để tổng hợp lại toàn bộ cấu trúc hệ thống.

## 2.1 Xây dựng biểu đồ trạng thái (Statechart Diagram)

### 2.1.1 Xác thực tài khoản (Khách hàng)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> Man_Hinh_Chinh
state "Màn hình Đăng nhập / Đăng ký" as Man_Hinh_Chinh
state "Nhập thông tin tài khoản" as Nhap_Thong_Tin
state "Hệ thống xác thực dữ liệu" as Xac_Thuc
state "Thông báo lỗi" as Bao_Loi
state "Gửi mã OTP" as Gui_OTP
state "Đăng nhập thành công" as Thanh_Cong

Man_Hinh_Chinh -down-> Nhap_Thong_Tin : Chọn hành động
Nhap_Thong_Tin -down-> Xac_Thuc : Gửi dữ liệu
Xac_Thuc -left-> Bao_Loi : Dữ liệu không\nhợp lệ
Bao_Loi -up-> Nhap_Thong_Tin : Yêu cầu nhập lại
Bao_Loi --> [*] : Hủy đăng nhập/thoát
Xac_Thuc -down-> Gui_OTP : Tài khoản mới
Gui_OTP -down-> Thanh_Cong : Xác nhận OTP đúng
Gui_OTP --> [*] : Hủy xác thực
Xac_Thuc -right-> Thanh_Cong : Đăng nhập hợp lệ
Thanh_Cong -down-> [*] : Vào trang chủ
@enduml
```

### 2.1.2 Quản lý trạm sạc (Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> Truy_Cap
state "Truy cập quản lý trạm sạc" as Truy_Cap
state "Nhập thông tin trạm sạc" as Nhap_Thong_Tin
state "Hệ thống kiểm tra dữ liệu" as Kiem_Tra
state "Thông báo lỗi dữ liệu" as Bao_Loi
state "Cập nhật vào cơ sở dữ liệu" as Cap_Nhat
state "Hệ thống thông báo thành công" as Thanh_Cong

Truy_Cap -down-> Nhap_Thong_Tin : Chọn thêm/sửa trạm
Nhap_Thong_Tin -down-> Kiem_Tra : Gửi yêu cầu lưu
Kiem_Tra -left-> Bao_Loi : Dữ liệu không\nhợp lệ
Bao_Loi -up-> Nhap_Thong_Tin : Yêu cầu nhập lại
Bao_Loi --> [*] : Thoát chức năng
Kiem_Tra -down-> Cap_Nhat : Thông tin hợp lệ
Cap_Nhat -down-> Thanh_Cong : Cập nhật thành công
Thanh_Cong -down-> [*] : Thoát chức năng
@enduml
```

### 2.1.3 Quản lý bảo trì (Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> DS_Tram
state "Danh sách trạm sạc" as DS_Tram
state "Lập phiếu bảo trì" as Lap_Phieu
state "Hệ thống kiểm tra" as Kiem_Tra
state "Lỗi (Súng sạc đang dùng)" as Bao_Loi
state "Khóa súng sạc (Maintenance)" as Khoa_Sung
state "Hoàn tất bảo trì" as Hoan_Tat

DS_Tram -down-> Lap_Phieu : Chọn súng sạc
Lap_Phieu -down-> Kiem_Tra : Gửi yêu cầu
Kiem_Tra -left-> Bao_Loi : Đang có xe sạc
Bao_Loi -up-> DS_Tram : Quay lại danh sách
Bao_Loi --> [*] : Hủy bảo trì/thoát
Kiem_Tra -down-> Khoa_Sung : Đủ điều kiện
Khoa_Sung -down-> Hoan_Tat : Kỹ thuật viên xác nhận
Hoan_Tat -down-> [*] : Thoát chức năng
@enduml
```

### 2.1.4 Cấu hình bảng giá cước (Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> Bang_Gia
state "Giao diện quản lý giá cước" as Bang_Gia
state "Thiết lập giá theo khung giờ" as Thiet_Lap
state "Xác thực dữ liệu" as Xac_Thuc
state "Cảnh báo (Giá sai)" as Canh_Bao
state "Lưu bảng giá mới" as Luu_Gia
state "Áp dụng thành công" as Thanh_Cong

Bang_Gia -down-> Thiet_Lap : Chọn cấu hình
Thiet_Lap -down-> Xac_Thuc : Gửi yêu cầu
Xac_Thuc -left-> Canh_Bao : Dữ liệu sai
Canh_Bao -up-> Thiet_Lap : Nhập lại
Canh_Bao --> [*] : Hủy cấu hình/thoát
Xac_Thuc -down-> Luu_Gia : Dữ liệu hợp lệ
Luu_Gia -down-> Thanh_Cong : Cập nhật CSDL
Thanh_Cong -down-> [*] : Thoát chức năng
@enduml
```

### 2.1.5 Khóa / Mở khóa tài khoản (Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> DS_User
state "Danh sách người dùng" as DS_User
state "Chọn Khóa/Mở khóa" as Chon_Hanh_Dong
state "Hệ thống kiểm tra" as Kiem_Tra
state "Lỗi (Tài khoản đang sạc)" as Bao_Loi
state "Cập nhật trạng thái" as Cap_Nhat
state "Thành công" as Thanh_Cong

DS_User -down-> Chon_Hanh_Dong : Click Toggle
Chon_Hanh_Dong -down-> Kiem_Tra : Yêu cầu thay đổi
Kiem_Tra -left-> Bao_Loi : Không hợp lệ
Bao_Loi -up-> DS_User : Quay lại danh sách
Bao_Loi --> [*] : Hủy thao tác/thoát
Kiem_Tra -down-> Cap_Nhat : Hợp lệ
Cap_Nhat -down-> Thanh_Cong : Lưu trạng thái
Thanh_Cong -down-> [*] : Thoát chức năng
@enduml
```

### 2.1.6 Tìm kiếm & Đặt chỗ trước (Khách hàng)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> Chon_Tram
state "Tìm kiếm & Chọn trạm sạc" as Chon_Tram
state "Chọn cổng sạc muốn đặt" as Chon_Cong
state "Hệ thống kiểm tra trạng thái" as Kiem_Tra
state "Thông báo cổng đang bận" as Cong_Ban
state "Khóa cổng (Reserved)" as Khoa_Cong
state "Giải phóng cổng sạc" as Giai_Phong

Chon_Tram -down-> Chon_Cong : Xem chi tiết
Chon_Cong -down-> Kiem_Tra : Nhấn đặt chỗ
Kiem_Tra -left-> Cong_Ban : Cổng không khả dụng
Cong_Ban -up-> Chon_Cong : Yêu cầu chọn lại
Cong_Ban --> [*] : Thoát chức năng
Kiem_Tra -down-> Khoa_Cong : Cổng trống
Khoa_Cong -left-> Giai_Phong : Quá 30 phút\n(Tự động hủy)
Khoa_Cong -down-> [*] : Khách đến sạc
Giai_Phong -down-> [*] : Hoàn tất hủy
@enduml
```

### 2.1.7 Khởi động & Dừng sạc (Khách hàng)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 60
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> Quet_QR
state "Khách quét mã QR trụ sạc" as Quet_QR
state "Kiểm tra điều kiện sạc" as Kiem_Tra
state "Từ chối (Ví < 200k / Lỗi cáp)" as Tu_Choi
state "Khởi tạo phiên sạc (Charging)" as Dang_Sac
state "Dừng sạc & Chốt số điện" as Dung_Sac
state "Thanh toán & Trừ tiền ví" as Thanh_Toan
state "Hoàn tất phiên sạc" as Hoan_Tat

Quet_QR -down-> Kiem_Tra : Yêu cầu sạc
Kiem_Tra -left-> Tu_Choi : Không đủ điều kiện
Tu_Choi -up-> Quet_QR : Yêu cầu nạp tiền
Tu_Choi --> [*] : Hủy sạc/thoát
Kiem_Tra -down-> Dang_Sac : Điều kiện hợp lệ
Dang_Sac -down-> Dung_Sac : Pin đầy hoặc bấm dừng
Dung_Sac -down-> Thanh_Toan : Tính tổng chi phí
Thanh_Toan -left-> Thanh_Toan : Lỗi trừ tiền\n(Chờ xử lý lại)
Thanh_Toan -down-> Hoan_Tat : Trừ tiền thành công
Hoan_Tat -down-> [*] : Kết thúc
@enduml
```

### 2.1.8 Nạp tiền ví VietQR PayOS (Khách hàng)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> Nhap_Tien
state "Nhập số tiền muốn nạp" as Nhap_Tien
state "Tạo mã VietQR qua PayOS" as Tao_QR
state "Chờ thanh toán (Pending)" as Cho_Thanh_Toan
state "Hủy giao dịch" as Huy_Giao_Dich
state "Nhận Webhook xác nhận" as Nhan_Webhook
state "Cộng tiền vào ví thành công" as Cong_Tien

Nhap_Tien -down-> Tao_QR : Nhấn nạp tiền
Tao_QR -down-> Cho_Thanh_Toan : Hiển thị mã QR
Cho_Thanh_Toan -left-> Huy_Giao_Dich : Quá hạn 2 phút
Huy_Giao_Dich -up-> Nhap_Tien : Tạo lại
Huy_Giao_Dich --> [*] : Thoát nạp tiền
Cho_Thanh_Toan -down-> Nhan_Webhook : Khách chuyển khoản
Nhan_Webhook -down-> Cong_Tien : Chữ ký hợp lệ
Cong_Tien -down-> [*] : Hoàn tất nạp tiền
@enduml
```

### 2.1.9 Xử lý hoàn tiền Refund (Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam linetype ortho
skinparam nodesep 80
skinparam ranksep 60
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] -down-> DS_KhieuNai
state "Danh sách phiên sạc lỗi" as DS_KhieuNai
state "Duyệt yêu cầu hoàn tiền" as Duyet
state "Kiểm tra số tiền" as Kiem_Tra
state "Báo lỗi dữ liệu" as Bao_Loi
state "Cộng tiền lại vào ví User" as Cong_Tien
state "Cập nhật (Refunded)" as Thanh_Cong

DS_KhieuNai -down-> Duyet : Chọn phiên sạc
Duyet -down-> Kiem_Tra : Gửi yêu cầu
Kiem_Tra -left-> Bao_Loi : Sai số tiền
Bao_Loi -up-> Duyet : Sửa lại
Bao_Loi --> [*] : Hủy hoàn tiền/thoát
Kiem_Tra -down-> Cong_Tien : Hợp lệ
Cong_Tien -down-> Thanh_Cong : Lưu hóa đơn
Thanh_Cong -down-> [*] : Thoát chức năng
@enduml
```

## 2.2 Xây dựng biểu đồ tuần tự (Sequence Diagram)

### 2.2.1 Đăng ký tài khoản & Xác thực OTP
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "Trang_DangKy" as Boundary <<boundary>>
control "XacThuc_Controller" as Control <<control>>
entity "TaiKhoan_Entity" as Entity <<entity>>
actor "Mail_Server" as Mail

KH -> Boundary: 1: Nhập thông tin (Tên, Email, SĐT, MK)
activate Boundary
Boundary -> Control: 1.1: guiThongTinDangKy()
activate Control
Control -> Entity: 1.1.1: kiemTraEmailTonTai(Email)
activate Entity
Entity --> Control: 1.1.2: hopLe (Chưa tồn tại)
Control -> Entity: 1.1.3: taoTaiKhoanMoi(isActive=false)
Entity --> Control: 1.1.4: taoThanhCong
deactivate Entity

Control -> Mail: 1.2: guiEmailOTP(Email, maOTP)
activate Mail
Mail --> Control: 1.2.1: guiThanhCong
deactivate Mail

Control --> Boundary: 1.3: chuyenHuongTrangXacThuc()
deactivate Control
Boundary --> KH: 1.4: Hiển thị form nhập OTP
deactivate Boundary
@enduml
```

### 2.2.2 Đăng nhập hệ thống
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Người dùng" as KH
boundary "ManHinh_DangNhap" as Boundary <<boundary>>
control "XacThuc_Controller" as Control <<control>>
entity "TaiKhoan_Entity" as Entity <<entity>>

KH -> Boundary: 1: Nhập Email & Mật khẩu
activate Boundary
Boundary -> Control: 1.1: xacThucDangNhap(email, password)
activate Control
Control -> Entity: 1.1.1: timKiemTaiKhoan(email)
activate Entity
Entity --> Control: 1.1.2: thongTinTaiKhoan
Control -> Control: 1.1.3: soSanhMatKhauBcrypt(password)
Control -> Entity: 1.1.4: kiemTraTrangThai(isActive)
Entity --> Control: 1.1.5: hopLe (True)
deactivate Entity
Control -> Control: 1.2: taoSessionCookie()
Control --> Boundary: 1.3: chuyenHuongTrangChu()
deactivate Control
Boundary --> KH: 1.4: Hiển thị màn hình chính
deactivate Boundary
@enduml
```

### 2.2.3 Quên & Đặt lại mật khẩu
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "Form_QuenMatKhau" as Boundary <<boundary>>
control "XacThuc_Controller" as Control <<control>>
entity "TaiKhoan_Entity" as Entity <<entity>>
actor "Mail_Server" as Mail

KH -> Boundary: 1: Nhập Email & Yêu cầu OTP
activate Boundary
Boundary -> Control: 1.1: yeuCauKhoiPhuc(email)
activate Control
Control -> Entity: 1.1.1: kiemTraEmailTonTai(email)
activate Entity
Entity --> Control: 1.1.2: emailHopLe
deactivate Entity
Control -> Control: 1.2: sinhMaOTPKhôiPhục()
Control -> Mail: 1.3: guiEmailOTP(email, maOTP)
activate Mail
Mail --> Control: 1.3.1: guiThanhCong
deactivate Mail
Control --> Boundary: 1.4: chuyenHuongDatLaiMK()
deactivate Control
Boundary --> KH: 1.5: Hiển thị form Mật khẩu mới
deactivate Boundary

KH -> Boundary: 2: Nhập OTP & Mật khẩu mới
activate Boundary
Boundary -> Control: 2.1: datLaiMatKhau(otp, newPassword)
activate Control
Control -> Control: 2.1.1: xacMinhOTP(otp)
Control -> Entity: 2.1.2: capNhatMatKhauMoi(newPassword)
activate Entity
Entity --> Control: 2.1.3: capNhatThanhCong
deactivate Entity
Control --> Boundary: 2.2: thongBaoThanhCong()
deactivate Control
Boundary --> KH: 2.3: Chuyển về trang Đăng nhập
deactivate Boundary
@enduml
```

### 2.2.4 Tìm trạm sạc trên bản đồ (Leaflet.js)
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ManHinh_BanDo" as Boundary <<boundary>>
control "TimKiemTram_Controller" as Control <<control>>
entity "TramSac_Entity" as Entity <<entity>>

KH -> Boundary: 1: Mở bản đồ tìm trạm
activate Boundary
Boundary -> Boundary: 1.1: layToaDoGPS()
Boundary -> Control: 1.2: timTramXungQuanh(lat, lng)
activate Control
Control -> Entity: 1.2.1: query2dsphere(lat, lng, banKinh)
activate Entity
Entity --> Control: 1.2.2: danhSachTramSac
deactivate Entity
Control --> Boundary: 1.3: traVeDuLieuTram(danhSachTramSac)
deactivate Control
Boundary -> Boundary: 1.4: veMarkerLenBanDo()
Boundary --> KH: 1.5: Hiển thị các trạm lân cận
deactivate Boundary
@enduml
```

### 2.2.5 Đặt chỗ sạc
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ChiTiet_TramSac" as Boundary <<boundary>>
control "DatCho_Controller" as Control <<control>>
entity "SungSac_Entity" as SungSac <<entity>>
entity "PhieuDatCho_Entity" as DatCho <<entity>>

KH -> Boundary: 1: Nhấn "Đặt chỗ" súng sạc
activate Boundary
Boundary -> Control: 1.1: taoYeuCauDatCho(userId, maSungSac)
activate Control
Control -> SungSac: 1.1.1: kiemTraTrangThai(maSungSac)
activate SungSac
SungSac --> Control: 1.1.2: trangThai = Available
deactivate SungSac
Control -> DatCho: 1.2: taoPhieuDatChoMoi(userId, maSungSac)
activate DatCho
DatCho --> Control: 1.2.1: taoThanhCong
deactivate DatCho
Control -> SungSac: 1.3: capNhatTrangThai(Reserved)
activate SungSac
SungSac --> Control: 1.3.1: capNhatXong
deactivate SungSac
Control --> Boundary: 1.4: thongBaoThanhCong()
deactivate Control
Boundary --> KH: 1.5: Đếm ngược giữ chỗ 30 phút
deactivate Boundary
@enduml
```

### 2.2.6 Khởi động sạc
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "App_ChiTietTram" as Boundary <<boundary>>
control "DieuKhienSac_Controller" as Control <<control>>
entity "ViDienTu_Entity" as Vi <<entity>>
entity "PhienSac_Entity" as PhienSac <<entity>>
actor "TruSac_IoT" as IoT

KH -> Boundary: 1: Cắm súng sạc & Nhấn "Bắt đầu sạc"
activate Boundary
Boundary -> Control: 1.1: yeuCauKhoiDongSac(maTru)
activate Control
Control -> Vi: 1.1.1: kiemTraSoDu(userId)
activate Vi
Vi --> Control: 1.1.2: soDu >= 200.000đ
deactivate Vi
Control -> IoT: 1.2: kiemTraTrangThaiTru(maTru)
activate IoT
IoT --> Control: 1.2.1: trangThai = Available
deactivate IoT
Control -> PhienSac: 1.3: taoPhienSacMoi(userId, maTru)
activate PhienSac
PhienSac --> Control: 1.3.1: taoThanhCong
deactivate PhienSac
Control -> IoT: 1.4: guiLenhDongReLe()
activate IoT
IoT --> Control: 1.4.1: dongReLeThanhCong
deactivate IoT
Control --> Boundary: 1.5: hienThiManHinhTheoDoi()
deactivate Control
Boundary --> KH: 1.6: Hiển thị % pin và kWh realtime
deactivate Boundary
@enduml
```

### 2.2.7 Dừng sạc & Trừ tiền ví
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ManHinh_TheoDoiSac" as Boundary <<boundary>>
control "DieuKhienSac_Controller" as Control <<control>>
actor "TruSac_IoT" as IoT
entity "PhienSac_Entity" as PhienSac <<entity>>
entity "ViDienTu_Entity" as Vi <<entity>>

KH -> Boundary: 1: Nhấn "Dừng sạc"
activate Boundary
Boundary -> Control: 1.1: yeuCauDungSac(maPhien)
activate Control
Control -> IoT: 1.1.1: guiLenhNgatReLe()
activate IoT
IoT --> Control: 1.1.2: ngatReLeThanhCong
deactivate IoT
Control -> PhienSac: 1.2: chotSoKwh(energyDelivered)
activate PhienSac
PhienSac --> Control: 1.2.1: tongChiPhi
Control -> Vi: 1.3: truTienVi(tongChiPhi)
activate Vi
Vi --> Control: 1.3.1: truTienThanhCong
deactivate Vi
Control -> PhienSac: 1.4: capNhatTrangThai(Completed, Paid)
PhienSac --> Control: 1.4.1: capNhatXong
deactivate PhienSac
Control --> Boundary: 1.5: traVeHoaDonChiTiet()
deactivate Control
Boundary --> KH: 1.6: Hiển thị hóa đơn thanh toán
deactivate Boundary
@enduml
```

### 2.2.8 Nạp tiền VietQR (PayOS)
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ManHinh_NapTien" as Boundary <<boundary>>
control "ThanhToan_Controller" as Control <<control>>
entity "GiaoDich_Entity" as Entity <<entity>>
actor "PayOS_Gateway" as PayOS

KH -> Boundary: 1: Nhập số tiền & Nhấn "Nạp tiền"
activate Boundary
Boundary -> Control: 1.1: taoYeuCauNapTien(soTien)
activate Control
Control -> Entity: 1.1.1: taoGiaoDichPending(soTien)
activate Entity
Entity --> Control: 1.1.2: maGiaoDich
deactivate Entity
Control -> PayOS: 1.2: taoLinkThanhToan(maGiaoDich, soTien)
activate PayOS
PayOS --> Control: 1.2.1: linkQR & maVietQR
deactivate PayOS
Control --> Boundary: 1.3: hienThiMaQR(maVietQR)
deactivate Control
Boundary --> KH: 1.4: Quét QR trên App Ngân hàng
deactivate Boundary

PayOS -> Control: 2: guiWebhookGiaoDich(chuKyHMAC)
activate Control
Control -> Control: 2.1: xacThucChuKy(chuKyHMAC)
Control -> Entity: 2.2: capNhatThanhCongGiaoDich()
activate Entity
Entity --> Control: 2.3: capNhatXong
deactivate Entity
Control --> PayOS: 2.4: phanHoiStatus(200 OK)
deactivate Control
@enduml
```

### 2.2.9 Xem lịch sử giao dịch
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ManHinh_LichSu" as Boundary <<boundary>>
control "LichSu_Controller" as Control <<control>>
entity "PhienSac_Entity" as Entity <<entity>>

KH -> Boundary: 1: Bấm tab "Lịch sử"
activate Boundary
Boundary -> Control: 1.1: layDanhSachGiaoDich(userId)
activate Control
Control -> Entity: 1.1.1: truyVanLichSuSac(userId, sort=desc)
activate Entity
Entity --> Control: 1.1.2: danhSachPhienSac
deactivate Entity
Control --> Boundary: 1.2: traVeDuLieuLichSu()
deactivate Control
Boundary --> KH: 1.3: Hiển thị danh sách phân trang
deactivate Boundary
@enduml
```

### 2.2.10 Xem Dashboard Thống kê (Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Quản trị viên" as Admin
boundary "Dashboard_Admin" as Boundary <<boundary>>
control "ThongKe_Controller" as Control <<control>>
entity "PhienSac_Entity" as Entity <<entity>>

Admin -> Boundary: 1: Truy cập trang Dashboard
activate Boundary
Boundary -> Control: 1.1: layDuLieuThongKe(thoiGian)
activate Control
Control -> Entity: 1.1.1: tongHopDoanhThu(thoiGian)
activate Entity
Entity --> Control: 1.1.2: dataDoanhThu
Control -> Entity: 1.1.3: demSoLuongTramVaUser()
Entity --> Control: 1.1.4: dataKPI
deactivate Entity
Control --> Boundary: 1.2: traVeDuLieu(dataDoanhThu, dataKPI)
deactivate Control
Boundary -> Boundary: 1.3: veBieuDoChartJS()
Boundary --> Admin: 1.4: Hiển thị biểu đồ & KPI tổng quan
deactivate Boundary
@enduml
```

### 2.2.11 Quản lý trạm sạc (Thêm/Sửa trạm - Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Quản trị viên" as Admin
boundary "GD_QuanLyTramSac" as Boundary <<boundary>>
control "DK_QuanLyTramSac" as Control <<control>>
entity "TT_TramSac" as Entity <<entity>>

Admin -> Boundary: 1: Nhấn "Thêm trạm sạc"
activate Boundary
Boundary -> Control: 1.1: yeuCauTrangThem()
activate Control
Control --> Boundary: 1.2: hienThiFormThemTram()
deactivate Control
Boundary --> Admin: 1.3: Hiển thị Form nhập liệu
deactivate Boundary

Admin -> Boundary: 2: Nhập thông tin & Nhấn "Lưu"
activate Boundary
Boundary -> Control: 2.1: luuTramSac(thongTin)
activate Control
Control -> Entity: 2.1.1: kiemTraDuLieu(thongTin)
activate Entity
Entity --> Control: 2.1.2: duLieuHopLe
Control -> Entity: 2.1.3: themTramSacMoi(thongTin)
Entity --> Control: 2.1.4: themThanhCong
deactivate Entity
Control --> Boundary: 2.2: hienThiThongBaoThanhCong()
deactivate Control
Boundary --> Admin: 2.3: Báo "Thêm trạm thành công"
deactivate Boundary
@enduml
```

### 2.2.12 Lập phiếu bảo trì (Admin)
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Quản trị viên" as Admin
boundary "GD_QuanLyBaoTri" as Boundary <<boundary>>
control "BaoTri_Controller" as Control <<control>>
entity "SungSac_Entity" as SungSac <<entity>>
entity "PhieuBaoTri_Entity" as Phieu <<entity>>

Admin -> Boundary: 1: Tạo phiếu bảo trì súng sạc
activate Boundary
Boundary -> Control: 1.1: taoPhieuBaoTri(maSungSac, lyDo)
activate Control
Control -> SungSac: 1.1.1: kiemTraTrangThai(maSungSac)
activate SungSac
SungSac --> Control: 1.1.2: hopLe (Không có người sạc)
Control -> SungSac: 1.1.3: chuyenTrangThai(Maintenance)
SungSac --> Control: 1.1.4: chuyenThanhCong
deactivate SungSac
Control -> Phieu: 1.2: luuPhieuBaoTriMoi()
activate Phieu
Phieu --> Control: 1.2.1: luuThanhCong
deactivate Phieu
Control --> Boundary: 1.3: thongBaoThanhCong()
deactivate Control
Boundary --> Admin: 1.4: Hiển thị danh sách phiếu
deactivate Boundary
@enduml
```

## 2.3 Vẽ lại biểu đồ lớp hoàn chỉnh

```plantuml
@startuml
skinparam class {
  BackgroundColor White
  ArrowColor #333333
  BorderColor #333333
}

class User {
  - userId: String
  - fullName: String
  - email: String
  - phone: String
  - passwordHash: String
  - role: String
  - walletBalance: Float
  - isActive: Boolean
  + login(): Boolean
  + register(): Boolean
  + verifyOTP(otp: String): Boolean
  + updateProfile(): void
  + resetPassword(): void
}

class Station {
  - stationId: String
  - name: String
  - address: String
  - latitude: Float
  - longitude: Float
  - pricePerKwh: Float
  - status: String
  + addStation(): void
  + updateStation(): void
  + deleteStation(): void
  + getAvailableConnectors(): Int
}

class Connector {
  - connectorId: String
  - type: String (Type2/CCS)
  - powerKw: Float
  - status: String (Available/InUse/Maintenance)
  + lockConnector(): void
  + unlockConnector(): void
  + updateStatus(): void
}

class ChargingSession {
  - sessionId: String
  - startTime: DateTime
  - endTime: DateTime
  - energyDeliveredKwh: Float
  - currentPercent: Int
  - totalCost: Float
  - status: String
  + startSession(): void
  + updateProgress(): void
  + stopSession(): void
  + calculateTotalCost(): Float
}

class Payment {
  - paymentId: String
  - amount: Float
  - paymentMethod: String
  - transactionCode: String
  - timestamp: DateTime
  - status: String
  + processWalletPayment(): Boolean
  + generateVietQR(): String
  + verifyWebhookHMAC(): Boolean
}

class Reservation {
  - reservationId: String
  - timeSlot: DateTime
  - status: String
  + makeReservation(): Boolean
  + cancelReservation(): void
  + checkTimeout(): Boolean
}

class MaintenanceTicket {
  - ticketId: String
  - issueDescription: String
  - reportedDate: DateTime
  - resolvedDate: DateTime
  - status: String
  + createTicket(): void
  + updateProgress(): void
  + resolveTicket(): void
}

User "1" -- "*" ChargingSession : initiates >
User "1" -- "*" Payment : makes >
User "1" -- "*" Reservation : books >
Station "1" *-- "1..*" Connector : contains >
Connector "1" -- "*" ChargingSession : hosts >
Connector "1" -- "*" Reservation : reserved by >
ChargingSession "1" -- "1" Payment : paid via >
Station "1" -- "*" MaintenanceTicket : has >
User "1" -- "*" MaintenanceTicket : assigned to >

@enduml
```
