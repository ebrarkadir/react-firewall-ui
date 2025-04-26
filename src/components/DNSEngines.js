import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { sendDNSBlockingRules } from "../api";

const DNSEngines = () => {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({ domainOrURL: "" });

  const [urlError, setUrlError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "domainOrURL") {
      const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      if (!urlRegex.test(value)) {
        setUrlError("Geçerli bir URL veya alan adı giriniz. Örnek: google.com veya https://example.com");
      } else {
        setUrlError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAddRule = () => {
    if (!formData.domainOrURL) {
      setRequiredError("Lütfen bir alan adı veya URL girin.");
      return;
    }

    if (urlError) {
      alert("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setRequiredError("");
    setRules([...rules, formData]);
    setFormData({ domainOrURL: "" });
  };

  const handleDeleteRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendDNSBlockingRules(rules);
      alert("URL/DNS engelleme kuralları başarıyla gönderildi!");
    } catch (error) {
      alert("Bağlantı hatası: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              URL/DNS Engelleme Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>URL veya Alan Adı:</strong> Belirli bir siteye erişimi engellemek için tam URL veya alan adını girin. <em>(Örnek: google.com veya https://example.com)</em>
              </li>
              <li>
                <strong>Hedef:</strong> Belirtilen siteye veya alana ağ erişimi kısıtlanır.
              </li>
              <li>
                <strong>Kural Amacı:</strong> Zararlı siteleri, sosyal medya gibi istenmeyen platformları veya belirli servisleri engellemek.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <h2 style={{ color: "#D84040" }}>URL/DNS Engelleme</h2>
      <p>URL/DNS Engelleme, belirli web sitelerine veya alan adlarına erişimi durdurma işlemidir. Bu yöntem, istenmeyen içeriklere, zararlı sitelere veya belirli platformlara erişimi engellemek için kullanılır.</p>
      <p>
        <strong>Neden Kullanılır?</strong> Ağ güvenliğini artırmak, zararlı yazılımları engellemek, istenmeyen içeriklere erişimi kısıtlamak ve iş yerlerinde verimliliği artırmak için kullanılır.
      </p>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 style={{ color: "#D84040" }}>Kural Ekle</h5>
        <div className="row g-3">
          <div className="col-md-12">
            <label>URL veya Alan Adı</label>
            <input
              type="text"
              className="form-control"
              name="domainOrURL"
              value={formData.domainOrURL}
              onChange={handleInputChange}
              placeholder="Ör: google.com veya https://example.com"
            />
            {urlError && <small className="text-danger">{urlError}</small>}
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
                <span>{rule.domainOrURL}</span>
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

export default DNSEngines;
