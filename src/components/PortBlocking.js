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
    protocol: "TCP",
    portRange: "",
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
      const portRangeRegex = /^([0-9]{1,5})(-([0-9]{1,5}))?$/;
      if (
        !portRangeRegex.test(value) ||
        value.split("-").some((p) => parseInt(p) > 65535)
      ) {
        setPortError(
          "Port numarası 0-65535 arasında olmalıdır. Örnek: 80-100 veya 443"
        );
      } else {
        setPortError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.portRange) {
      setRequiredError("Lütfen port aralığını girin.");
      return;
    }

    if (portError) {
      alert("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setPendingRules([...pendingRules, formData]);
    setFormData({ protocol: "TCP", portRange: "" });
  };

  const handleDeletePendingRule = (index) => {
    const updated = pendingRules.filter((_, i) => i !== index);
    setPendingRules(updated);
  };

  const handleDeleteSentRule = async (uciKey) => {
    try {
      await deletePortBlockingRule(uciKey);
      setTimeout(fetchExistingRules, 1500); // 🔁 Güncelle
    } catch (err) {
      alert("Silme hatası: " + err.message);
    }
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendPortBlockingRules(pendingRules);
      setPendingRules([]);
      setTimeout(fetchExistingRules, 1500); // 🔁 Güncelleme gecikmeli
      alert("Port engelleme kuralları başarıyla gönderildi!");
    } catch (error) {
      alert("Kurallar gönderilirken bir hata oluştu: " + error.message);
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
            <ul>
              <li>
                <strong>Protokoller:</strong> Belirli bir protokol üzerinden gelen
                veya giden trafiği engelleyebilirsiniz.
              </li>
              <li>
                <strong>Port Aralığı:</strong> Engellenecek port numarası veya
                aralığı. <em>Örnek: 80-100 veya 443</em>
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Port Engelleme</h2>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
        <div className="row g-3">
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
            <label>Port Aralığı</label>
            <input
              type="text"
              className="form-control"
              name="portRange"
              value={formData.portRange}
              onChange={handleInputChange}
              placeholder="Ör: 80-100 veya 443"
            />
            {portError && (
              <small className="text-danger">{portError}</small>
            )}
          </div>
        </div>
        {requiredError && (
          <small className="text-danger mt-2">{requiredError}</small>
        )}
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#D84040", color: "white" }}
          onClick={handleAddRule}
        >
          Engelle
        </button>
      </div>

      {/* BEKLEYENLER */}
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
                  {rule.protocol} Port: {rule.portRange} - Engelle
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

      {/* AKTİF KURALLAR */}
      <div className="card p-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>🔥 Eklenen (Aktif) Kurallar</h5>
        {rules.length > 0 ? (
          <ul className="list-group">
            {rules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {rule.proto} Port: {rule.dest_port} - {rule.target === "REJECT" ? "Engelle" : "İzin Ver"}
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