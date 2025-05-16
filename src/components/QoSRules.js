// QoSRules.jsx (Güncellenmiş versiyon - 3 sabit öncelik seviyesi)

import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import {
  sendQoSRules,
  getQoSRules,
  deleteQoSRule,
} from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QoSRules = () => {
  const [pendingRules, setPendingRules] = useState([]);
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    macAddress: "",
    priority: "low",
  });

  const [macError, setMacError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const fetchExistingRules = async () => {
    try {
      const response = await getQoSRules();

      const classIdToBandwidth = {
        "1:10": "Yüksek Öncelik (40 MB/s)",
        "1:20": "Orta Öncelik (30 MB/s)",
        "1:30": "Düşük Öncelik (10 MB/s)",
      };

      const formatted = response.map((rule) => ({
        uciKey: rule.mark,
        mac: rule.mac || "-",
        priority:
          rule.priority === "high"
            ? "Yüksek Öncelik"
            : rule.priority === "medium"
            ? "Orta Öncelik"
            : rule.priority === "low"
            ? "Düşük Öncelik"
            : "-",
        bandwidth: classIdToBandwidth[rule.classId] || "-",
      }));

      setRules([]);
      setTimeout(() => setRules(formatted), 0);
    } catch (err) {
      console.error("QoS kuralları alınamadı:", err.message);
    }
  };

  useEffect(() => {
    fetchExistingRules();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "macAddress") {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      if (!macRegex.test(value) && value !== "") {
        setMacError("Geçerli bir MAC adresi giriniz. Örnek: 00:1A:2B:3C:4D:5E");
      } else {
        setMacError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.macAddress) {
      setRequiredError("Lütfen bir MAC adresi girin.");
      return;
    }

    if (macError) {
      toast.error("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setPendingRules([...pendingRules, formData]);
    setFormData({ macAddress: "", priority: "low" });
  };

  const handleDeletePendingRule = (index) => {
    setPendingRules(pendingRules.filter((_, i) => i !== index));
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      const formattedRules = pendingRules.map((rule) => ({
        macAddress: rule.macAddress.toLowerCase(),
        priority: rule.priority,
      }));

      await sendQoSRules(formattedRules);
      setPendingRules([]);
      toast.success("🚀 QoS kuralları başarıyla gönderildi!");
      setTimeout(fetchExistingRules, 1000);
    } catch (error) {
      toast.error("🔥 Gönderme hatası: " + error.message);
    }
  };

  const handleDeleteSentRule = async (mark) => {
    try {
      const response = await deleteQoSRule(mark);
      if (response.success) {
        toast.success("✅ Kural silindi!");
        setTimeout(fetchExistingRules, 500);
      } else {
        toast.error("❌ Silinemedi!");
      }
    } catch (err) {
      toast.error("🔥 Silme hatası: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              Trafik Önceliklendirme (QoS) Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li><strong>MAC Adresi:</strong> Trafik önceliği tanımlanacak cihazın adresi.</li>
              <li><strong>Öncelik Seviyesi:</strong> Yüksek, orta veya düşük hızlı trafik.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Trafik Önceliklendirme (QoS)</h2>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label>MAC Adresi</label>
            <input
              type="text"
              className="form-control"
              name="macAddress"
              value={formData.macAddress}
              onChange={handleInputChange}
              placeholder="Ör: 00:1A:2B:3C:4D:5E"
            />
            {macError && <small className="text-danger">{macError}</small>}
          </div>
          <div className="col-md-6">
            <label>Öncelik Seviyesi</label>
            <select
              className="form-select"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="high">Yüksek Öncelik (40 MB/s)</option>
              <option value="medium">Orta Öncelik (30 MB/s)</option>
              <option value="low">Düşük Öncelik (10 MB/s)</option>
            </select>
          </div>
        </div>
        {requiredError && <small className="text-danger mt-2">{requiredError}</small>}
        <button className="btn mt-3" style={{ backgroundColor: "#D84040", color: "white" }} onClick={handleAddRule}>
          Kuralı Ekle
        </button>
      </div>

      <div className="card p-4 shadow-sm mb-4">
        <h5 style={{ color: "#D84040" }}>🚧 Eklenecek Kurallar</h5>
        {pendingRules.length > 0 ? (
          <ul className="list-group">
            {pendingRules.map((rule, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{rule.macAddress}, Öncelik: {rule.priority}</span>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeletePendingRule(index)}>Sil</button>
              </li>
            ))}
          </ul>
        ) : <p>Henüz eklemeye hazır bir kural yok.</p>}
        {pendingRules.length > 0 && (
          <div className="d-flex justify-content-end mt-3">
            <button className="btn" style={{ backgroundColor: "#D84040", color: "white" }} onClick={handleSubmitToOpenWRT}>
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
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                <span>MAC: {rule.mac} | Öncelik: {rule.priority} | Sınıf: {rule.bandwidth}</span>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSentRule(rule.uciKey)}>Sil</button>
              </li>
            ))}
          </ul>
        ) : <p>Firewall'da aktif QoS kuralı yok.</p>}
      </div>
    </div>
  );
};

export default QoSRules;
