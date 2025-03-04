import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

const TrafficRules = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    sourceIP: "",
    destinationIP: "",
    protocol: "TCP",
    portRange: "",
    action: "allow",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    setRules([...rules, formData]);
    setFormData({
      sourceIP: "",
      destinationIP: "",
      protocol: "TCP",
      portRange: "",
      action: "allow",
    });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmitToFirewall = async () => {
    try {
      const response = await fetch("http://openwrt-ip/api/firewall/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rules }),
      });

      if (response.ok) {
        alert("Kurallar başarıyla gönderildi!");
      } else {
        alert("Kurallar gönderilirken bir hata oluştu.");
      }
    } catch (error) {
      alert("Bağlantı hatası: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      {/* Bilgilendirme Accordion */}
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "green", fontWeight: "bold" }}>
              Trafik Yönetimi Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Kaynak IP:</strong> Ağdaki bir cihazın IP adresidir.
                Örneğin, bir bilgisayardan veya cihazdan gelen trafiği
                sınırlamak istiyorsanız, o cihazın IP adresini buraya
                girersiniz.
                <em>(Örnek: 192.168.1.10)</em>
                <br />
                <small className="text-muted">
                  Not: IP adresinizi bilmiyorsanız,{" "}
                  <strong>kullanıcı dökümantasyonumuza</strong> bakabilir,
                  internet sağlayıcınızla iletişime geçebilir ya da modem
                  üreticinizden yardım alabilirsiniz.
                </small>
              </li>
              <li>
                <strong>Hedef IP:</strong> Trafiğin ulaşacağı IP adresidir.
                Örneğin, bir web sitesine (Google gibi) erişimi kontrol etmek
                istiyorsanız, bu IP adresini belirtmelisiniz.
                <em>(Örnek: 8.8.8.8)</em>
              </li>
              <li>
                <strong>Protokoller:</strong>
                <ul>
                  <li>
                    <strong>TCP:</strong> Web tarayıcıları ve uygulamalar gibi
                    güvenilir veri aktarımı gerektiren bağlantılarda kullanılır.
                  </li>
                  <li>
                    <strong>UDP:</strong> Ses ve video gibi düşük gecikme
                    gerektiren veri aktarımı için kullanılır.
                  </li>
                  <li>
                    <strong>ICMP:</strong> Ping ve ağ teşhis araçları için
                    kullanılır.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Port Aralığı:</strong> Hangi hizmetlerin veya
                uygulamaların kontrol edileceğini belirlemek için kullanılır.
                Örneğin, web sitelerine erişim için 80 ve 443 portları, e-posta
                hizmetleri için 25 portu kullanılır.
                <em>(Örnek: 80-443)</em>
              </li>
              <li>
                <strong>Kural Türü:</strong>
                <ul>
                  <li>
                    <strong>İzin Ver:</strong> Belirtilen trafiğin geçmesine
                    izin verir. (Örneğin, belirli bir cihaza internet erişimi
                    sağlamak.)
                  </li>
                  <li>
                    <strong>Engelle:</strong> Belirtilen trafiğin geçişini
                    durdurur. (Örneğin, belirli bir IP'ye erişimi yasaklamak.)
                  </li>
                </ul>
              </li>
              <li>
                <strong>Firewall'un Amacı:</strong> Firewall, ağınızı izinsiz
                erişimlerden ve potansiyel tehditlerden korur. Bu kuralları
                oluşturmak, güvenlik seviyenizi artırırken ağ trafiğinizi
                düzenlemenize yardımcı olur.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 className="text-success">Trafik Yönetimi</h2>
      <p>
        Trafik yönlendirme, bir ağda veri paketlerinin doğru cihazlara
        iletilmesini sağlar. Ağ performansını optimize etmek, belirli trafiği
        önceliklendirmek veya güvenlik için belirli trafiği engellemek amacıyla
        kullanılır. Örneğin, bir cihazdan sadece belirli bir sunucuya erişim
        izni vermek gibi.
      </p>
      <p>
        <strong>Neden Kullanılır?</strong>ağ performansını artırmak, belirli
        trafiği önceliklendirmek ve güvenliği sağlamak için kullanılır. Örneğin,
        kritik uygulamalara öncelik tanımak veya istenmeyen trafiği engellemek
        amacıyla uygulanır.
      </p>

      {/* Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Kaynak IP</label>
            <input
              type="text"
              className="form-control"
              name="sourceIP"
              value={formData.sourceIP}
              onChange={handleInputChange}
              placeholder="Ör: 192.168.1.10"
            />
          </div>
          <div className="col-md-4">
            <label>Hedef IP</label>
            <input
              type="text"
              className="form-control"
              name="destinationIP"
              value={formData.destinationIP}
              onChange={handleInputChange}
              placeholder="Ör: 8.8.8.8"
            />
          </div>
          <div className="col-md-4">
            <label>Protokol</label>
            <select
              className="form-select"
              name="protocol"
              value={formData.protocol}
              onChange={handleInputChange}
            >
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="ICMP">ICMP</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Port Aralığı</label>
            <input
              type="text"
              className="form-control"
              name="portRange"
              value={formData.portRange}
              onChange={handleInputChange}
              placeholder="Ör: 80-443"
            />
          </div>
          <div className="col-md-4">
            <label>Kural Türü</label>
            <select
              className="form-select"
              name="action"
              value={formData.action}
              onChange={handleInputChange}
            >
              <option value="allow">İzin Ver</option>
              <option value="deny">Engelle</option>
            </select>
          </div>
        </div>
        <button className="btn btn-success mt-3" onClick={handleAddRule}>
          Kural Ekle
        </button>
      </div>

      {/* Kurallar Listesi */}
      <div className="card p-4 shadow-sm">
        <h5>Eklenen Kurallar</h5>
        {rules.length > 0 ? (
          <ul className="list-group">
            {rules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {rule.sourceIP} → {rule.destinationIP} ({rule.protocol},{" "}
                  {rule.portRange}) -{" "}
                  {rule.action === "allow" ? "İzin Ver" : "Engelle"}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteRule(index)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz bir kural eklenmedi.</p>
        )}
      </div>

      {/* Firewall'a Gönder */}
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-success" onClick={handleSubmitToFirewall}>
          Firewall'a Gönder
        </button>
      </div>
    </div>
  );
};

export default TrafficRules;
