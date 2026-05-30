# BÀI 4: PHÂN TÍCH HỆ THỐNG - PHẦN 2: PHÂN TÍCH ĐỘNG

## 4.2 Phân tích động

### 4.2.1 Xây dựng biểu đồ trạng thái

Trong mục này, hệ thống xây dựng biểu đồ trạng thái (Statechart Diagram) để mô tả chi tiết các vòng đời và luồng tiến trình cho các nghiệp vụ vận hành chính, tuân thủ chặt chẽ theo cấu trúc gọn gàng và logic:

**- Biểu đồ trạng thái phiên sạc (Statechart Diagram)**

![Biểu đồ trạng thái](./statechart.png)

```plantuml
@startuml Statechart_ChargingSession
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> PENDING : User gửi lệnh Bắt đầu sạc
state "PENDING (Chờ xử lý)" as PENDING
state "CHARGING (Đang sạc)" as CHARGING
state "COMPLETED (Đã sạc xong)" as COMPLETED
state "SYSTEM_ERROR (Lỗi Kỹ Thuật)" as SYSTEM_ERROR
state "PAID_SUCCESS (Thanh toán thành công)" as PAID_SUCCESS
state "DEBT_ACCOUNT (Nợ cước)" as DEBT_ACCOUNT
state "REFUND_PROCESSING (Đang hoàn tiền)" as REFUND_PROCESSING
state "CANCELLED (Đã hủy)" as CANCELLED

PENDING --> CHARGING : Đóng mạch điện thành công
PENDING -right-> CANCELLED : Bị hủy (Số dư không đủ)

CHARGING --> COMPLETED : Pin đầy HOẶC User dừng sạc
CHARGING -right-> SYSTEM_ERROR : Lỗi phần cứng, Mất mạng

COMPLETED --> PAID_SUCCESS : Trừ tiền Ví thành công
COMPLETED --> DEBT_ACCOUNT : Trừ tiền thất bại

SYSTEM_ERROR --> REFUND_PROCESSING : Tính toán lại và hoàn tiền

PAID_SUCCESS --> [*]
DEBT_ACCOUNT --> [*]
REFUND_PROCESSING --> [*]
CANCELLED --> [*]
@enduml
```

**- Quản lý tài khoản (Biểu đồ trạng thái)**
```plantuml
@startuml Statechart_AccountManagement
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> Chon_GD
state "Chọn giao diện quản lý tài khoản" as Chon_GD
state "Chọn chỉnh sửa hoặc vô hiệu hóa" as Chon_Thao_Tac
state "Cảnh báo thao tác vô hiệu hóa" as Canh_Bao
state "Lỗi hệ thống" as Loi_He_Thong
state "Xác nhận lưu thay đổi" as Xac_Nhan_Luu
state "Cập nhật thành công" as Cap_Nhat_Thanh_Cong

Chon_GD --> Chon_Thao_Tac : Hiển thị danh sách tài khoản hiện có
Chon_Thao_Tac -left-> Canh_Bao : hiển thị cảnh báo vô hiệu hóa tài khoản
Canh_Bao -up-> Chon_GD : Thực hiện lại thao tác nếu hủy bỏ
Canh_Bao --> Xac_Nhan_Luu : Xác nhận vô hiệu hóa
Chon_Thao_Tac --> Xac_Nhan_Luu : Hệ thống kiểm tra dữ liệu và tự cập nhật
Chon_Thao_Tac -right-> Loi_He_Thong : Xảy ra sự cố hệ thống
Loi_He_Thong -up-> Chon_GD : Thực hiện lại thao tác
Xac_Nhan_Luu --> Cap_Nhat_Thanh_Cong : Cập nhật vào cơ sở dữ liệu
Cap_Nhat_Thanh_Cong --> [*] : Thoát
Loi_He_Thong --> [*] : Thoát
@enduml
```

