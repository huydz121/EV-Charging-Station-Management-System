BỘ GIÁO DỤC VÀ ĐÀO TẠO
TRƯỜNG ĐẠI HỌC QUY NHƠN
170 An Dương Vương, TP. Quy Nhơn, Bình Định
Điện thoại: 02563 846 156 Fax: 02563 846 089 Web: www.qnu.edu.vn
Trách nhiệm - Chuyên nghiệp - Chất lượng - Sáng tạo - Nhân văn

---

# BÁO CÁO BÀI TẬP NHÓM
## HỆ THỐNG QUẢN LÝ TRẠM SẠC XE ĐIỆN
**(Học phần: Phân tích thiết kế hệ thống thông tin)**

**GVHP:** Nguyễn Thị Tuyết
**Lớp:** [Nhập tên lớp của bạn, VD: Kỹ thuật phần mềm 46]
**Nhóm:** [Nhập tên nhóm của bạn]
**Thành viên nhóm:**
1. [Họ và tên thành viên 1] - MSV: [MSV]
2. [Họ và tên thành viên 2] - MSV: [MSV]
3. [Họ và tên thành viên 3] - MSV: [MSV]
4. [Họ và tên thành viên 4] - MSV: [MSV]

**BÌNH ĐỊNH, 2025**

---

# BÀI 1: XÁC ĐỊNH YÊU CẦU

## 1. MÔ TẢ HỆ THỐNG

**Bản mô tả tổng quan hệ thống:**
Hệ thống Quản lý Trạm Sạc Xe Điện là một giải pháp công nghệ toàn diện chạy trên nền tảng web (Web Application) được xây dựng nhằm mục đích cung cấp dịch vụ sạc điện cho các phương tiện giao thông chạy bằng điện và hỗ trợ doanh nghiệp vận hành quản lý mạng lưới hạ tầng trạm sạc. Về mặt vật lý mô phỏng, hệ thống quản lý một mạng lưới phân tán gồm nhiều trạm sạc đặt tại các vị trí địa lý khác nhau (được số hóa bằng tọa độ GPS GeoJSON). Mỗi trạm sạc lại chứa bên trong nhiều trụ sạc (connector), mỗi trụ sạc được cấu hình chi tiết về loại đầu cắm (như Type 1, Type 2, CCS, CHAdeMO, Tesla) và có mức công suất hỗ trợ khác nhau (từ 7kW cho sạc chậm đến 150kW cho sạc siêu tốc). 

Hệ thống được thiết kế hướng tới sự tự động hóa cao trong giao dịch thông qua việc tích hợp ví điện tử nội bộ cho mỗi người dùng, liên kết trực tiếp với cổng thanh toán mã QR quốc gia (VietQR) qua đối tác PayOS. Khách hàng sử dụng điện thoại thông minh mở bản đồ định vị trên ứng dụng để tìm trạm sạc gần nhất, xem tình trạng các súng sạc đang rảnh hay bận, sau đó di chuyển đến trạm, cắm sạc và bắt đầu phiên sạc. Toàn bộ thông số của phiên sạc như dòng điện, lượng kWh tiêu thụ, % pin và số tiền bị trừ được hệ thống tính toán và hiển thị theo thời gian thực (real-time). Về phía đơn vị cung cấp dịch vụ, hệ thống cung cấp một phân hệ quản trị (Admin Dashboard) mạnh mẽ để kiểm soát doanh thu, thiết lập giá bán điện theo giờ, bảo trì thiết bị và quản lý khách hàng. 

### 1.1. Nghiệp vụ: Công việc chi tiết hệ thống sẽ làm

Dưới đây là văn bản mô tả chi tiết toàn bộ các nghiệp vụ mà hệ thống phần mềm sẽ thực thi:

