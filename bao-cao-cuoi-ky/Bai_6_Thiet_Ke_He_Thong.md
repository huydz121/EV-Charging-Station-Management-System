# BÀI 6: THIẾT KẾ HỆ THỐNG

---

Dựa trên các yêu cầu phân tích hệ thống, chương này tập trung thiết kế kiến trúc phần mềm và hạ tầng triển khai vật lý của hệ thống Quản lý Trạm sạc Xe điện thông qua Biểu đồ thành phần (Component Diagram) và Biểu đồ triển khai (Deployment Diagram) chi tiết.

---

## 6.1. BIỂU ĐỒ THÀNH PHẦN (COMPONENT DIAGRAM)

Biểu đồ thành phần mô tả cấu trúc vật lý của các mô-đun phần mềm (tài liệu giao diện, logic backend, các module nhúng và cơ sở dữ liệu) và mối quan hệ phụ thuộc giữa chúng:

![Biểu đồ thành phần](./component_diagram.png)

```plantuml
@startuml Component_Diagram_EV
skinparam backgroundColor white
skinparam linetype ortho
skinparam package {
  BackgroundColor #F8F9FA
  BorderColor #343A40
}
skinparam component {
  BackgroundColor #FFFFFF
  BorderColor #495057
}

package "Passenger Mobile Device" as mobilePkg {
  component "map_view.js" <<document>>
  component "reservation_client.js" <<document>>
  component "charging_monitor.js" <<document>>
  component "payment_client.js" <<document>>
  component "auth_helper.js" <<document>>
}

package "Admin Workstation" as adminPkg {
  component "dashboard_view.js" <<document>>
  component "station_manager.js" <<document>>
  component "incident_handler.js" <<document>>
  component "pricing_config.js" <<document>>
}

package "Cloud Backend" as backendPkg {
  component "api_gateway.js" <<executable>>
  component "auth_service.js" <<executable>>
  component "reservation_service.js" <<executable>>
  component "session_manager.js" <<executable>>
  component "payment_handler.js" <<executable>>
  component "mqtt_dispatcher.js" <<executable>>
}

package "Database Connector" as dbConnectorPkg {
  component "db_pool_connector.js" <<library>>
  component "user_model.js" <<library>>
  component "station_model.js" <<library>>
  component "session_model.js" <<library>>
}

package "Cloud Database Server" as dbServerPkg {
  component "users_table.sql" <<database>>
  component "stations_table.sql" <<database>>
  component "sessions_table.sql" <<database>>
  component "payments_table.sql" <<database>>
}

package "IoT Smart Charger Firmware" as iotPkg {
  component "wifi_manager.cpp" <<executable>>
  component "mqtt_client.cpp" <<executable>>
  component "relay_controller.cpp" <<executable>>
  component "energy_sensor.cpp" <<executable>>
}

package "External Payment Gateway" as payosPkg {
  component "payos_sdk.js" <<library>>
}

mobilePkg ..> backendPkg : "HTTP / HTTPS"
adminPkg ..> backendPkg : "HTTP / HTTPS"
backendPkg ..> payosPkg : "API Calls"
backendPkg ..> dbConnectorPkg : "gọi hàm"
dbConnectorPkg ..> dbServerPkg : "truy vấn SQL"
backendPkg ..> iotPkg : "lệnh MQTT"
@enduml
```

---

## 6.2. BIỂU ĐỒ TRIỂN KHAI (DEPLOYMENT DIAGRAM)

Biểu đồ triển khai mô tả cấu trúc phân bổ các thành phần phần mềm lên các thiết bị phần cứng vật lý và các giao thức truyền thông kết nối giữa chúng:

![Biểu đồ triển khai](./deployment_diagram.png)

```plantuml
@startuml Deployment_Diagram_EV
skinparam backgroundColor white
skinparam linetype ortho
skinparam node {
  BackgroundColor #F8F9FA
  BorderColor #343A40
}
skinparam component {
  BackgroundColor #FFFFFF
  BorderColor #495057
}

node "User Mobile" <<Device>> as mobile {
  component "map_view.js" <<document>>
  component "reservation_client.js" <<document>>
  component "charging_monitor.js" <<document>>
  component "payment_client.js" <<document>>
  component "auth_helper.js" <<document>>
}

node "Admin PC" <<Device>> as pc {
  component "dashboard_view.js" <<document>>
  component "station_manager.js" <<document>>
  component "incident_handler.js" <<document>>
  component "pricing_config.js" <<document>>
}

node "Cloud VPS" <<Processor>> as server {
  component "api_gateway.js" <<executable>>
  component "auth_service.js" <<executable>>
  component "reservation_service.js" <<executable>>
  component "session_manager.js" <<executable>>
  component "payment_handler.js" <<executable>>
  component "mqtt_dispatcher.js" <<executable>>
  component "payos_sdk.js" <<library>>
  component "db_pool_connector.js" <<library>>
}

node "Database Server" <<Processor>> as dbServer {
  component "users_table.sql" <<database>>
  component "stations_table.sql" <<database>>
  component "sessions_table.sql" <<database>>
  component "payments_table.sql" <<database>>
}

node "Charging Station" <<Device>> as station {
  node "Microcontroller" <<Processor>> as mcu {
    component "wifi_manager.cpp" <<executable>>
    component "mqtt_client.cpp" <<executable>>
    component "relay_controller.cpp" <<executable>>
    component "energy_sensor.cpp" <<executable>>
  }
}

mobile -- server : "HTTPS (Port 443)"
pc -- server : "HTTPS (Port 443)"
server -- dbServer : "TCP/IP (Port 3306)"
server -- mcu : "MQTT (Port 1883)"
@enduml
```
