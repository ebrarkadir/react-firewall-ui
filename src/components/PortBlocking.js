import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import {
  sendPortBlockingRules,
  getPortBlockingRules,
  deletePortBlockingRule,
} from "../api";

const PortBlocking = () => {
  const [pendingRules, setPendingRules] = useState([]);
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    portRange: "",
    protocol: "TCP",
  });
  const [portError, setPortError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const fetchExistingRules = async () => {
    try {
      const response = await getPortBlockingRules();
      setRules(response);
    } catch (err) {
      console.error("Port engelleme kuralları alınamadı:", err.message);
    }
  };

  useEffect(() => {
    fetchExistingRules();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "portRange") {
      const portRegex = /^\d{1,5}(:\d{1,5})?$/;
      if (!portRegex.test(value)) {
        setPortError(
          "Port aralığı 0-65535 arasında olmalı (örn: 80 veya 1000:2000)"
        );
      } else {
        setPortError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.portRange) {
      setRequiredError("Port aralığı zorunludur.");
      return;
    }
    if (portError) {
      alert("Hatalı alanlar var!");
      return;
    }
    setPendingRules([...pendingRules, formData]);
    setFormData({ portRange: "", protocol: "TCP" });
    setRequiredError("");
  };

  const handleDeletePendingRule = (index) => {
    setPendingRules(pendingRules.filter((_, i) => i !== index));
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendPortBlockingRules(pendingRules);
      setPendingRules([]);
      setTimeout(fetchExistingRules, 1000);
      alert("Port engelleme kuralları gönderildi!");
    } catch (error) {
      alert("Gönderme hatası: " + error.message);
    }
  };

  const handleDeleteSentRule = async (uciKey) => {
    console.log("🧨 Silme isteği gönderiliyor:", uciKey); // @rule[3]

    try {
      const response = await deletePortBlockingRule(uciKey);
      if (response.success) {
        alert("Silindi.");
        setTimeout(fetchExistingRules, 500);
      } else {
        alert("Silinemedi.");
      }
    } catch (err) {
      console.error("🔥 Hata:", err);
      alert("Silme hatası: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              Port Engelleme Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Belirli portlara gelen trafiği engellemek için kuralları
              tanımlayın.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Port Engelleme</h2>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label>Port Aralığı</label>
            <input
              type="text"
              className="form-control"
              name="portRange"
              value={formData.portRange}
              onChange={handleInputChange}
              placeholder="80 veya 1000:2000"
            />
          </div>
          <div className="col-md-6">
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
        </div>
        {requiredError && (
          <small className="text-danger">{requiredError}</small>
        )}
        {portError && <small className="text-danger">{portError}</small>}
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#D84040", color: "white" }}
          onClick={handleAddRule}
        >
          Kuralı Ekle
        </button>
      </div>

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
                  {rule.protocol}:{rule.portRange}
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
                  {rule.proto.toUpperCase()}:{rule.dest_port} [
                  {rule.src.toUpperCase()}]
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
          <p>Firewall'da aktif port engelleme kuralı yok.</p>
        )}
      </div>
    </div>
  );
};

export default PortBlocking;
