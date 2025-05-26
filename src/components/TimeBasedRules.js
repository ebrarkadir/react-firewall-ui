import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import {
  sendTimeBasedRules,
  getTimeBasedRules,
  deleteTimeBasedRule,
} from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TimeBasedRules = () => {
  const [pendingRules, setPendingRules] = useState([]);
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    protocol: "TCP",
    portRange: "",
    action: "allow",
  });

  const [portError, setPortError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const fetchExistingRules = async () => {
    try {
      const response = await getTimeBasedRules();
      setRules([...response]); // 👈 React'in yeniden render etmesi için yeni array oluştur
    } catch (err) {
      console.error("Kurallar alınamadı:", err.message);
    }
  };

  useEffect(() => {
    fetchExistingRules();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "portRange") {
      const portRegex = /^[0-9]{1,5}(-[0-9]{1,5})?$/;
      if (
        !portRegex.test(value) ||
        value.split("-").some((p) => parseInt(p) > 65535)
      ) {
        setPortError("Port numarası 0-65535 arasında olmalıdır.");
      } else {
        setPortError("");
      }
    }

    if (["startTime", "endTime"].includes(name)) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(value)) {
        setTimeError("Zaman formatı HH:MM şeklinde olmalı.");
      } else {
        setTimeError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.startTime || !formData.endTime || !formData.portRange) {
      setRequiredError("Tüm zorunlu alanları doldurun.");
      return;
    }

    if (portError || timeError) {
      toast.error("Formda hata var!");
      return;
    }

    setPendingRules([...pendingRules, formData]);
    setFormData({
      startTime: "",
      endTime: "",
      protocol: "TCP",
      portRange: "",
      action: "allow",
    });
    setRequiredError("");
  };

  const handleDeletePendingRule = (index) => {
    setPendingRules(pendingRules.filter((_, i) => i !== index));
  };

  const handleDeleteSentRule = async (uciKey) => {
    try {
      const response = await deleteTimeBasedRule(uciKey);
      if (response.success) {
        toast.success("✅ Kural başarıyla silindi.");
        setTimeout(() => fetchExistingRules(), 500); // 👈 hafif gecikmeli fetch
      } else {
        toast.error("❌ Silinemedi!");
      }
    } catch (err) {
      toast.error("🔥 Silme hatası: " + err.message);
    }
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendTimeBasedRules(pendingRules);
      setPendingRules([]);
      setTimeout(() => fetchExistingRules(), 500); // 👈 hafif gecikmeli fetch
      toast.success("🚀 Zaman bazlı kurallar gönderildi!");
    } catch (err) {
      toast.error("🔥 Gönderme hatası: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              Zaman Bazlı Kurallar Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Başlangıç Saati:</strong> Kuralın aktif olmaya
                başlayacağı saat. (Örnek: <code>08:00</code>)
              </li>
              <li>
                <strong>Bitiş Saati:</strong> Kuralın devre dışı olacağı saat.
                (Örnek: <code>18:00</code>)
              </li>
              <li>
                <strong>Protokol:</strong> Etkilenecek trafik türü:{" "}
                <strong>TCP</strong> veya <strong>UDP</strong>.
              </li>
              <li>
                <strong>Port Aralığı:</strong> Belirli bir port veya port
                aralığı. (Örnek: <code>80</code> ya da <code>0-65535</code>)
              </li>
              <li>
                <strong>Kural Türü:</strong> Trafiğe <strong>izin ver</strong>{" "}
                veya <strong>engelle</strong> işlemi uygulanır.
              </li>
            </ul>
            <p className="mt-2">
              Bu kurallar, günün belirli saatlerinde belirli portlar veya
              protokoller için erişimi <strong>sınırlamak</strong> ya da{" "}
              <strong>izin vermek</strong> amacıyla tanımlanır. Özellikle çocuk
              denetimi veya belirli saatlerdeki trafik kontrolü için uygundur.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Port-Zaman Kuralları</h2>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Başlangıç Saati</label>
            <input
              type="text"
              className="form-control"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              placeholder="08:00"
            />
          </div>
          <div className="col-md-4">
            <label>Bitiş Saati</label>
            <input
              type="text"
              className="form-control"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              placeholder="18:00"
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
            <label>Port Aralığı</label>
            <input
              type="text"
              className="form-control"
              name="portRange"
              value={formData.portRange}
              onChange={handleInputChange}
              placeholder="80-100"
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
        {(portError || timeError || requiredError) && (
          <small className="text-danger mt-2">
            {portError || timeError || requiredError}
          </small>
        )}
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
            {pendingRules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {rule.startTime} - {rule.endTime}, {rule.protocol} Port:{" "}
                  {rule.portRange} -{" "}
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
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {rule.start_time} - {rule.stop_time}, {rule.proto} Port:{" "}
                  {rule.dest_port} -{" "}
                  {rule.target === "ACCEPT" ? "İzin Ver" : "Engelle"} [
                  {rule.name?.includes("wan") ? "WAN" : "LAN"}]
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
          <p>Firewall'da aktif zaman bazlı kural yok.</p>
        )}
      </div>
    </div>
  );
};

export default TimeBasedRules;
