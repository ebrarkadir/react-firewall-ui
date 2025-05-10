import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import {
  sendPortForwardingRules,
  getPortForwardingRules,
  deletePortForwardingRule,
} from "../api";

const PortForwarding = () => {
  const [pendingRules, setPendingRules] = useState([]);
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

  const fetchExistingRules = async () => {
    try {
      const response = await getPortForwardingRules();
      setRules(response);
    } catch (err) {
      console.error("Port yönlendirme kuralları alınamadı:", err.message);
    }
  };

  useEffect(() => {
    fetchExistingRules();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["sourceIP", "destinationIP"].includes(name)) {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$|^0\.0\.0\.0\/0$/;
      if (!ipRegex.test(value) && value !== "") {
        setIpError(
          `${name === "destinationIP" ? "Hedef" : "Kaynak"} IP formatı hatalı!`
        );
      } else {
        setIpError("");
      }
    }

    if (["sourcePort", "destinationPort"].includes(name)) {
      const portRegex = /^[0-9]{1,5}$/;
      if (!portRegex.test(value) || parseInt(value) > 65535) {
        setPortError("Port 0-65535 arasında olmalı.");
      } else {
        setPortError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (
      !formData.destinationIP ||
      !formData.sourcePort ||
      !formData.destinationPort
    ) {
      setRequiredError("Tüm zorunlu alanları doldurun.");
      return;
    }

    if (ipError || portError) {
      alert("Hatalı alanlar var!");
      return;
    }

    setPendingRules([...pendingRules, formData]);
    setFormData({
      sourceIP: "",
      destinationIP: "",
      protocol: "TCP",
      sourcePort: "",
      destinationPort: "",
    });
    setRequiredError("");
  };

  const handleDeletePendingRule = (index) => {
    setPendingRules(pendingRules.filter((_, i) => i !== index));
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendPortForwardingRules(pendingRules);
      setPendingRules([]);
      setTimeout(fetchExistingRules, 1000); // ✅ Güncelleme
      alert("Port yönlendirme kuralları gönderildi!");
    } catch (error) {
      alert("Gönderme hatası: " + error.message);
    }
  };
  
  const handleDeleteSentRule = async (uciKey) => {
    try {
      await deletePortForwardingRule(uciKey);
      setTimeout(fetchExistingRules, 1000); // ✅ Güncelleme
      alert("Kural silindi!");
    } catch (err) {
      alert("Silme hatası: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              Port Yönlendirme Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Dış ağdan gelen trafiği belirtilen cihaza yönlendirmek için
              kuralları tanımlayın.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Port Yönlendirme</h2>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Kaynak IP (Opsiyonel)</label>
            <input
              type="text"
              className="form-control"
              name="sourceIP"
              value={formData.sourceIP}
              onChange={handleInputChange}
              placeholder="192.168.1.10"
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
              placeholder="192.168.1.20"
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
              placeholder="80"
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
              placeholder="8080"
            />
          </div>
        </div>
        {requiredError && (
          <small className="text-danger">{requiredError}</small>
        )}
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#D84040", color: "white" }}
          onClick={handleAddRule}
        >
          Kuralı Ekle
        </button>
      </div>

      {/* PENDING */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 style={{ color: "#D84040" }}>🚧 Eklenecek Kurallar</h5>
        {pendingRules.length > 0 ? (
          <ul className="list-group">
            {pendingRules.map((rule, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {rule.sourceIP || "Tüm IP'ler"}:{rule.sourcePort} →{" "}
                  {rule.destinationIP}:{rule.destinationPort} ({rule.protocol})
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeletePendingRule(i)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz bekleyen kural yok.</p>
        )}
        {pendingRules.length > 0 && (
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn"
              style={{ backgroundColor: "#D84040", color: "white" }}
              onClick={handleSubmitToOpenWRT}
            >
              Firewall'a Gönder
            </button>
          </div>
        )}
      </div>

      {/* EXISTING */}
      <div className="card p-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>🔥 Eklenen (Aktif) Kurallar</h5>
        {rules.length > 0 ? (
          <ul className="list-group">
            {rules.map((rule, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {(rule.src_ip || "Tüm IP'ler") +
                    ":" +
                    (rule.src_dport || "-")}{" "}
                  → {rule.dest_ip}:{rule.dest_port} ({rule.proto}) [
                  {rule.name.includes("wan") ? "WAN" : "LAN"}]
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteSentRule(rule.uciKey)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Firewall'da aktif port yönlendirme kuralı yok.</p>
        )}
      </div>
    </div>
  );
};

export default PortForwarding;
