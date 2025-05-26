import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import {
  sendDNSBlockingRules,
  getDNSBlockingRules,
  deleteDNSBlockingRule,
} from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DNSEngines = () => {
  const [rules, setRules] = useState([]);
  const [activeRules, setActiveRules] = useState([]);
  const [formData, setFormData] = useState({ domainOrURL: "" });

  const [urlError, setUrlError] = useState("");
  const [requiredError, setRequiredError] = useState("");

  useEffect(() => {
    fetchActiveRules();
  }, []);

  const fetchActiveRules = async () => {
    try {
      const response = await getDNSBlockingRules();
      setActiveRules(response.rules || []);
    } catch (error) {
      toast.error("Aktif kurallar alınamadı: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "domainOrURL") {
      const urlRegex =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      if (!urlRegex.test(value)) {
        setUrlError("Geçerli bir URL veya alan adı giriniz. Örnek: google.com");
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
      toast.warning("Lütfen geçerli bir URL girin.");
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

  const handleDeleteActiveRule = async (domain) => {
    try {
      await deleteDNSBlockingRule(domain);
      toast.success(`'${domain}' kaldırıldı.`);
      setTimeout(() => {
        fetchActiveRules();
      }, 500);
    } catch (error) {
      toast.error("Silme hatası: " + error.message);
    }
  };

  const handleSubmitToOpenWRT = async () => {
    try {
      await sendDNSBlockingRules(rules);
      toast.success("DNS kuralları başarıyla gönderildi!");
      setRules([]);
      setTimeout(() => {
        fetchActiveRules();
      }, 500);
    } catch (error) {
      toast.error("Gönderme hatası: " + error.message);
    }
  };

  const deleteButtonStyle = {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "4px 12px",
    fontSize: "14px",
    transition: "background-color 0.2s",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const deleteButtonHoverStyle = {
    backgroundColor: "#b52a38",
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Accordion defaultActiveKey={null} className="mb-4">
        <Accordion.Item eventKey="5">
          <Accordion.Header>
            <span style={{ color: "#D84040", fontWeight: "bold" }}>
              URL / DNS Engelleme Kullanımı
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>URL veya Alan Adı:</strong> Erişimi engellenecek
                internet adresi. Örnekler: <code>facebook.com</code>,{" "}
                <code>youtube.com</code>
              </li>
            </ul>
            <p>
              Bu kurallar, girilen URL veya alan adlarına yapılan DNS
              sorgularını engeller. Böylece istemcilerin bu sitelere erişimi DNS
              düzeyinde kısıtlanır. Düşük maliyetli ve basit bir ağ filtreleme
              çözümü sağlar.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Kural Ekleme */}
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
              placeholder="Ör: google.com"
            />
            {urlError && <small className="text-danger">{urlError}</small>}
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

      {/* Eklenecek Kurallar */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">🛠️ Eklenecek Kurallar</h5>
        {rules.length > 0 ? (
          <ul className="list-group">
            {rules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{rule.domainOrURL}</span>
                <button
                  style={deleteButtonStyle}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      deleteButtonHoverStyle.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      deleteButtonStyle.backgroundColor)
                  }
                  onClick={() => handleDeleteRule(index)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Henüz kural eklenmedi.</p>
        )}
        {rules.length > 0 && (
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

      {/* Aktif Kurallar */}
      <div className="card p-4 shadow-sm">
        <h5 className="mb-3" style={{ color: "#D84040" }}>
          🔥 Eklenen (Aktif) Kurallar
        </h5>
        {activeRules.length > 0 ? (
          <ul className="list-group">
            {activeRules.map((rule, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{rule}</span>
                <button
                  style={deleteButtonStyle}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      deleteButtonHoverStyle.backgroundColor)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      deleteButtonStyle.backgroundColor)
                  }
                  onClick={() => handleDeleteActiveRule(rule)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aktif bir DNS kuralı bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default DNSEngines;
