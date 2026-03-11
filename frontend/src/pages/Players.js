import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function Players() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/players`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Players fetch error:", err));
  }, []);

  return (
    <div>
      <h2>Players</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 20,
        }}
      >
        {players.map((p) => (
          <div
            className="card"
            key={p.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 20,
              textAlign: "center",
            }}
          >
            <img
              src={`/players/${p.name.toLowerCase()}.jpg`}
              alt={p.name}
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 12,
              }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />

            <h3 style={{ margin: 0 }}>{p.name}</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>{p.position}</p>
          </div>
        ))}
      </div>
    </div>
  );
}