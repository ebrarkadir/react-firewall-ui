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
    bandwidthLimit: "",
  });

  const [macError, setMacError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const fetchExistingRules = async () => {
    try {
      const response = await getQoSRules();
      const formatted = response.map((rule) => ({
        mark: rule.mark, // Silme işleminde kullanılıyor
        mac: rule.mac || "-",
        priority: rule.priority || "-",
        bandwidth: rule.classId || "-",
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
    setFormData({ macAddress: "", priority: "low", bandwidthLimit: "" });
  };

  const handleDeletePendingRule = (index) => {
    setPendingRules(pendingRules.filter((_, i) => i !== index));
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      const formattedRules = pendingRules.map((rule) => ({
        macAddress: rule.macAddress.toLowerCase(),
        priority: rule.priority,
        bandwidthLimit: rule.bandwidthLimit || "",
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
              <li>
                <strong>MAC Adresi:</strong> Trafik önceliği (QoS) tanımlanacak cihazın fiziksel adresi. <em>(Örnek: 00:1A:2B:3C:4D:5E)</em>
              </li>
              <li>
                <strong>Öncelik Seviyesi:</strong> Trafiğe düşük, orta veya yüksek öncelik verilebilir.
              </li>
              <li>
                <strong>Bant Genişliği:</strong> Cihazın veri aktarım hızını sınırlandırabilirsiniz.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Trafik Önceliklendirme (QoS)</h2>

      {/* FORM */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
            <label>Öncelik Seviyesi</label>
            <select
              className="form-select"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Bant Genişliği (Opsiyonel)</label>
            <select
              className="form-select"
              name="bandwidthLimit"
              value={formData.bandwidthLimit}
              onChange={handleInputChange}
            >
              <option value="">Seçiniz (Varsayılan)</option>
              <option value="512kbit">512 KB/s (≈4 Mbit)</option>
              <option value="1024kbit">1 MB/s (≈8 Mbit)</option>
              <option value="2048kbit">2 MB/s (≈16 Mbit)</option>
              <option value="4096kbit">4 MB/s (≈32 Mbit)</option>
              <option value="8192kbit">8 MB/s (≈64 Mbit)</option>
              <option value="10240kbit">10 MB/s (≈80 Mbit)</option>
            </select>
          </div>
        </div>
        {requiredError && <small className="text-danger mt-2">{requiredError}</small>}
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
            {pendingRules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {rule.macAddress}, Öncelik: {rule.priority}, {rule.bandwidthLimit || "Varsayılan Bant"}
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
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  MAC: {rule.mac} | Öncelik: {rule.priority} | Sınıf: {rule.bandwidth}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteSentRule(rule.mark)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Firewall'da aktif QoS kuralı yok.</p>
        )}
      </div>
    </div>
  );
};

export default QoSRules;
