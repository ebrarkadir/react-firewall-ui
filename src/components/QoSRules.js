import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { sendQoSRules } from "../api";

const QoSRules = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    macAddress: "",
    priority: "low",
    bandwidthLimit: "",
  });

  const [macError, setMacError] = useState("");
  const [bandwidthError, setBandwidthError] = useState("");
  const [requiredError, setRequiredError] = useState("");

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

    if (name === "bandwidthLimit") {
      const bandwidthRegex = /^[0-9]+$/;
      if (!bandwidthRegex.test(value) && value !== "") {
        setBandwidthError("Bant genişliği yalnızca sayı olmalıdır. Örnek: 100 (KB/s)");
      } else {
        setBandwidthError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.macAddress) {
      setRequiredError("Lütfen bir MAC adresi girin.");
      return;
    }

    if (macError || bandwidthError) {
      alert("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setRules([...rules, formData]);
    setFormData({ macAddress: "", priority: "low", bandwidthLimit: "" });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendQoSRules(rules);
      alert("Trafik önceliklendirme (QoS) kuralları başarıyla gönderildi!");
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
                <strong>Bant Genişliği:</strong> Cihazın veri aktarım hızını sınırlandırabilirsiniz. <em>(Örnek: 100 KB/s)</em>
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>Trafik Önceliklendirme (QoS)</h2>
      <p>Trafik Önceliklendirme (QoS), ağdaki kritik cihazlara veya uygulamalara öncelik tanıyarak ağ performansını artırır ve kaynakları verimli kullanmayı sağlar.</p>

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
            <input
              type="text"
              className="form-control"
              name="bandwidthLimit"
              value={formData.bandwidthLimit}
              onChange={handleInputChange}
              placeholder="Ör: 100 (KB/s)"
            />
            {bandwidthError && <small className="text-danger">{bandwidthError}</small>}
          </div>
        </div>
        {requiredError && <small className="text-danger mt-2">{requiredError}</small>}
        <button
          className="btn mt-3"
          style={{ backgroundColor: "#D84040", color: "white" }}
          onClick={handleAddRule}
        >
          Kural Ekle
        </button>
      </div>

      <div className="card p-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Eklenen Kurallar</h5>
        {rules.length > 0 ? (
          <ul className="list-group">
            {rules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {rule.macAddress}, Öncelik: {rule.priority === "low" ? "Düşük" : rule.priority === "medium" ? "Orta" : "Yüksek"}
                  , {rule.bandwidthLimit ? `Bant: ${rule.bandwidthLimit} KB/s` : "Bant Sınırı Yok"}
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

      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn"
          style={{ backgroundColor: "#D84040", color: "white" }}
          onClick={handleSubmitToOpenWRT}
        >
          Firewall'a Gönder
        </button>
      </div>
    </div>
  );
};

export default QoSRules;
