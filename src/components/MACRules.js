import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { sendMACRules, getMACRules, deleteMACRule } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MACRules = () => {
  const [rules, setRules] = useState([]);
  const [pendingRules, setPendingRules] = useState([]);
  const [formData, setFormData] = useState({
    macAddress: "",
    action: "allow",
    startTime: "",
    endTime: "",
  });

  const [macError, setMacError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const fetchExistingRules = async () => {
    try {
      const response = await getMACRules();
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

    if (name === "macAddress") {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      if (!macRegex.test(value) && value !== "") {
        setMacError("Geçerli bir MAC adresi giriniz. Örnek: 00:1A:2B:3C:4D:5E");
      } else {
        setMacError("");
      }
    }

    if (name === "startTime" || name === "endTime") {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(value) && value !== "") {
        setTimeError("Zaman formatı HH:MM şeklinde olmalıdır. Örnek: 08:00");
      } else {
        setTimeError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.macAddress) {
      setRequiredError("Lütfen bir MAC adresi girin.");
      return;
    }

    if (macError || timeError) {
      toast.error("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setPendingRules([...pendingRules, formData]);
    setFormData({
      macAddress: "",
      action: "allow",
      startTime: "",
      endTime: "",
    });
  };

  const handleDeletePendingRule = (index) => {
    setPendingRules(pendingRules.filter((_, i) => i !== index));
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendMACRules(pendingRules);
      setPendingRules([]);
      toast.success("🚀 MAC adresi kuralları gönderildi!");
      setTimeout(() => fetchExistingRules(), 500);
    } catch (error) {
      toast.error("🔥 Gönderme hatası: " + error.message);
    }
  };

  const handleDeleteSentRule = async (uciKey) => {
    try {
      const response = await deleteMACRule(uciKey);
      if (response.success) {
        toast.success("✅ Kural silindi");
        setTimeout(() => fetchExistingRules(), 500);
      } else {
        toast.error("❌ Silinemedi");
      }
    } catch (error) {
      toast.error("🔥 Silme hatası: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              MAC Adresi Bazlı Kurallar Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>MAC Adresi:</strong> Cihazın fiziksel adresi.{" "}
                <em>(Örnek: 00:1A:2B:3C:4D:5E)</em>
              </li>
              <li>
                <strong>Zaman Bazlı Kurallar:</strong> Belirli saatlerde ağa
                erişim kontrolü.
              </li>
              <li>
                <strong>Kural Türü:</strong> Erişim izni verme veya engelleme
                işlemleri.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>MAC Adresi Bazlı Kurallar</h2>

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
            <label>Başlangıç Saati (Opsiyonel)</label>
            <input
              type="text"
              className="form-control"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              placeholder="Ör: 08:00"
            />
            {timeError && <small className="text-danger">{timeError}</small>}
          </div>
          <div className="col-md-4">
            <label>Bitiş Saati (Opsiyonel)</label>
            <input
              type="text"
              className="form-control"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              placeholder="Ör: 18:00"
            />
            {timeError && <small className="text-danger">{timeError}</small>}
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
        {requiredError && (
          <small className="text-danger mt-2">{requiredError}</small>
        )}
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#D84040", color: "white" }}
          onClick={handleAddRule}
        >
          Kural Ekle
        </button>
      </div>

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
                  {rule.macAddress}, {rule.startTime || "Tüm Saatler"} -{" "}
                  {rule.endTime || "Tüm Saatler"} -{" "}
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
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {rule.src_mac}, {rule.start_time || "Tüm Saatler"} -{" "}
                  {rule.stop_time || "Tüm Saatler"} -{" "}
                  {rule.target === "ACCEPT" ? "İzin Ver" : "Engelle"} [
                  {rule.src === "wan" ? "WAN" : "LAN"}]
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
          <p>OpenWRT üzerinde aktif MAC kuralı yok.</p>
        )}
      </div>
    </div>
  );
};

export default MACRules;
