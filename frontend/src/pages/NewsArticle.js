import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE } from "../config";

export default function NewsArticle() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/news`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((n) => String(n.id) === String(id));
        setItem(found || null);
      })
      .catch((err) => console.error("Article fetch error:", err));
  }, [id]);

  if (!item) {
    return (
      <div>
        <Link to="/news">← Back to News</Link>
        <h2 style={{ marginTop: 12 }}>Article not found</h2>
      </div>
    );
  }

  return (
    <div>
      <Link to="/news">← Back to News</Link>

      <div
        className="card"
        style={{ marginTop: 14, padding: 0, overflow: "hidden" }}
      >
        {/* Image section */}
        <div style={{ background: "#000" }}>
          <img
            src={`/news/${item.image}`}
            alt={item.title}
            style={{
              width: "100%",
              maxHeight: 520,
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Content section */}
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.7 }}>
            {item.tag || "NEWS"} • {item.date}
          </div>

          <h1 style={{ margin: "12px 0 12px 0" }}>
            {item.title}
          </h1>

          <div
            style={{
              whiteSpace: "pre-line",
              lineHeight: 1.6,
              fontSize: 16,
              opacity: 0.9,
            }}
          >
            {item.body}
          </div>
        </div>
      </div>
    </div>
  );
}