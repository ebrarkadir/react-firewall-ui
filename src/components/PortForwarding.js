import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { sendPortForwardingRules } from "../api"; // 🔥 API entegrasyonu eklendi

const PortForwarding = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    sourceIP: "",
    destinationIP: "",
    protocol: "TCP",
    sourcePort: "",
    destinationPort: "",
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
            name === "destinationIP" ? "Hedef" : "Kaynak"
          } IP formatı hatalı! Örnek: 192.168.1.10`
        );
      } else {
        setIpError("");
      }
    }

    // Port numarası doğrulama
    if (name === "sourcePort" || name === "destinationPort") {
      const portRegex = /^[0-9]{1,5}$/;

      if (!portRegex.test(value) || parseInt(value) > 65535) {
        setPortError("Port numarası 0-65535 arasında bir değer olmalıdır.");
      } else {
        setPortError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.destinationIP || !formData.sourcePort || !formData.destinationPort) {
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
      sourceIP: "",
      destinationIP: "",
      protocol: "TCP",
      sourcePort: "",
      destinationPort: "",
    });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendPortForwardingRules(rules); // 🔥 API çağrısı
      alert("Port yönlendirme kuralları başarıyla gönderildi!");
    } catch (error) {
      alert("Kurallar gönderilirken bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      {/* Bilgilendirme Accordion */}
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "green", fontWeight: "bold" }}>
              Port Yönlendirme Kullanım
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Kaynak IP (Opsiyonel):</strong> Trafiğin hangi IP
                adresinden geleceğini belirtir. Belirtilmezse tüm dış IP'ler
                kabul edilir.
                <em>(Örnek: 192.168.1.10)</em>
              </li>
              <li>
                <strong>Hedef IP (Zorunlu):</strong> Trafiğin yönlendirileceği ağ
                içindeki cihazın IP adresi.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 className="text-success">Port Yönlendirme</h2>
      <p>Port yönlendirme, ağ dışından gelen bağlantıları belirli cihazlara yönlendirir.</p>

      {/* Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Kaynak IP (Opsiyonel)</label>
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
              placeholder="Ör: 192.168.1.20"
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
            </select>
          </div>
          <div className="col-md-4">
            <label>Kaynak Port</label>
            <input
              type="text"
              className="form-control"
              name="sourcePort"
              value={formData.sourcePort}
              onChange={handleInputChange}
              placeholder="Ör: 80"
            />
          </div>
          <div className="col-md-4">
            <label>Hedef Port</label>
            <input
              type="text"
              className="form-control"
              name="destinationPort"
              value={formData.destinationPort}
              onChange={handleInputChange}
              placeholder="Ör: 8080"
            />
          </div>
        </div>
        {requiredError && <small className="text-danger mt-2">{requiredError}</small>}
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
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {rule.sourceIP || "Tüm IP'ler"}:{rule.sourcePort} →{" "}
                  {rule.destinationIP}:{rule.destinationPort} ({rule.protocol})
                </span>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRule(index)}>
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

export default PortForwarding;
