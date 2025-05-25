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
// 🔍 DNS Engelleme Kuralları - GET
export const getDNSBlockingRules = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dnsblocking/rules`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    console.error("🔥 DNS GET Hatası:", error);
    throw error;
  }
};

export const deleteDNSBlockingRule = async (domain) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/dnsblocking/rules/${encodeURIComponent(domain)}`,
      {
        method: "DELETE",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("🔥 DNS DELETE Hatası:", error);
    throw error;
  }
};
