import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

const TimeBasedRules = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Port aralığı doğrulama
    if (name === "portRange") {
      const portRegex = /^[0-9]{1,5}(-[0-9]{1,5})?$/;

      if (
        !portRegex.test(value) ||
        value.split("-").some((p) => parseInt(p) > 65535)
      ) {
        setPortError(
          "Port numarası 0-65535 arasında olmalıdır. Örnek: 80-100 veya 443"
        );
      } else {
        setPortError("");
      }
    }

    // Zaman doğrulama
    if (name === "startTime" || name === "endTime") {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 24 saat formatı

      if (!timeRegex.test(value)) {
        setTimeError("Zaman formatı HH:MM şeklinde olmalıdır. Örnek: 08:00");
      } else {
        setTimeError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    // Zorunlu alanların kontrolü
    if (!formData.startTime || !formData.endTime || !formData.portRange) {
      setRequiredError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    if (portError || timeError) {
      alert("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setRules([...rules, formData]);
    setFormData({
      startTime: "",
      endTime: "",
      protocol: "TCP",
      portRange: "",
      action: "allow",
    });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      const response = await fetch("http://openwrt-ip/api/timebased/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rules }),
      });

      if (response.ok) {
        alert("Port-Zaman kurallar başarıyla gönderildi!");
      } else {
        alert("Kurallar gönderilirken bir hata oluştu.");
      }
    } catch (error) {
      alert("Bağlantı hatası: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      {/* Bilgilendirme Accordion */}
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "green", fontWeight: "bold" }}>
              Port-Zaman Kuralları Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Başlangıç ve Bitiş Saatleri:</strong> Kuralın geçerli
                olacağı zaman dilimini belirtir.
                <em>(Örnek: 08:00 - 18:00)</em>
              </li>
              <li>
                <strong>Protokoller:</strong> TCP veya UDP gibi ağ
                protokollerini seçebilirsiniz.
              </li>
              <li>
                <strong>Port Aralığı:</strong> Hangi portlar için kural
                uygulanacağını belirtir.
                <em>(Örnek: 80-100 veya 443)</em>
              </li>
              <li>
                <strong>Kural Türü:</strong> Trafiğe izin verme veya engelleme
                işlemini belirler.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 className="text-success">Port-Zaman Kurallar</h2>
      <p>
        Zaman Bazlı Kurallar, belirli saat aralıklarında ağ trafiğini kontrol
        etmek için kullanılan kurallardır.
      </p>
      <p>
        <strong>Neden Kullanılır?</strong> ağ güvenliğini artırmak, belirli
        saatlerde erişimi kontrol etmek ve trafiği optimize etmek için
        kullanılır. Örneğin, mesai saatleri dışında belirli servisleri
        kısıtlamak.
      </p>

      {/* Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label>Başlangıç Saati </label>
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
            <label>Bitiş Saati</label>
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
            {portError && <small className="text-danger">{portError}</small>}
          </div>
          <div className="col-md-4">
            <label>Kural Türü </label>
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
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {rule.startTime} - {rule.endTime}, {rule.protocol} Port:{" "}
                  {rule.portRange} -{" "}
                  {rule.action === "allow" ? "İzin Ver" : "Engelle"}
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

      {/* OpenWRT'ye Gönder */}
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-success" onClick={handleSubmitToOpenWRT}>
          Firewall'a Gönder
        </button>
      </div>
    </div>
  );
};

export default TimeBasedRules;