**- Quản lý trạm sạc (Biểu đồ trạng thái)**
```plantuml
@startuml Statechart_StationManagement
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> Chon_GD_QL_Tram
state "Chọn giao diện quản lý trạm sạc" as Chon_GD_QL_Tram
state "Chọn thêm, sửa hoặc xóa trạm sạc" as Chon_Thao_Tac
state "Xác nhận xóa trạm sạc" as Xac_Nhan_Xoa
state "Lỗi hệ thống" as Loi_He_Thong
state "Xác nhận lưu thay đổi" as Xac_Nhan_Luu
state "Cập nhật thành công" as Cap_Nhat_Thanh_Cong

Chon_GD_QL_Tram --> Chon_Thao_Tac : Hiển thị danh sách trạm sạc hiện có
Chon_Thao_Tac -left-> Xac_Nhan_Xoa : hiển thị cảnh báo xóa trạm
Xac_Nhan_Xoa -up-> Chon_GD_QL_Tram : Thực hiện lại thao tác nếu không xác nhận xóa
Xac_Nhan_Xoa --> Xac_Nhan_Luu : Xác nhận xóa
Chon_Thao_Tac --> Xac_Nhan_Luu : Hệ thống kiểm tra dữ liệu và tự cập nhật
Chon_Thao_Tac -right-> Loi_He_Thong : Xảy ra sự cố hệ thống
Loi_He_Thong -up-> Chon_GD_QL_Tram : Thực hiện lại thao tác
Xac_Nhan_Luu --> Cap_Nhat_Thanh_Cong : Cập nhật vào cơ sở dữ liệu
Cap_Nhat_Thanh_Cong --> [*] : Thoát
Loi_He_Thong --> [*] : Thoát
@enduml
```

**- Quản lý bảo trì (Biểu đồ trạng thái)**
```plantuml
@startuml Statechart_MaintenanceManagement
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> Chon_Bao_Tri
state "Chọn bảo trì trạm sạc" as Chon_Bao_Tri
state "Chọn trạm sạc và xem lịch bảo trì" as Xem_Lich
state "Không có trạm nào cần bảo trì" as Khong_Co_Tram
state "Cập nhật trạng thái bảo trì trạm sạc" as Cap_Nhat
state "Cập nhật thất bại" as Cap_Nhat_That_Bai
state "Cập nhật trạng thái thành công" as Cap_Nhat_Thanh_Cong

Chon_Bao_Tri --> Xem_Lich : Hiển thị giao diện bảo trì trạm sạc
Xem_Lich -right-> Khong_Co_Tram : thông báo không có trạm sạc cần bảo trì
Xem_Lich --> Cap_Nhat : Hiển thị chi tiết tình trạng trạm sạc
Cap_Nhat -left-> Cap_Nhat_That_Bai : Lỗi cập nhật
Cap_Nhat_That_Bai -up-> Chon_Bao_Tri : Thực hiện lại thao tác
Cap_Nhat --> Cap_Nhat_Thanh_Cong : xử lí thành công
Cap_Nhat_Thanh_Cong --> [*] : Thoát
Cap_Nhat_That_Bai --> [*] : Không thực hiện và thoát khỏi giao diện
Khong_Co_Tram --> [*] : Thoát khỏi giao diện
@enduml
```

**- Quản lý Giá Cước (Biểu đồ trạng thái)**
```plantuml
@startuml Statechart_PricingManagement
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> Chon_GD
state "Chọn giao diện quản lý giá cước" as Chon_GD
state "Chọn cấu hình hoặc sửa giá cước" as Chon_Thao_Tac
state "Cảnh báo giá cước không hợp lệ" as Canh_Bao
state "Lỗi hệ thống" as Loi_He_Thong
state "Xác nhận lưu thay đổi" as Xac_Nhan_Luu
state "Cập nhật thành công" as Cap_Nhat_Thanh_Cong

Chon_GD --> Chon_Thao_Tac : Hiển thị bảng giá cước hiện có
Chon_Thao_Tac -left-> Canh_Bao : kiểm tra đơn giá < 0 hoặc trùng khung giờ
Canh_Bao -up-> Chon_GD : Thực hiện lại thao tác nhập liệu
Canh_Bao --> Xac_Nhan_Luu : Chỉnh sửa hợp lệ và xác nhận
Chon_Thao_Tac --> Xac_Nhan_Luu : Hệ thống xác thực dữ liệu và tự cập nhật
Chon_Thao_Tac -right-> Loi_He_Thong : Xảy ra sự cố hệ thống
Loi_He_Thong -up-> Chon_GD : Thực hiện lại thao tác
Xac_Nhan_Luu --> Cap_Nhat_Thanh_Cong : Cập nhật vào cơ sở dữ liệu
Cap_Nhat_Thanh_Cong --> [*] : Thoát
Loi_He_Thong --> [*] : Thoát
@enduml
```

