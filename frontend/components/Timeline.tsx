"use client";
import React, { useEffect, useState } from 'react';

export default function Timeline() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://zeno-backend.harshsaw01.workers.dev/api/timelineEvents?user=1&date=2025-08-09'
        );
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        setData({ error: String(err) });
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ color: "lime", background: "#111", padding: 16 }}>
      <h3>API Response Test:</h3>
      <pre style={{ background: "#222", color: "lime", padding: 16 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