**A. Nhóm nghiệp vụ Quản lý tài khoản và Xác thực (Authentication):**
*   **Nghiệp vụ Đăng ký và bảo mật:** Khách hàng mới truy cập hệ thống bắt buộc phải đăng ký tài khoản. Hệ thống yêu cầu cung cấp Họ tên, Email, Số điện thoại và Mật khẩu. Tại đây, hệ thống sẽ tự động thực thi các kiểm tra bảo mật: mật khẩu phải đạt chuẩn (có chữ hoa, ký tự đặc biệt). Để chống tài khoản ảo, hệ thống tự động sinh một mã OTP 6 chữ số ngẫu nhiên, giới hạn thời gian sống là 5 phút và gửi qua máy chủ email (SMTP) đến hộp thư của người dùng. Tài khoản chỉ được cấp quyền hoạt động (Active) khi người dùng nhập đúng mã OTP này. Mật khẩu được mã hóa một chiều (Bcrypt hashing) trước khi lưu trữ vào cơ sở dữ liệu để chống đánh cắp.
*   **Nghiệp vụ Đăng nhập và Phân quyền:** Người dùng nhập Email và Mật khẩu. Hệ thống đối chiếu dữ liệu mã hóa, nếu hợp lệ sẽ khởi tạo một phiên làm việc (Session) được lưu trữ phía máy chủ trong 7 ngày. Dựa vào vai trò (Role), hệ thống tự động điều hướng: Khách hàng sẽ được đưa vào giao diện tìm trạm sạc, trong khi Quản trị viên sẽ được chuyển thẳng vào Bảng điều khiển quản lý.
*   **Nghiệp vụ Khôi phục mật khẩu:** Khi người dùng quên mật khẩu, hệ thống cho phép nhập Email, sau đó tự động gửi một mã OTP khôi phục. Vượt qua bước OTP, người dùng được phép tạo mật khẩu mới.

**B. Nhóm nghiệp vụ dành cho Khách hàng (Customer Experience):**
*   **Nghiệp vụ Bản đồ và Tìm kiếm trạm sạc:** Hệ thống tải dữ liệu toàn bộ các trạm sạc có trạng thái "đang hoạt động" và vẽ chúng lên bản đồ số (Leaflet.js/OpenStreetMap). Khách hàng có thể cho phép hệ thống truy cập GPS của thiết bị để tìm các trạm sạc trong bán kính 5km. Khách hàng cũng có thể gõ tên đường hoặc tên trạm vào thanh tìm kiếm, hệ thống sẽ dùng thuật toán Regex để lọc kết quả. Khi bấm vào một trạm, hệ thống truy xuất và hiển thị danh sách các súng sạc hiện có tại trạm đó và trạng thái thực tại của chúng (đang rảnh, đang có người sạc, hay đang hỏng).
*   **Nghiệp vụ Đặt chỗ trước (Reservation):** Nếu khách hàng sợ đến nơi mất chỗ, hệ thống cho phép chọn một súng sạc cụ thể và đặt giờ hẹn trước. Hệ thống sẽ ghi nhận lịch hẹn và giữ chỗ súng sạc đó. Khách cũng có quyền hủy lịch hẹn này nếu đổi ý.
*   **Nghiệp vụ Xử lý Phiên sạc xe (Charging Session):** Đây là nghiệp vụ cốt lõi. Khi khách hàng bấm "Bắt đầu sạc", hệ thống thực hiện nghiệp vụ kiểm tra tài chính khắt khe: ví của khách phải có số dư tối thiểu là 200.000 VNĐ. Nếu đủ điều kiện, hệ thống lập tức khóa súng sạc đó lại (chuyển trạng thái sang in_use) để không ai khác được dùng, đồng thời khởi tạo một Phiên sạc mới. 
*   **Nghiệp vụ Tính toán thời gian thực (Polling & Simulation):** Trong quá trình sạc, cứ mỗi 2 giây, giao diện khách hàng sẽ yêu cầu hệ thống cập nhật số liệu. Hệ thống sẽ tính toán công suất sạc sạc (kW), lượng điện năng đã bơm vào xe (kWh) và tính nhẩm ra số tiền tạm tính dựa vào bảng giá điện của trạm đó. Tỷ lệ phần trăm pin xe cũng được hệ thống tính toán tiến trình tăng dần. 
*   **Nghiệp vụ Chốt hóa đơn và Trừ tiền:** Khi đạt mức giới hạn điện năng thiết lập trước, hoặc khách hàng chủ động bấm "Dừng sạc", hệ thống sẽ kết thúc phiên sạc, chốt con số tổng điện năng (kWh) nhân với đơn giá để ra tổng số tiền phải trả. Hệ thống tự động truy xuất ví điện tử của khách, trừ đi số tiền tương ứng, lưu lại biên lai giao dịch và mở khóa súng sạc (chuyển về available) để người khác sử dụng.
*   **Nghiệp vụ Giao dịch tài chính & Ví điện tử:** Khách hàng không dùng tiền mặt mà dùng Ví hệ thống. Để nạp tiền (tối thiểu 10.000đ), khách hàng nhập số tiền, hệ thống sẽ kết nối với API của PayOS sinh ra một mã QR động (VietQR) chứa sẵn số tiền và nội dung chuyển khoản. Khách dùng App ngân hàng quét mã để chuyển khoản. 
*   **Nghiệp vụ Lắng nghe thanh toán tự động (Webhook):** Hệ thống luôn mở một cổng kết nối bảo mật (Webhook). Khi có người chuyển khoản thành công vào tài khoản công ty, PayOS sẽ bắn tín hiệu số dư về hệ thống. Hệ thống dùng thuật toán mã hóa HMAC để kiểm tra chữ ký điện tử xem có đúng là tiền đã vào không. Nếu đúng, hệ thống tự động cộng số dư vào ví của khách hàng đó ngay lập tức mà không cần nhân viên xác nhận.
*   **Nghiệp vụ Quản lý Hồ sơ và Lịch sử:** Hệ thống cung cấp nơi để khách lưu trữ và tra cứu lại toàn bộ các hóa đơn sạc xe trong quá khứ (có phân trang) và xem danh sách các lần nạp/trừ tiền trong ví.