**- Khởi động sạc (Biểu đồ trạng thái)**
```plantuml
@startuml Statechart_StartCharging
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> Chon_GD
state "Chọn chức năng quét mã QR" as Chon_GD
state "Hệ thống kiểm tra trụ sạc và số dư ví" as Kiem_Tra
state "Không đủ điều kiện sạc" as Khong_Du_Dieu_Kien
state "Gửi lệnh đóng rơ-le cấp điện" as Dong_Re_Le
state "Lỗi kết nối phần cứng" as Loi_Ket_Noi
state "Bắt đầu sạc thành công" as Sac_Thanh_Cong

Chon_GD --> Kiem_Tra : Gửi yêu cầu khởi động sạc
Kiem_Tra -right-> Khong_Du_Dieu_Kien : thông báo số dư < 200k hoặc súng sạc chưa cắm
Khong_Du_Dieu_Kien -up-> Chon_GD : Yêu cầu nạp tiền hoặc cắm lại súng sạc
Kiem_Tra --> Dong_Re_Le : Xác nhận đủ số dư và súng sạc đã cắm chặt
Dong_Re_Le -left-> Loi_Ket_Noi : Lỗi kết nối trụ sạc
Loi_Ket_Noi -up-> Chon_GD : Thực hiện lại thao tác quét QR
Dong_Re_Le --> Sac_Thanh_Cong : Xử lí đóng mạch điện thành công
Sac_Thanh_Cong --> [*] : Hiển thị tiến trình sạc
Loi_Ket_Noi --> [*] : Hủy bỏ phiên sạc
Khong_Du_Dieu_Kien --> [*] : Thoát khỏi giao diện
@enduml
```

**- Đặt chỗ trước (Biểu đồ trạng thái)**
```plantuml
@startuml Statechart_Reservation
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> Chon_GD
state "Chọn trạm sạc trên bản đồ" as Chon_GD
state "Chọn cổng sạc muốn đặt chỗ" as Chon_Cong
state "Cổng sạc không khả dụng" as Khong_Kha_Dung
state "Xác nhận thông tin đặt chỗ" as Xac_Nhan
state "Lỗi hệ thống" as Loi_He_Thong
state "Đặt chỗ thành công" as Thanh_Cong

Chon_GD --> Chon_Cong : Hiển thị chi tiết các cổng sạc
Chon_Cong -right-> Khong_Kha_Dung : Cổng sạc đang bảo trì hoặc có người dùng
Khong_Kha_Dung -up-> Chon_GD : Trở lại tìm kiếm trạm khác
Chon_Cong --> Xac_Nhan : Hệ thống kiểm tra cổng sạc khả dụng (Available)
Xac_Nhan -left-> Loi_He_Thong : Lỗi kết nối server
Loi_He_Thong -up-> Chon_GD : Thực hiện lại thao tác
Xac_Nhan --> Thanh_Cong : Hệ thống khóa cổng sạc tạm thời (30 phút)
Thanh_Cong --> [*] : Chờ khách hàng đến quét QR
Loi_He_Thong --> [*] : Hủy bỏ
Khong_Kha_Dung --> [*] : Thoát khỏi giao diện
@enduml
```

