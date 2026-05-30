const fs = require('fs');
const file = 'c:/Users/nkh15/Downloads/ev-charging-system/bao-cao-cuoi-ky/Bai_4_Phan_Tich_Dong.md';
let content = fs.readFileSync(file, 'utf8');

const newStateDiagrams = `Trong mục này, hệ thống xây dựng biểu đồ trạng thái (Statechart Diagram) để mô tả chi tiết các vòng đời và luồng tiến trình cho các nghiệp vụ vận hành chính, tuân thủ chặt chẽ theo cấu trúc gọn gàng và logic:

**- Biểu đồ trạng thái phiên sạc (Statechart Diagram)**

![Biểu đồ trạng thái](./statechart.png)

\`\`\`plantuml
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
\`\`\`

**- Quản lý tài khoản (Biểu đồ trạng thái)**
\`\`\`plantuml
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
\`\`\`

**- Quản lý trạm sạc (Biểu đồ trạng thái)**
\`\`\`plantuml
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
\`\`\`

**- Quản lý bảo trì (Biểu đồ trạng thái)**
\`\`\`plantuml
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
\`\`\`

**- Quản lý Giá Cước (Biểu đồ trạng thái)**
\`\`\`plantuml
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
\`\`\`

**- Khởi động sạc (Biểu đồ trạng thái)**
\`\`\`plantuml
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
\`\`\`

**- Đặt chỗ trước (Biểu đồ trạng thái)**
\`\`\`plantuml
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
\`\`\`

**- Thanh toán (Biểu đồ trạng thái)**
\`\`\`plantuml
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
\`\`\`

---
`;

const startIndex = content.indexOf('Trong mục này, hệ thống xây dựng biểu đồ trạng thái');
const endIndex = content.indexOf('### 4.2.2 Xây dựng biểu đồ tuần tự');
if(startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newStateDiagrams + "\n" + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log("Success");
} else {
  console.log("Failed to find boundaries");
}
