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
import Logo from "./assets/logo.png"; // Logoyu içe aktarıyoruz

function App() {
  const [activeCategory, setActiveCategory] = useState("home");

  const renderContent = () => {
    switch (activeCategory) {
      case "home":
        return (
          <div className="container mt-4 text-center">
            {/* Hoş Geldiniz Bölümü */}
            <h2 className="display-4 fw-bold text-success mb-3">
              Hoş Geldiniz!
            </h2>
            <p className="lead mb-5">
              <strong>ShieldWRT</strong>, ağ güvenliğinizi sağlamak için 
              kullanıcı dostu bir <em>OpenWRT tabanlı firewall</em> yönetim arayüzüdür. 
              Güçlü özellikleri keşfedin ve internet trafiğinizi kontrol altına alın!
            </p>

            {/* Özellik Kartları */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <div
                className="col"
                onClick={() => setActiveCategory("traffic")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">Trafik Yönetimi</h5>
                    <p className="card-text">
                      LAN'dan WAN'a veya WAN'dan LAN'a giden/gelen trafiği kontrol edin.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col"
                onClick={() => setActiveCategory("portForwarding")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">Port Yönlendirme</h5>
                    <p className="card-text">
                      Belirli portları iç ağınızdaki cihazlara yönlendirin.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col"
                onClick={() => setActiveCategory("portBlocking")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">Port Engelleme</h5>
                    <p className="card-text">
                      İstenmeyen portları kapatarak dış erişimleri engelleyin.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col"
                onClick={() => setActiveCategory("timeBased")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">Port-Zaman Kurallar</h5>
                    <p className="card-text">
                      Belirli saat aralıklarında internet erişim ayarları tanımlayın.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col"
                onClick={() => setActiveCategory("macRules")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">MAC Adresi Kuralları</h5>
                    <p className="card-text">
                      Belirli cihazların erişim izinlerini kontrol edin.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col"
                onClick={() => setActiveCategory("dnsEngines")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">URL/DNS Engelleme</h5>
                    <p className="card-text">
                      Belirli web sitelerine veya alan adlarına erişimi kısıtlayın.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trafik Önceliklendirme ve VPN Kutucukları */}
            <div className="row mt-4 justify-content-center g-3">
              <div
                className="col-md-5"
                onClick={() => setActiveCategory("qosRules")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">Trafik Önceliklendirme</h5>
                    <p className="card-text">
                      Belirli uygulamalar veya cihazlar için internet trafiğine öncelik verin.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="col-md-5"
                onClick={() => setActiveCategory("vpnRules")}
                style={{ cursor: "pointer" }}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-success">VPN ve NAT Kuralları</h5>
                    <p className="card-text">
                      VPN bağlantılarını yönetin ve NAT ayarlarını yapılandırın.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "traffic":
        return <TrafficRules />;
      case "portForwarding":
        return <PortForwarding />;
      case "portBlocking":
        return <PortBlocking />;
      case "timeBased":
        return <TimeBasedRules />;
      case "macRules":
        return <MACRules />;
      case "dnsEngines":
        return <DNSEngines />;
      case "qosRules":
        return <QoSRules />;
      case "vpnRules":
        return <VPNRules />;
      default:
        return <p>Sayfa bulunamadı!</p>;
    }
  };

  return (
    <div>
      {/* Üst Başlık ve Logo */}
      <header
        className="text-center bg-success text-white py-4"
        style={{ cursor: "pointer" }}
        onClick={() => setActiveCategory("home")}
      >
        <img
          src={Logo}
          alt="SecureWRT Logo"
          style={{ width: "100px", height: "100px", marginBottom: "10px" }}
        />
        <h1 className="m-0">ShieldWRT</h1>
      </header>

      {/* Menü Alanı */}
      <nav className="bg-light py-3 shadow">
        <div className="container d-flex justify-content-center flex-wrap gap-2">
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("traffic")}>
            Trafik Yönetimi
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("portForwarding")}>
            Port Yönlendirme
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("portBlocking")}>
            Port Engelleme
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("timeBased")}>
            Port-Zaman Kuralları
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("macRules")}>
            MAC Adresi Kuralları
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("dnsEngines")}>
            URL/DNS Engelleme
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("qosRules")}>
            Trafik Önceliklendirme
          </button>
          <button className="btn btn-outline-success btn-sm" onClick={() => setActiveCategory("vpnRules")}>
            VPN ve NAT Kuralları
          </button>
        </div>
      </nav>

      {/* İçerik Alanı */}
      <main className="container mt-4 p-4 bg-white rounded shadow">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="text-center py-3 mt-4 bg-light">
        <p>&copy; ShieldWRT</p>
      </footer>
    </div>
  );
}

export default App;
