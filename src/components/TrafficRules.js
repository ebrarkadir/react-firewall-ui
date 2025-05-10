import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import {
  sendFirewallRules,
  getFirewallRules,
  deleteFirewallRule,
} from "../api";

const TrafficRules = () => {
  const [pendingRules, setPendingRules] = useState([]);
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    sourceIP: "",
    destinationIP: "",
    protocol: "TCP",
    portRange: "",
    action: "allow",
  });

  const [error, setError] = useState("");

  const fetchExistingRules = async () => {
    try {
      const response = await getFirewallRules();
      setRules(response);
    } catch (err) {
      console.error("Kurallar alınamadı:", err.message);
    }
  };

  useEffect(() => {
    fetchExistingRules();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    const ipRegex =
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

    if (
      !ipRegex.test(formData.sourceIP) ||
      !ipRegex.test(formData.destinationIP)
    ) {
      setError("Geçerli bir IP adresi girin. CIDR desteklenmektedir.");
      return;
    }

    if (
      !ipRegex.test(formData.sourceIP) ||
      !ipRegex.test(formData.destinationIP)
    ) {
      setError("Geçerli bir IP adresi girin.");
      return;
    }

    setError("");
    setPendingRules([...pendingRules, formData]);
    setFormData({
      sourceIP: "",
      destinationIP: "",
      protocol: "TCP",
      portRange: "",
      action: "allow",
    });
  };

  const handleDeletePendingRule = (index) => {
    const updated = pendingRules.filter((_, i) => i !== index);
    setPendingRules(updated);
  };

  const handleDeleteSentRule = async (uciKey) => {
    try {
      await deleteFirewallRule(uciKey);
      setTimeout(() => {
        fetchExistingRules(); // Yeniden listele
      }, 1500);
      alert("Kural başarıyla silindi!");
    } catch (err) {
      alert("Kural silinemedi: " + err.message);
    }
  };

  const handleSubmitToFirewall = async () => {
    try {
      const normalizedRules = pendingRules.map((rule) => ({
        ...rule,
        protocol: rule.protocol.toLowerCase(),
        action: rule.action.toLowerCase(),
      }));

      await sendFirewallRules(normalizedRules);
      setPendingRules([]);
      setTimeout(() => {
        fetchExistingRules(); // Yeni kuralları göster
      }, 1500);
      alert("Kurallar başarıyla gönderildi!");
    } catch (err) {
      alert("Gönderme hatası: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              Trafik Yönetimi Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Eklemek istediğiniz kuralları oluşturun. Ardından 'Firewall'a
              Gönder' butonuna basarak kuralları OpenWRT cihazına aktarın.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Trafik Yönetimi</h2>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
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
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#D84040", color: "white" }}
          onClick={handleAddRule}
        >
          Kuralı Ekle
        </button>
      </div>

      {/* PENDING RULES */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 style={{ color: "#D84040" }}>🚧 Eklenecek Kurallar</h5>
        {pendingRules.length > 0 ? (
          <ul className="list-group">
            {pendingRules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {rule.sourceIP} → {rule.destinationIP} ({rule.protocol},{" "}
                  {rule.portRange}) -{" "}
                  {rule.action === "allow" ? "İzin Ver" : "Engelle"}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeletePendingRule(index)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz eklemeye hazır bir kural yok.</p>
        )}
        {pendingRules.length > 0 && (
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn"
              style={{ backgroundColor: "#D84040", color: "white" }}
              onClick={handleSubmitToFirewall}
            >
              Firewall'a Gönder
            </button>
          </div>
        )}
      </div>

      {/* EXISTING RULES */}
      <div className="card p-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>🔥 Eklenen (Aktif) Kurallar</h5>
        {rules.length > 0 ? (
          <ul className="list-group">
            {rules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {rule.src_ip} → {rule.dest_ip} ({rule.proto}, {rule.dest_port}
                  ) - {rule.target === "ACCEPT" ? "İzin Ver" : "Engelle"} [
                  {rule.dest}]
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
          <p>OpenWRT üzerinde aktif trafik kuralı yok.</p>
        )}
      </div>
    </div>
  );
};

export default TrafficRules;