**- Thanh toán (Biểu đồ trạng thái)**
```plantuml
@startuml Statechart_Payment
skinparam backgroundColor white
skinparam state {
  BackgroundColor LightCyan
  BorderColor Teal
  ArrowColor #333333
}

[*] --> Chon_GD
state "Chọn phương thức thanh toán" as Chon_GD
state "Hệ thống kiểm tra giao dịch" as Kiem_Tra
state "Thanh toán thất bại" as That_Bai
state "Xác nhận trừ tiền và cập nhật hóa đơn" as Xac_Nhan
state "Lỗi hệ thống (PayOS)" as Loi_He_Thong
state "Thanh toán thành công" as Thanh_Cong

Chon_GD --> Kiem_Tra : Gửi yêu cầu thanh toán (Ví PayOS hoặc VietQR)
Kiem_Tra -left-> That_Bai : Số dư không đủ hoặc quét QR quá hạn
That_Bai -up-> Chon_GD : Thực hiện lại thao tác thanh toán
Kiem_Tra --> Xac_Nhan : Webhook trả về trạng thái giao dịch hợp lệ
Xac_Nhan -right-> Loi_He_Thong : Lỗi cập nhật cơ sở dữ liệu
Loi_He_Thong -up-> Chon_GD : Chờ xử lý lại
Xac_Nhan --> Thanh_Cong : Lưu hóa đơn và giải phóng súng sạc
Thanh_Cong --> [*] : Hoàn thành
Loi_He_Thong --> [*] : Thoát
That_Bai --> [*] : Thoát
@enduml
```

---

### 4.2.2 Xây dựng biểu đồ tuần tự

Dưới đây là 7 biểu đồ tuần tự được xây dựng theo đúng nguyên lý Robustness ECB (Entity - Control - Boundary) và đã được dịch nghĩa toàn bộ sang tiếng Việt cho dễ hiểu. Các biểu tượng Actor (Người dùng/Hệ thống bên ngoài), Boundary (Giao diện), Control (Bộ điều khiển logic), và Entity (Thực thể dữ liệu) được thể hiện rõ ràng.

**- Quản lý tài khoản**
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Quản trị viên" as Admin
boundary "ManHinh_DanhSachNguoiDung" as Boundary <<boundary>>
control "QuanLyNguoiDungController" as Control <<control>>
entity "ThucThe_NguoiDung" as Entity <<entity>>

Admin -> Boundary: 1: Mở giao diện quản lý tài khoản
Boundary -> Control: 1.1: layDanhSachNguoiDungActive()
Control -> Entity: 1.2: timKiemNguoiDungActive()
Entity --> Control: 1.3: danhSachNguoiDung
Control --> Boundary: 1.4: hienThiDanhSach(danhSachNguoiDung)
Boundary --> Admin: 1.5: Hiển thị danh sách tài khoản

Admin -> Boundary: 2: Chỉnh sửa tài khoản (maNguoiDung, thongTinMoi)
Boundary -> Control: 2.1: capNhatThongTinNguoiDung(maNguoiDung, thongTinMoi)
Control -> Entity: 2.2: timKiemVaCapNhat(maNguoiDung, thongTinMoi)
Entity --> Control: 2.3: capNhatThanhCong
Control --> Boundary: 2.4: hienThiThongBao("Cập nhật thành công")
Boundary --> Admin: 2.5: Hiển thị thông báo thành công
@enduml
```

**- Quản lý trạm sạc**
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Quản trị viên" as Admin
boundary "ManHinh_DanhSachTramSac" as Boundary <<boundary>>
control "QuanLyTramSacController" as Control <<control>>
entity "ThucThe_TramSac" as Station <<entity>>
entity "ThucThe_TruSac" as Charger <<entity>>

Admin -> Boundary: 1: Mở giao diện quản lý trạm sạc
Boundary -> Control: 1.1: layDanhSachTramVaTru()
Control -> Station: 1.2: timKiemTatCaTram()
Station --> Control: 1.3: danhSachTram
Control -> Charger: 1.4: timKiemTruTheoTram()
Charger --> Control: 1.5: danhSachTru
Control --> Boundary: 1.6: hienThiDanhSachTramVaTru(danhSachTram, danhSachTru)
Boundary --> Admin: 1.7: Hiển thị danh sách trạm & trụ sạc

Admin -> Boundary: 2: Thêm trạm sạc mới (thongTinTram)
Boundary -> Control: 2.1: taoTramSacMoi(thongTinTram)
Control -> Station: 2.2: luuTramSacMoi(thongTinTram)
Station --> Control: 2.3: luuThanhCong
Control --> Boundary: 2.4: hienThiThongBao("Thêm trạm thành công")
Boundary --> Admin: 2.5: Cập nhật hiển thị trạm mới
@enduml
```

