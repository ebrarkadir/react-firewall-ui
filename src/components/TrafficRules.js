import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { sendFirewallRules } from "../api";

const TrafficRules = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    sourceIP: "",
    destinationIP: "",
    protocol: "TCP",
    portRange: "",
    action: "allow",
  });
  
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.sourceIP || !formData.destinationIP || !formData.portRange) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    setError("");
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
      await sendFirewallRules(rules);
      alert("Kurallar başarıyla gönderildi!");
    } catch (error) {
      alert("Kurallar gönderilirken bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "green", fontWeight: "bold" }}>
              Trafik Yönetimi Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <p>Burada trafik kurallarını belirleyebilirsiniz.</p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 className="text-success">Trafik Yönetimi</h2>

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
        {error && <small className="text-danger mt-2">{error}</small>}
        <button className="btn btn-success mt-3" onClick={handleAddRule}>
          Kural Ekle
        </button>
      </div>

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
                  {rule.sourceIP} → {rule.destinationIP} ({rule.protocol}, {rule.portRange}) - {rule.action === "allow" ? "İzin Ver" : "Engelle"}
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

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-success" onClick={handleSubmitToFirewall}>
          Firewall'a Gönder
        </button>
      </div>
    </div>
  );
};

export default TrafficRules;
