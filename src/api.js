const API_BASE_URL = "http://localhost:5000"; // API adresi

// 🔥 1. Trafik Yönetimi Kuralları
export const sendFirewallRules = async (rules) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/firewall/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules }),
        });
        return await response.json();
    } catch (error) {
        console.error("Firewall API Hatası:", error);
        throw error;
    }
};

// 🔥 2. Port Yönlendirme Kuralları
export const sendPortForwardingRules = async (rules) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/portforwarding/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules }),
        });
        return await response.json();
    } catch (error) {
        console.error("Port Forwarding API Hatası:", error);
        throw error;
    }
};

// 🔥 3. Port Engelleme Kuralları
export const sendPortBlockingRules = async (rules) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/portblocking/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules }),
        });
        return await response.json();
    } catch (error) {
        console.error("Port Blocking API Hatası:", error);
        throw error;
    }
};

// 🔥 4. MAC Adresi Kuralları
export const sendMACRules = async (rules) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/macrouting/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules }),
        });
        return await response.json();
    } catch (error) {
        console.error("MAC Rules API Hatası:", error);
        throw error;
    }
};

// 🔥 5. DNS Engelleme Kuralları
export const sendDNSBlockingRules = async (rules) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/dnsblocking/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules }),
        });
        return await response.json();
    } catch (error) {
        console.error("DNS Blocking API Hatası:", error);
        throw error;
    }
};

// 🔥 6. Trafik Önceliklendirme (QoS) Kuralları
export const sendQoSRules = async (rules) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/qos/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules }),
        });
        return await response.json();
    } catch (error) {
        console.error("QoS API Hatası:", error);
        throw error;
    }
};

// 🔥 7. VPN ve NAT Kuralları
export const sendVPNRules = async (rules) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/vpn-nat/rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules }),
        });
        return await response.json();
    } catch (error) {
        console.error("VPN/NAT API Hatası:", error);
        throw error;
    }
};
