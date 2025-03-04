import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

const VPNRules = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    ruleType: "vpn",
    sourceIP: "",
    destinationIP: "",
    protocol: "TCP",
    portRange: "",
  });

  const [ipError, setIpError] = useState("");
  const [portError, setPortError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // IP adresi doğrulama
    if (name === "sourceIP" || name === "destinationIP") {
      const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

      if (!ipRegex.test(value) && value !== "") {
        setIpError(
          `${
            name === "sourceIP" ? "Kaynak" : "Hedef"
          } IP formatı hatalı! Örnek: 192.168.1.10`
        );
      } else {
        setIpError("");
      }
    }

    // Port numarası doğrulama
    if (name === "portRange") {
      const portRegex = /^[0-9]+(-[0-9]+)?$/;

      if (!portRegex.test(value) && value !== "") {
        setPortError("Port aralığı hatalı! Örnek: 80 veya 8000-8080");
      } else {
        setPortError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    // Zorunlu alan kontrolü
    if (!formData.sourceIP || !formData.destinationIP) {
      setRequiredError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    if (ipError || portError) {
      alert("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setRules([...rules, formData]);
    setFormData({
      ruleType: "vpn",
      sourceIP: "",
      destinationIP: "",
      protocol: "TCP",
      portRange: "",
    });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      const response = await fetch("http://openwrt-ip/api/vpn-nat/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rules }),
      });

      if (response.ok) {
        alert("VPN ve NAT kuralları başarıyla gönderildi!");
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
              VPN ve NAT Kuralları Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Kaynak IP:</strong> VPN veya NAT için trafik başlatan
                cihazın IP adresi.
                <em>(Örnek: 192.168.1.10)</em>
              </li>
              <li>
                <strong>Hedef IP:</strong> Trafiğin yönlendirileceği veya erişim
                sağlanacağı IP adresi.
                <em>(Örnek: 8.8.8.8)</em>
              </li>
              <li>
                <strong>Protokol:</strong> TCP, UDP gibi ağ protokolleri. VPN
                için genellikle UDP kullanılır.
              </li>
              <li>
                <strong>Port Aralığı:</strong> Yönlendirme yapılacak veya izin
                verilecek portlar.
                <em>(Örnek: 1194 veya 8000-8080)</em>
              </li>
              <li>
                <strong>VPN:</strong> İnternet trafiğinizi şifreli bir tünel
                üzerinden yönlendirerek güvenlik ve gizlilik sağlar.
              </li>
              <li>
                <strong>NAT:</strong> İç ağdaki cihazların tek bir genel IP
                adresi üzerinden internete erişmesini veya dışarıdan
                erişilebilir olmasını sağlar.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 className="text-success">VPN ve NAT Kuralları</h2>
      <p>
        VPN ve NAT Kuralları, ağ trafiğini yönlendirmek, güvenli bağlantılar
        sağlamak ve cihazların internet erişimini düzenlemek için kullanılan
        yapılandırmalardır. VPN kuralları güvenli ve şifreli bağlantılar
        oluştururken, NAT kuralları cihazların dış dünyayla iletişim kurmasını
        veya dışarıdan erişilmesini sağlar.
      </p>
      <p>
        <strong>Neden Kullanılır? </strong>ağ güvenliğini artırmak, cihazların
        internete erişimini düzenlemek, uzaktan güvenli bağlantılar oluşturmak
        ve iç ağ cihazlarının dış dünyayla iletişimini sağlamak için kullanılır.
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
            {ipError && <small className="text-danger">{ipError}</small>}
          </div>
          <div className="col-md-4">
            <label>Hedef IP </label>
            <input
              type="text"
              className="form-control"
              name="destinationIP"
              value={formData.destinationIP}
              onChange={handleInputChange}
              placeholder="Ör: 8.8.8.8"
            />
            {ipError && <small className="text-danger">{ipError}</small>}
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
            </select>
          </div>
          <div className="col-md-4">
            <label>Port Aralığı (Opsiyonel)</label>
            <input
              type="text"
              className="form-control"
              name="portRange"
              value={formData.portRange}
              onChange={handleInputChange}
              placeholder="Ör: 1194 veya 8000-8080"
            />
            {portError && <small className="text-danger">{portError}</small>}
          </div>
          <div className="col-md-4">
            <label>Kural Türü</label>
            <select
              className="form-select"
              name="ruleType"
              value={formData.ruleType}
              onChange={handleInputChange}
            >
              <option value="vpn">VPN</option>
              <option value="nat">NAT</option>
            </select>
          </div>
        </div>
        {requiredError && (
          <small className="text-danger mt-2">{requiredError}</small>
        )}
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
                  {rule.portRange || "Tüm Portlar"}) -{" "}
                  {rule.ruleType === "vpn" ? "VPN" : "NAT"}
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

      {/* OpenWRT'ye Gönder */}
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-success" onClick={handleSubmitToOpenWRT}>
          Firewall'a Gönder
        </button>
      </div>
    </div>
  );
};

export default VPNRules;