**C. Nhóm nghiệp vụ dành cho Quản trị viên (Admin Management):**
*   **Nghiệp vụ Thống kê và Báo cáo (Dashboard):** Hệ thống liên tục thu thập dữ liệu và tổng hợp thành các chỉ số KPI: Tổng số trạm, tổng khách hàng, tổng phiên sạc, số trạm đang lỗi và tổng doanh thu toàn hệ thống. Kèm theo đó là việc vẽ các biểu đồ trực quan (Biểu đồ doanh thu theo tuần, theo tháng, theo năm) để ban giám đốc nắm bắt tình hình kinh doanh.
*   **Nghiệp vụ Quản lý Hạ tầng (Trạm sạc & Trụ sạc):** Hệ thống cung cấp công cụ để Admin thêm các trạm sạc mới vào mạng lưới. Khi thêm, Admin phải khai báo tọa độ địa lý, thiết lập đơn giá điện riêng cho trạm đó, và phải định nghĩa trạm đó có bao nhiêu súng sạc, loại súng gì, công suất bao nhiêu. Admin có toàn quyền chỉnh sửa thông tin hoặc xóa trạm.
*   **Nghiệp vụ Quản lý Người dùng:** Hệ thống liệt kê toàn bộ khách hàng. Admin có quyền khóa tài khoản (khách hàng sẽ bị văng ra và không thể đăng nhập) nếu phát hiện gian lận, hoặc xóa vĩnh viễn tài khoản.
*   **Nghiệp vụ Cấu hình Chính sách giá điện (Price Rates):** Hệ thống cho phép Admin cài đặt các mức giá điện khác nhau dựa theo khung giờ (Ví dụ: giá ban đêm rẻ hơn ban ngày). Admin tạo các mốc thời gian bắt đầu và kết thúc kèm theo đơn giá tương ứng.
*   **Nghiệp vụ Quản lý Bảo trì (Maintenance):** Khi có súng sạc bị hỏng, Admin tạo một phiếu bảo trì trên hệ thống, phân công cho kỹ thuật viên. Lúc này, hệ thống tự động gỡ trạm sạc đó khỏi bản đồ của khách hàng (chuyển sang trạng thái bảo trì). Khi sửa xong, Admin cập nhật trạng thái phiếu thành "Hoàn thành", hệ thống tự động mở trạm sạc hoạt động lại bình thường.
*   **Nghiệp vụ Xử lý Khiếu nại và Hoàn tiền (Refund):** Trong trường hợp lỗi phần mềm trừ sai tiền, Admin có thể tra cứu mã phiên sạc đó, nhập số tiền cần hoàn và lý do. Hệ thống sẽ tự động bơm lại tiền vào ví của khách hàng và ghi chú giao dịch "Hoàn tiền".
*   **Nghiệp vụ Báo cáo Kế toán chuyên sâu:** Hệ thống hỗ trợ Admin lọc doanh thu theo khoảng thời gian tùy chọn (từ ngày... đến ngày...). Hệ thống sẽ kết xuất ra danh sách các hóa đơn, đồng thời phân tích chỉ ra Top 5 trạm sạc mang lại doanh thu cao nhất cho công ty.
*   **Nghiệp vụ Thông báo theo thời gian thực:** Hệ thống ghi nhận lại mọi thao tác quan trọng của Admin (như thêm, sửa trạm) vào bộ nhớ tạm toàn cục và hiển thị thông báo dưới dạng chuông báo để các Admin khác cùng hệ thống có thể nắm bắt luồng công việc.

### 1.2. Thiết bị sử dụng

Hệ thống được thiết kế theo kiến trúc Client - Server, yêu cầu sự tham gia của các thiết bị phần cứng sau để có thể vận hành toàn diện:

