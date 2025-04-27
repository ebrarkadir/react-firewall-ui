import React, { useState } from "react";
import TrafficRules from "./components/TrafficRules";
import PortForwarding from "./components/PortForwarding";
import PortBlocking from "./components/PortBlocking";
import TimeBasedRules from "./components/TimeBasedRules";
import MACRules from "./components/MACRules";
import DNSEngines from "./components/DNSEngines";
import QoSRules from "./components/QoSRules";
import VPNRules from "./components/VPNRules";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Logo from "./assets/logo.png";

function App() {
  const [activeCategory, setActiveCategory] = useState("home");

  const renderContent = () => {
    switch (activeCategory) {
      case "home":
        return (
          <div className="container mt-4 text-center">
            <h2 className="display-4 fw-bold mb-3" style={{ color: '#4b4b4b' }}>
              Hoş Geldiniz!
            </h2>
            <p className="lead mb-5">
              <strong style={{color:"#D84040"}}>ShieldWRT</strong>, ağ güvenliğinizi sağlamak için
              kullanıcı dostu bir <em>OpenWRT tabanlı firewall</em> yönetim arayüzüdür.
              Güçlü özellikleri keşfedin ve internet trafiğinizi kontrol altına alın!
            </p>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {featureButtons.map(({ key, title, text }) => (
                <div
                  key={key}
                  className="col"
                  onClick={() => setActiveCategory(key)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm feature-card">
                    <div className="card-body">
                      <h5 className="card-title">{title}</h5>
                      <p className="card-text">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row mt-4 justify-content-center g-3">
              {extraFeatureButtons.map(({ key, title, text }) => (
                <div
                  key={key}
                  className="col-md-5"
                  onClick={() => setActiveCategory(key)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm feature-card">
                    <div className="card-body">
                      <h5 className="card-title">{title}</h5>
                      <p className="card-text">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "traffic": return <TrafficRules />;
      case "portForwarding": return <PortForwarding />;
      case "portBlocking": return <PortBlocking />;
      case "timeBased": return <TimeBasedRules />;
      case "macRules": return <MACRules />;
      case "dnsEngines": return <DNSEngines />;
      case "qosRules": return <QoSRules />;
      case "vpnRules": return <VPNRules />;
      default: return <p>Sayfa bulunamadı!</p>;
    }
  };

  const featureButtons = [
    { key: "traffic", title: "Trafik Yönetimi", text: "LAN'dan WAN'a veya WAN'dan LAN'a giden/gelen trafiği kontrol edin." },
    { key: "portForwarding", title: "Port Yönlendirme", text: "Belirli portları iç ağınızdaki cihazlara yönlendirin." },
    { key: "portBlocking", title: "Port Engelleme", text: "İstenmeyen portları kapatarak dış erişimleri engelleyin." },
    { key: "timeBased", title: "Port-Zaman Kuralları", text: "Belirli saat aralıklarında internet erişim ayarları tanımlayın." },
    { key: "macRules", title: "MAC Adresi Kuralları", text: "Belirli cihazların erişim izinlerini kontrol edin." },
    { key: "dnsEngines", title: "URL/DNS Engelleme", text: "Belirli web sitelerine veya alan adlarına erişimi kısıtlayın." },
  ];

  const extraFeatureButtons = [
    { key: "qosRules", title: "Trafik Önceliklendirme", text: "Belirli uygulamalar veya cihazlar için internet trafiğine öncelik verin." },
    { key: "vpnRules", title: "VPN ve NAT Kuralları", text: "VPN bağlantılarını yönetin ve NAT ayarlarını yapılandırın." },
  ];

  return (
    <div>
      <header
        className="text-center text-white py-4"
        style={{ backgroundColor: '#D84040', cursor: "pointer" }}
        onClick={() => setActiveCategory("home")}
      >
        <img
          src={Logo}
          alt="ShieldWRT Logo"
          style={{ width: "100px", height: "100px", marginBottom: "10px" }}
        />
        <h1 className="m-0" style={{ color: '#F8F2DE' }}>ShieldWRT</h1>
      </header>

      <nav className="bg-light py-3 shadow">
        <div className="container d-flex justify-content-center flex-wrap gap-2">
          {featureButtons.concat(extraFeatureButtons).map(({ key, title }) => (
            <button
              key={key}
              className="btn btn-sm"
              style={{ border: '1px solid #D84040', color: '#D84040', backgroundColor: 'transparent' }}
              onClick={() => setActiveCategory(key)}
            >
              {title}
            </button>
          ))}
        </div>
      </nav>

      <main className="container mt-4 p-4 bg-white rounded shadow">
        {renderContent()}
      </main>

      <footer className="text-center py-3 mt-4 bg-light">
        <p>&copy; ShieldWRT</p>
      </footer>
    </div>
  );
}

export default App;