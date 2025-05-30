import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Monitoring = () => {
  const [dnsDetailData, setDnsDetailData] = useState([]);
  const [postLogs, setPostLogs] = useState([]);

  useEffect(() => {
    const fetchDnsDetailData = async () => {
      try {
        const res = await fetch("/api/dnsblocking/stats");
        const data = await res.json();
        setDnsDetailData(data);
      } catch (err) {
        console.error("DNS detay verisi alınamadı:", err.message);
      }
    };

    const fetchPostLogs = async () => {
      try {
        const res = await fetch("/logs");
        const data = await res.json();
        setPostLogs(data);
      } catch (err) {
        console.error("Post logları alınamadı:", err.message);
      }
    };

    fetchDnsDetailData();
    fetchPostLogs();

    const interval = setInterval(() => {
      fetchDnsDetailData();
      fetchPostLogs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 className="mb-4">🧠 DNS Sorgu Analizi (Domain Bazlı)</h3>
      <div className="chart-container">
        {dnsDetailData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dnsDetailData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} />
              <Tooltip />
              <Bar dataKey="value" fill="#6f42c1" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Henüz DNS verisi yok.</p>
        )}
      </div>

      <hr className="my-5" />

      <h3 className="mb-3">📁 Eklenen Kurallar Logları</h3>

      {postLogs.length > 0 ? (
        Object.entries(
          postLogs.reduce((acc, log) => {
            const group = log.file.replace("_log.csv", "").replace(/_/g, " ").toUpperCase();
            acc[group] = acc[group] || [];
            acc[group].push(log);
            return acc;
          }, {})
        ).map(([logType, logs], idx) => (
          <div key={idx} className="mb-5">
            <h5 className="mb-2" style={{ color: "#D84040" }}>{logType}</h5>
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
                      <td><pre style={{ whiteSpace: "pre-wrap" }}>{entry.rule}</pre></td>
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