| STT | Tên thiết bị / Hạ tầng | Đối tượng sử dụng | Mô tả chức năng & Vai trò trong hệ thống |
|:---:|:---|:---|:---|
| 1 | **Điện thoại thông minh (Smartphone)** | Khách hàng | Chạy các trình duyệt web di động (Chrome, Safari, Edge). Yêu cầu thiết bị có tính năng định vị GPS để hệ thống lấy tọa độ tìm trạm sạc gần nhất. Dùng ứng dụng Mobile Banking của ngân hàng trên thiết bị này để quét mã QR nạp tiền. |
| 2 | **Máy tính cá nhân (Laptop / PC)** | Quản trị viên | Thiết bị màn hình lớn dùng để truy cập vào phân hệ Admin Dashboard. Hỗ trợ hiển thị trực quan các bảng biểu thống kê lớn, đồ thị doanh thu, thực hiện các nghiệp vụ quản lý dữ liệu phức tạp. |
| 3 | **Máy tính bảng (Tablet)** | Khách hàng / Admin | Thiết bị màn hình vừa, có thể dùng thay thế điện thoại hoặc máy tính để truy cập hệ thống ở chế độ di động. |
| 4 | **Máy chủ Ứng dụng (Cloud Server)** | Hệ thống cốt lõi | Một máy chủ đám mây ảo hóa (VPS - Virtual Private Server) chạy hệ điều hành Ubuntu Linux, cài đặt môi trường Node.js v22+ và trình quản lý tiến trình PM2. Làm nhiệm vụ tiếp nhận yêu cầu, xử lý mọi logic nghiệp vụ, tính toán tiền bạc và phản hồi về cho trình duyệt. |
| 5 | **Cụm Máy chủ Cơ sở dữ liệu** | Hệ thống cốt lõi | Dịch vụ cơ sở dữ liệu đám mây (MongoDB Atlas) được cấu hình theo dạng cụm máy chủ (Replica Set) để lưu trữ an toàn toàn bộ dữ liệu về người dùng, lịch sử sạc, trạng thái súng sạc, thông tin ví điện tử. |
| 6 | **Máy chủ SMTP (Email Server)** | Hệ thống phụ trợ | Máy chủ của Google (Gmail) được hệ thống kết nối qua cổng bảo mật 465 SSL. Đóng vai trò là thiết bị gửi các email chứa mã OTP xác thực và khôi phục mật khẩu đến hòm thư người dùng. |
| 7 | **Hệ thống Cổng thanh toán (PayOS)** | Tác nhân bên ngoài | Máy chủ của bên thứ 3, đóng vai trò kết nối với Ngân hàng Nhà nước (Napas) để xử lý việc chuyển tiền liên ngân hàng và sinh mã QR VietQR. |

### 1.3. Đối tượng sử dụng hệ thống: Tác nhân (Actors)

Hệ thống được xây dựng phục vụ 3 nhóm tác nhân chính, mỗi nhóm có ranh giới quyền hạn và mục đích sử dụng khác biệt biệt hoàn toàn:

*   **Tác nhân 1: Khách hàng (Customer)**
    *   **Bản chất:** Là những cá nhân sở hữu xe ô tô điện hoặc xe máy điện có nhu cầu tìm kiếm nguồn điện để sạc cho phương tiện của mình khi đang di chuyển ngoài đường.
    *   **Tương tác:** Khách hàng là nguồn mang lại doanh thu cho hệ thống. Tác nhân này bắt buộc phải cung cấp thông tin cá nhân để mở tài khoản, nạp tiền mặt vào ví hệ thống và đổi lấy dịch vụ sạc điện.
    *   **Quyền hạn:** Khách hàng bị giới hạn nghiêm ngặt ở phân hệ `/customer`. Middleware bảo mật của hệ thống đảm bảo tác nhân này chỉ được phép xem thông tin cá nhân của chính mình, lịch sử của chính mình và danh sách các trạm sạc công khai. Tuyệt đối không thể can thiệp vào giá cả hay xem thông tin của người khác.

*   **Tác nhân 2: Quản trị viên (Admin)**
    *   **Bản chất:** Là các nhân viên, kế toán, kỹ thuật viên hoặc cấp quản lý thuộc công ty cung cấp dịch vụ mạng lưới trạm sạc.
    *   **Tương tác:** Sử dụng hệ thống như một công cụ làm việc hàng ngày để giám sát tình trạng vật lý của các trạm, giải quyết sự cố, tra cứu đối soát doanh thu tài chính.
    *   **Quyền hạn:** Có quyền lực cao nhất trong hệ thống phần mềm (truy cập phân hệ `/admin`). Tác nhân này có thể thêm bớt dữ liệu, can thiệp vào tài khoản khách hàng, thay đổi biểu giá kinh doanh theo chiến lược công ty. Được bảo vệ bởi Middleware kiểm tra Role là `admin`.

