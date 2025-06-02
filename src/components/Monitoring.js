import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const Monitoring = () => {
  const [dnsDetailData, setDnsDetailData] = useState([]);
  const [firewallData, setFirewallData] = useState([]);
  const [portBlockData, setPortBlockData] = useState([]);
  const [macStats, setMacStats] = useState([]);
  const [postLogs, setPostLogs] = useState([]);

  useEffect(() => {
    const fetchDnsDetailData = async () => {
      try {
        const res = await fetch("/api/dnsblocking/stats");
        const data = await res.json();
        setDnsDetailData(data);
      } catch (err) {
        console.error("DNS verisi alınamadı:", err.message);
      }
    };

    const fetchFirewallData = async () => {
      try {
        const res = await fetch("/api/firewall/stats");
        const data = await res.json();
        setFirewallData(data);
      } catch (err) {
        console.error("Firewall verisi alınamadı:", err.message);
      }
    };

    const fetchPortBlockData = async () => {
      try {
        const res = await fetch("/api/portblocking/stats");
        const data = await res.json();
        setPortBlockData(data);
      } catch (err) {
        console.error("Port engelleme verisi alınamadı:", err.message);
      }
    };

    const fetchMacStats = async () => {
      try {
        const res = await fetch("/api/mac/stats");
        const data = await res.json();
        setMacStats(data);
        console.log("📊 MAC Stats:", data);
      } catch (err) {
        console.error("MAC stats alınamadı:", err.message);
      }
    };

    const fetchPostLogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/logs");
        const data = await res.json();
        setPostLogs(data);
      } catch (err) {
        console.error("Post logları alınamadı:", err.message);
      }
    };

    fetchDnsDetailData();
    fetchFirewallData();
    fetchPortBlockData();
    fetchMacStats();
    fetchPostLogs();

    const interval = setInterval(() => {
      fetchDnsDetailData();
      fetchFirewallData();
      fetchPortBlockData();
      fetchMacStats();
      fetchPostLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderBarChart = (title, data, color, yDataKey = "name") => (
    <div className="mb-5">
      <h4 className="mb-3" style={{ color }}>
        {title}
      </h4>
      <ResponsiveContainer
        width="100%"
        height={Math.max(300, data.length * 40)}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey={yDataKey} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={color} name="Sorgu Sayısı" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div>
      <h3 className="mb-4">📊 Gerçek Zamanlı Log İzleme</h3>

      {dnsDetailData.length > 0 &&
        renderBarChart(
          "🔎 DNS Sorguları (Domain Bazlı)",
          dnsDetailData,
          "#6f42c1",
          "name"
        )}

      {firewallData.length > 0 &&
        renderBarChart(
          "🔥 Firewall Engellenen IP Analizi",
          firewallData,
          "#dc3545",
          "ip"
        )}

      {portBlockData.length > 0 &&
        renderBarChart(
          "🚫 Port Engelleme İstekleri (IP Bazlı)",
          portBlockData,
          "#d9534f",
          "ip"
        )}

      {macStats.length > 0 &&
        renderBarChart(
          "🔗 MAC Adreslerine Göre Erişim Denemeleri",
          macStats,
          "#17a2b8",
          "mac"
        )}

      <hr className="my-5" />
      <h3 className="mb-3">📁 Eklenen Kurallar Logları</h3>

      {postLogs.length > 0 ? (
        Object.entries(
          postLogs.reduce((acc, log) => {
            const group = log.file
              .replace("_log.csv", "")
              .replace(/_/g, " ")
              .toUpperCase();
            acc[group] = acc[group] || [];
            acc[group].push(log);
            return acc;
          }, {})
        ).map(([logType, logs], idx) => (
          <div key={idx} className="mb-5">
            <h5 className="mb-2" style={{ color: "#D84040" }}>
              {logType}
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Zaman</th>
                    <th>Kural Verisi</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((entry, i) => (
                    <tr key={i}>
                      <td>{entry.timestamp}</td>
                      <td>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {entry.rule}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p>Henüz kayıtlı kural yok.</p>
      )}
    </div>
  );
};

export default Monitoring;
