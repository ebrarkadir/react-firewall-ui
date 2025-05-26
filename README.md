[🔧 ShieldWrt API (Backend Sunucusu)](https://github.com/ebrarkadir/openwrt-firewall-api)

# 🖥️ ShieldWrt UI

🇹🇷 **ShieldWrt UI**, OpenWRT tabanlı bir firewall cihazını (örneğin Raspberry Pi) kullanıcı dostu bir web arayüzü ile yönetmenizi sağlar.  
Bu arayüz sayesinde ağ yöneticileri, teknik bilgiye gerek duymadan kolayca kural ekleyebilir, silebilir ve düzenleyebilir.

🇬🇧 **ShieldWrt UI** is a user-friendly web interface that allows you to manage an OpenWRT-based firewall device (such as a Raspberry Pi).  
It enables network administrators to add, delete, and edit rules without requiring technical knowledge.

---

## 🚀 Özellikler / Features

- 🇹🇷 7 farklı ağ kuralını destekler (aşağıda listelenmiştir)/🇬🇧 Supports 7 different network rule types (listed below)
- Gerçek zamanlı kural yönetimi/Real-time rule management
- Kullanıcı dostu bildirim sistemi/User-friendly notification system
- Mobil uyumlu responsive tasarım/Mobile-friendly responsive layout

---

## ⚙️ Kullanılan Teknolojiler / Technologies Used

- ⚛️ React
- 🧾 Bootstrap 5
- 🛰️ RESTful API (Node.js/Express tabanlı)
- 📦 React Toastify
- 🔁 Fetch API

---

## 📚 Desteklenen Kural Türleri / Supported Rule Types

| 🔢 | Kural Türü / Rule Type        | Açıklama (TR)                                                                 | Description (EN)                                                                 |
|----|-------------------------------|-------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| 1  | DNS Engelleme / DNS Blocking | Belirli alan adlarının çözümünü engeller                                     | Blocks DNS resolution of specified domains                                      |
| 2  | MAC Kuralları / MAC Rules    | Belirli cihazların erişimini MAC adresine göre sınırlar veya izin verir      | Allows or denies access to specific devices by MAC address                      |
| 3  | Trafik Önceliği / QoS        | Cihazlara trafik önceliği atar (Yüksek, Orta, Düşük)                          | Assigns bandwidth priority to devices (High, Medium, Low)                       |
| 4  | Port Yönlendirme / Forwarding| Dış portlardan gelen trafiği iç ağa yönlendirir                               | Forwards external traffic to internal network ports                             |
| 5  | Port Engelleme / Blocking    | Belirli portlara veya protokollere erişimi kısıtlar                           | Restricts access to certain ports or protocols                                  |
| 6  | Zaman Bazlı Kurallar         | Belirli saatlerde veya günlerde kural uygulaması sağlar                      | Applies rules based on specific time schedules                                  |
| 7  | Genel Kurallar / Firewall    | Kaynak/hedef IP, port, protokol gibi gelişmiş ayarlarla trafik kontrolü sağlar| Enables advanced traffic control with protocol, IP and port-based definitions  |


---

## 👤 Geliştirici / Developer

**Ebrar Kadir Çetin**  
📧 [cetinebrarkadir@gmail.com](mailto:cetinebrarkadir@gmail.com)  
🔗 [GitHub](https://github.com/ebrarkadir)  
💻 [LinkedIn](https://www.linkedin.com/in/ebrar-kadir-%C3%A7etin-1a728019b)
