const API_BASE_URL = "http://localhost:5000"; // API adresi

// 🔥 1. Trafik Yönetimi - POST
export const sendFirewallRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/firewall/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 Firewall API Hatası:", error);
    throw error;
  }
};

// 🔍 1. Trafik Yönetimi - GET
export const getFirewallRules = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/firewall/rules`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 Firewall Kuralları GET Hatası:", error);
    throw error;
  }
};

// ❌ 1. Trafik Yönetimi - DELETE
export const deleteFirewallRule = async (uciKey) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/firewall/rules/${uciKey}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 Firewall DELETE Hatası:", error);
    throw error;
  }
};

// 🔥 2. Port Yönlendirme - POST
export const sendPortForwardingRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/portforwarding/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 Port Forwarding API Hatası:", error);
    throw error;
  }
};

// 🔍 2. Port Yönlendirme - GET
export const getPortForwardingRules = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/portforwarding/rules`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 Port Forwarding GET Hatası:", error);
    throw error;
  }
};

// ❌ 2. Port Yönlendirme - DELETE
export const deletePortForwardingRule = async (uciKey) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/portforwarding/rules/${uciKey}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 Port Forwarding DELETE Hatası:", error);
    throw error;
  }
};

// 🔥 3. Port Engelleme
export const sendPortBlockingRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/portblocking/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 Port Blocking API Hatası:", error);
    throw error;
  }
};

// 🔥 4. MAC Adresi Kuralları
export const sendMACRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/macrouting/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 MAC Rules API Hatası:", error);
    throw error;
  }
};

// 🔥 5. DNS Engelleme
export const sendDNSBlockingRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dnsblocking/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 DNS Blocking API Hatası:", error);
    throw error;
  }
};

// 🔥 6. QoS Kuralları
export const sendQoSRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qos/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 QoS API Hatası:", error);
    throw error;
  }
};

// 🔥 7. VPN/NAT Kuralları
export const sendVPNRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vpn-nat/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 VPN/NAT API Hatası:", error);
    throw error;
  }
};

// 🔥 8. Zaman Bazlı Kurallar
export const sendTimeBasedRules = async (rules) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/timebased/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rules }),
    });

    const textResponse = await response.text();
    if (!textResponse.trim()) {
      throw new Error("Boş yanıt döndü! API geçerli bir JSON vermedi.");
    }
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("🔥 Time-Based API Hatası:", error);
    throw error;
  }
};