**- Quản lý bảo trì**
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Quản trị viên" as Admin
boundary "ManHinh_LichBaoTri" as Boundary <<boundary>>
control "QuanLyBaoTriController" as Control <<control>>
entity "ThucThe_LichBaoTri" as Maintenance <<entity>>
entity "ThucThe_TruSac" as Charger <<entity>>

Admin -> Boundary: 1: Mở lịch bảo trì trạm sạc
Boundary -> Control: 1.1: layDanhSachPhieuBaoTri()
Control -> Maintenance: 1.2: timKiemPhieuBaoTri()
Maintenance --> Control: 1.3: danhSachPhieu
Control --> Boundary: 1.4: hienThiLichBaoTri(danhSachPhieu)
Boundary --> Admin: 1.5: Hiển thị danh sách phiếu bảo trì

Admin -> Boundary: 2: Lên lịch bảo trì (maTram, maTru, ngayBaoTri)
Boundary -> Control: 2.1: taoPhieuBaoTriMoi(maTram, maTru, ngayBaoTri)
Control -> Maintenance: 2.2: luuPhieuBaoTri(maTram, maTru, ngayBaoTri, trangThai="ChoBaoTri")
Maintenance --> Control: 2.3: thongTinPhieu
Control -> Charger: 2.4: capNhatTrangThaiTru(maTru, trangThai="NgoaiTuyen")
Charger --> Control: 2.5: capNhatThanhCong
Control --> Boundary: 2.6: hienThiThongBao("Lên lịch bảo trì thành công")
Boundary --> Admin: 2.7: Cập nhật giao diện bảo trì
@enduml
```

**- Quản lý Giá Cước**
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Quản trị viên" as Admin
boundary "ManHinh_CauHinhGiaCuoc" as Boundary <<boundary>>
control "QuanLyGiaCuocController" as Control <<control>>
entity "ThucThe_TramSac" as Station <<entity>>

Admin -> Boundary: 1: Xem cấu hình bảng giá điện hiện tại
Boundary -> Control: 1.1: layGiaCuocHienTai()
Control -> Station: 1.2: timKiemDonGiaTram()
Station --> Control: 1.3: bangGiaCuoc
Control --> Boundary: 1.4: hienThiBangGiaCuoc(bangGiaCuoc)
Boundary --> Admin: 1.5: Hiển thị bảng giá điện theo khung giờ

Admin -> Boundary: 2: Cập nhật giá cước (maTram, donGiaMoi)
Boundary -> Control: 2.1: thietLapGiaCuocMoi(maTram, donGiaMoi)
Control -> Station: 2.2: capNhatDonGiaTram(maTram, donGiaMoi)
Station --> Control: 2.3: capNhatThanhCong
Control --> Boundary: 2.4: hienThiThongBao("Cấu hình giá thành công")
Boundary --> Admin: 2.5: Hiển thị bảng giá mới áp dụng
@enduml
```

**- Khởi động sạc**

![Biểu đồ tuần tự Khởi động sạc](./seq_charging.png)
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ManHinh_DangSac" as Boundary <<boundary>>
control "DieuKhienSacController" as Control <<control>>
entity "ThucThe_KhachHang" as Wallet <<entity>>
entity "ThucThe_TruSac" as Charger <<entity>>
entity "ThucThe_PhienSac" as Session <<entity>>
actor "TruSacPhanCung" as Hardware