*   **Tác nhân 3: Hệ thống Cổng thanh toán (PayOS) / Ngân hàng**
    *   **Bản chất:** Là một thực thể hệ thống phần mềm độc lập bên ngoài, không phải con người. 
    *   **Tương tác:** Tác nhân này đóng vai trò như một người thu ngân kỹ thuật số. Khi ngân hàng nhận được tiền của khách chuyển, tác nhân PayOS sẽ chủ động "gõ cửa" hệ thống của chúng ta (gọi vào đường dẫn Webhook POST) để gửi thông điệp báo cáo: *"Mã giao dịch X đã nhận đủ tiền"*.
    *   **Quyền hạn:** Tác nhân này chỉ được phép truy cập duy nhất vào đường dẫn Webhook dành riêng cho nó. Tác nhân này chứng minh danh tính bằng một bộ mã hóa khóa bí mật (HMAC Signature), nếu đúng chữ ký hệ thống mới cấp phép cho giao dịch đi qua.

## 2. PHẠM VI CỦA HỆ THỐNG

Việc xác định phạm vi hệ thống giúp làm rõ những ranh giới phần mềm sẽ thực thi và những gì nằm ngoài khả năng xử lý của phiên bản này:

**2.1. Nằm TRONG phạm vi của hệ thống:**
*   **Vòng đời người dùng:** Bao quát toàn bộ luồng quản lý người dùng từ khâu tiếp nhận đăng ký, xác thực danh tính qua Email OTP, quản lý phiên đăng nhập và bảo mật thông tin cá nhân, phân quyền truy cập.
*   **Vòng đời trạm sạc:** Số hóa thông tin trạm sạc với dữ liệu không gian (tọa độ GPS), quản lý cấu trúc cây phân cấp (1 Trạm sạc chứa nhiều Súng sạc), cho phép tìm kiếm và định vị theo khoảng cách vật lý (thuật toán không gian $near).
*   **Vòng đời phiên sạc:** Quản lý trọn vẹn tiến trình sạc từ việc đặt chỗ, bắt đầu cắm sạc, mô phỏng toán học sự gia tăng điện năng và dung lượng pin theo thời gian thực (polling cơ sở dữ liệu liên tục), đến việc ngắt sạc tự động và kết xuất hóa đơn chi phí.
*   **Vòng đời tài chính:** Vận hành hệ thống ví điện tử khép kín (nạp tiền qua QR, tự động cộng tiền khi nhận Webhook, tự động trừ tiền khi sạc xong, xử lý hoàn tiền sự cố) và kết xuất các báo cáo tài chính doanh thu, biểu đồ phân tích kinh doanh.
*   **Vòng đời bảo trì:** Theo dõi báo cáo sự cố, chuyển đổi trạng thái thiết bị và quản lý tiến độ sửa chữa thiết bị.

**2.2. Nằm NGOÀI phạm vi của hệ thống:**
*   **Giao tiếp phần cứng IoT:** Hệ thống này là một phần mềm quản lý cấp cao, **KHÔNG** giao tiếp trực tiếp với các vi mạch điện tử hay rơ-le phần cứng bên trong trụ sạc thực tế ngoài đời. Trong phiên bản này, nó không sử dụng giao thức OCPP (Open Charge Point Protocol) để truyền lệnh đóng/cắt điện xuống trụ sạc vật lý, mà việc sạc đang được mô phỏng hoàn toàn bằng thuật toán cơ sở dữ liệu.
*   **Tích hợp Kế toán Quốc gia:** Hệ thống thực hiện tính toán tài chính và ra biên lai nội bộ nhưng **KHÔNG** trực tiếp xuất hóa đơn giá trị gia tăng (VAT) điện tử liên kết với hệ thống của Tổng cục Thuế Việt Nam, cũng như chưa kết nối API với các phần mềm kế toán chuyên dụng (như MISA, FAST).
*   **Nền tảng Native Mobile:** Hệ thống được thiết kế theo dạng giao diện Web đáp ứng (Responsive Web Design) thân thiện với điện thoại di động, nhưng **KHÔNG** phải là một ứng dụng di động độc lập (Native App) có thể tải xuống và cài đặt từ Apple App Store hay Google Play Store.
*   **Quản lý Camera an ninh:** Hệ thống tập trung vào việc sạc và thu tiền, **KHÔNG** tích hợp luồng video (stream) từ các camera an ninh lắp đặt tại trạm sạc để giám sát bãi đỗ xe trực tiếp trên giao diện phần mềm. 
