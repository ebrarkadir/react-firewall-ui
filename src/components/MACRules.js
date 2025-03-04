import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

const MACRules = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    macAddress: "",
    action: "allow",
    startTime: "",
    endTime: "",
  });

  const [macError, setMacError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // MAC adresi doğrulama
    if (name === "macAddress") {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

      if (!macRegex.test(value) && value !== "") {
        setMacError("Geçerli bir MAC adresi giriniz. Örnek: 00:1A:2B:3C:4D:5E");
      } else {
        setMacError("");
      }
    }

    // Zaman doğrulama
    if (name === "startTime" || name === "endTime") {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

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
    if (!formData.macAddress) {
      setRequiredError("Lütfen bir MAC adresi girin.");
      return;
    }

    if (macError || timeError) {
      alert("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setRules([...rules, formData]);
    setFormData({
      macAddress: "",
      action: "allow",
      startTime: "",
      endTime: "",
    });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      const response = await fetch("http://openwrt-ip/api/macrouting/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rules }),
      });

      if (response.ok) {
        alert("MAC adresi bazlı kurallar başarıyla gönderildi!");
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
              MAC Adresi Bazlı Kurallar Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>MAC Adresi:</strong> Kontrol etmek istediğiniz cihazın fiziksel adresidir.
                <em>(Örnek: 00:1A:2B:3C:4D:5E)</em>
              </li>
              <li>
                <strong>Zaman Bazlı Kurallar:</strong> Cihazın belirli saatler arasında ağa erişimini kontrol edebilirsiniz.
              </li>
              <li>
                <strong>Kural Türü:</strong> Belirli bir cihaza erişim izni verme veya engelleme işlemi yapılabilir.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 className="text-success">MAC Adresi Bazlı Kurallar</h2>
      <p>
        MAC Adresi Kuralları, ağ üzerindeki cihazların fiziksel adreslerine (MAC adreslerine) göre erişim kontrolü sağlar.
        Belirli cihazlara ağ erişimi izni verme, engelleme veya zaman bazlı erişim kısıtlaması işlemleri yapılabilir.
      </p>

      {/* Form */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label>MAC Adresi </label>
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
                  {rule.macAddress}, {rule.startTime || "Tüm Saatler"} -{" "}
                  {rule.endTime || "Tüm Saatler"} - {rule.action === "allow" ? "İzin Ver" : "Engelle"}
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

export default MACRules;