KH -> Boundary: 1: Mở app & Quét mã QR tại trụ sạc
Boundary -> Control: 1.1: kiemTraTrangThaiTru(maTru)
Control -> Charger: 1.2: timKiemTruTheoMa(maTru)
Charger --> Control: 1.3: thongTinTru (trangThai="SanSang")
Control -> Wallet: 1.4: kiemTraSoDuVi(maKhachHang)
Wallet --> Control: 1.5: soDuVi (>= 200.000đ)
Control --> Boundary: 1.6: hienThiXacNhanBatDau(thongTinTru)
Boundary --> KH: 1.7: Hiển thị nút "Bắt đầu sạc"

KH -> Boundary: 2: Bấm nút "Xác nhận sạc"
Boundary -> Control: 2.1: batDauPhienSac(maKhachHang, maTru)
Control -> Session: 2.2: taoPhienSacMoi(maKhachHang, maTru, thoiGianBatDau=now, trangThai="DangSac")
Session --> Control: 2.3: thongTinPhienSac
Control -> Charger: 2.4: capNhatTrangThaiTru(maTru, trangThai="DangSac")
Charger --> Control: 2.5: capNhatThanhCong
Control -> Hardware: 2.6: kichHoatDongReLeCapDien()
Hardware --> Control: 2.7: reLeDaDong
Control --> Boundary: 2.8: hienThiTienTrinhSac(thongTinPhienSac)
Boundary --> KH: 2.9: Hiển thị tiến trình sạc (kW, kWh, %) thời gian thực
@enduml
```

**- Đặt chỗ trước**
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ManHinh_DatChoTruoc" as Boundary <<boundary>>
control "QuanLyDatChoController" as Control <<control>>
entity "ThucThe_TruSac" as Charger <<entity>>
entity "ThucThe_DatCho" as Reservation <<entity>>

KH -> Boundary: 1: Tìm trạm sạc & Chọn cổng sạc
Boundary -> Control: 1.1: kiemTraTrangThaiCong(maTru)
Control -> Charger: 1.2: timKiemTruTheoMa(maTru)
Charger --> Control: 1.3: thongTinTru (trangThai="SanSang")
Control --> Boundary: 1.4: hienThiGiaoDienDatCho(thongTinTru)
Boundary --> KH: 1.5: Hiển thị thông tin đặt chỗ

KH -> Boundary: 2: Chọn khung giờ & Bấm "Đặt chỗ"
Boundary -> Control: 2.1: datChoTruoc(maKhachHang, maTru, thoiGianDat)
Control -> Reservation: 2.2: taoPhieuDatCho(maKhachHang, maTru, thoiGianDat, trangThai="KichHoat")
Reservation --> Control: 2.3: thongTinDatCho
Control -> Charger: 2.4: capNhatTrangThaiTru(maTru, trangThai="DaDatCho")
Charger --> Control: 2.5: capNhatThanhCong
Control --> Boundary: 2.6: hienThiThongBao("Đặt chỗ thành công")
Boundary --> KH: 2.7: Màn hình giữ chỗ (30 phút)
@enduml
```

**- Thanh toán**

![Biểu đồ tuần tự Thanh toán](./seq_payment.png)
```plantuml
@startuml
skinparam backgroundColor white
skinparam sequenceArrowThickness 1
skinparam sequenceLifeLineBorderColor #333333

actor "Khách hàng" as KH
boundary "ManHinh_ThanhToan" as Boundary <<boundary>>
control "ThanhToanController" as Control <<control>>
entity "ThucThe_PhienSac" as Session <<entity>>
entity "ThucThe_HoaDon" as Invoice <<entity>>
entity "ThucThe_KhachHang" as Wallet <<entity>>
actor "CongThanhToan_PayOS" as PayOS

KH -> Boundary: 1: Chọn phiên sạc kết thúc & Bấm "Thanh toán"
Boundary -> Control: 1.1: taoHoaDonThanhToan(maPhienSac)
Control -> Session: 1.2: layLuongDienTieuThu(maPhienSac)
Session --> Control: 1.3: duLieuTieuThu
Control -> Control: 1.4: tinhTongTienSac(duLieuTieuThu)
Control -> Invoice: 1.5: taoHoaDonMoi(maPhienSac, tongTien, trangThai="ChoThanhToan")
Invoice --> Control: 1.6: thongTinHoaDon
Control --> Boundary: 1.7: hienThiChiTietHoaDon(thongTinHoaDon)
Boundary --> KH: 1.8: Hiển thị số tiền và các phương thức thanh toán

KH -> Boundary: 2: Chọn phương thức "Cổng PayOS VietQR"
Boundary -> Control: 2.1: yeuCauLienKetPayOS(maHoaDon)
Control -> PayOS: 2.2: taoLienKetThanhToanVietQR(maHoaDon, tongTien)
PayOS --> Control: 2.3: duongDanThanhToan & maQRVietQR
Control --> Boundary: 2.4: hienThiMaQRVietQR(maQRVietQR)
Boundary --> KH: 2.5: Hiển thị mã QR để quét thanh toán

KH -> PayOS: 3: Quét mã QR & chuyển khoản qua ngân hàng
PayOS -> Control: 3.1: guiWebhookXacNhan(maGiaoDich, trangThai="DA_THANH_TOAN")
Control -> Control: 3.2: xacThucChuKyBaoMatHMAC()
Control -> Invoice: 3.3: capNhatTrangThaiHoaDon(maHoaDon, trangThai="DaThanhToan")
Invoice --> Control: 3.4: capNhatThanhCong
Control -> Session: 3.5: capNhatTrangThaiPhienSac(maPhienSac, trangThai="DaHoanThanh")
Session --> Control: 3.6: capNhatThanhCong
Control --> Boundary: 3.7: hienThiBienLai(thongTinHoaDon)
Boundary --> KH: 3.8: Hiển thị biên lai điện tử & mở khóa đầu súng sạc
@enduml
```

---

### 4.2.3 Vẽ lại biểu đồ lớp hoàn chỉnh

![Biểu đồ lớp hoàn chỉnh](./class_diagram.png)

*(Đây là biểu đồ lớp hoàn chỉnh được thiết kế tập trung vào 7 lớp nghiệp vụ chính yếu nhất với đầy đủ các thuộc tính và phương thức từ đầu, sử dụng tông màu vàng).*

```plantuml
@startuml
skinparam classBackgroundColor #FFE4B5
skinparam classBorderColor #B8860B

class User {
  + userID: String
  + name: String
  + phoneNumber: String
  + email: String
  + password: String
  + status: String
  + login()
  + register()
  + updateInformation()
}

class Administrator {
  + managementPermissions: List
  + manageCustomers()
  + manageStations()
  + manageMaintenance()
  + manageFareRates()
}

class Customer {
  + customerID: String
  + vehicleInfo: String
  + address: String
  + paymentMethods: List
  + rewardPoints: Integer
  + viewChargingHistory()
  + rateStation()
}

class ChargingStation {
  + stationID: String
  + stationName: String
  + location: String
  + totalChargers: Integer
  + status: String
  + updateStationStatus()
  + getChargingSlots()
}

class Charger {
  + chargerID: String
  + stationID: String
  + chargerType: String
  + powerOutput: Float
  + status: String
  + checkConnection()
  + startPowerSupply()
  + stopPowerSupply()
  + transmitData()
}

class ChargingSession {
  + sessionID: String
  + customerID: String
  + chargerID: String
  + status: String
  + startTime: DateTime
  + endTime: DateTime
  + energyConsumed: Float
  + totalPrice: Float
  + startSession()
  + stopSession()
  + makePayment()
}

class PaymentInvoice {
  + invoiceID: String
  + sessionID: String
  + amount: Float
  + paymentMethod: String
  + timestamp: DateTime
  + status: String
  + processPayment()
  + generateReceipt()
}

User <|-- Customer : Extends
User <|-- Administrator : Extends

Customer "1" -- "1..*" ChargingSession
ChargingSession "1" -- "1" PaymentInvoice
ChargingStation "1" *-- "1..*" Charger
Charger "1" -- "1..*" ChargingSession
@enduml
```