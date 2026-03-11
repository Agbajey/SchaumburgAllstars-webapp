import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function loadFixtures() {
      setLoading(true);
      setErrMsg("");

      try {
        const res = await fetch(`${API_BASE}/fixtures`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.fixtures;

        if (!Array.isArray(list)) {
          throw new Error("Unexpected response (fixtures is not an array)");
        }

        if (mounted) setFixtures(list);
      } catch (e) {
        if (e.name === "AbortError") return;
        console.error("Fixtures fetch error:", e);
        if (mounted) setErrMsg(e.message || "Failed to load fixtures");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadFixtures();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const { upcoming, played, featured, sideCards, restPlayed } = useMemo(() => {
    const up = [];
    const pl = [];

    for (const f of fixtures) {
      const status = String(f?.status || "").toLowerCase();
      if (status === "played") pl.push(f);
      else up.push(f);
    }

    // pick "featured" = soonest upcoming (or first)
    const featured = up[0] || null;
    const sideCards = up.slice(1, 3);
    const restPlayed = pl;

    return { upcoming: up, played: pl, featured, sideCards, restPlayed };
  }, [fixtures]);

  return (
    <div>
      <h2 style={{ marginBottom: 14 }}>Fixtures</h2>

      {/* ESPN-style header strip */}
      <div
        className="card"
        style={{
          marginBottom: 18,
          background: "linear-gradient(90deg, #111827, #0b1220)",
          color: "white",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 6 }}>Match Center</h3>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Upcoming fixtures and recent results for Schaumburg Allstars.
        </p>
      </div>

      {loading && <p style={{ opacity: 0.8 }}>Loading fixtures…</p>}

      {!loading && errMsg && (
        <div
          style={{
            background: "#ffd6d6",
            border: "1px solid #ff6b6b",
            padding: 12,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <strong>Couldn’t load fixtures:</strong> {errMsg}
          <div style={{ marginTop: 6, fontSize: 12 }}>
            Tried: <code>{API_BASE}/fixtures</code>
          </div>
        </div>
      )}

      {/* Featured upcoming + side upcoming (ESPN-style) */}
      {!loading && !errMsg && (featured || sideCards.length > 0) && (
        <div
          className="fixtures-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: 18,
            alignItems: "start",
            marginBottom: 18,
          }}
        >
          {/* FEATURED */}
          {featured && (
            <FixtureTile
              variant="featured"
              badge="NEXT MATCH"
              title={`Schaumburg Allstars vs ${featured?.opponent || "TBA"}`}
              meta={`${featured?.date || "Date TBA"} • ${
                featured?.venue || "Venue TBA"
              }`}
            />
          )}

          {/* RIGHT COLUMN */}
          <div style={{ display: "grid", gap: 18 }}>
            {sideCards.map((f, idx) => (
              <FixtureTile
                key={f?.id ?? `${f?.date}-${f?.opponent}-${idx}`}
                badge="UPCOMING"
                title={`Schaumburg Allstars vs ${f?.opponent || "TBA"}`}
                meta={`${f?.date || "Date TBA"} • ${f?.venue || "Venue TBA"}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* If no upcoming */}
      {!loading && !errMsg && upcoming.length === 0 && (
        <div className="card" style={{ marginBottom: 18 }}>
          <h3 style={{ marginTop: 0 }}>Upcoming</h3>
          <p style={{ margin: 0, opacity: 0.8 }}>No upcoming fixtures yet.</p>
        </div>
      )}

      {/* Results grid */}
      {!loading && !errMsg && (
        <div>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Recent Results</h3>

          {played.length === 0 ? (
            <div className="card">
              <p style={{ margin: 0, opacity: 0.8 }}>No results yet.</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 18,
                alignItems: "start",
              }}
            >
              {restPlayed.map((f, idx) => (
                <ResultTile
                  key={f?.id ?? `${f?.date}-${f?.opponent}-played-${idx}`}
                  title={`Schaumburg Allstars vs ${f?.opponent || "TBA"}`}
                  score={f?.score || "—"}
                  meta={`${f?.date || "Date"} • ${f?.venue || "Venue"}`}
                  motm={f?.motm}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .fixtures-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function FixtureTile({ variant = "small", badge, title, meta }) {
  const isFeatured = variant === "featured";

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      }}
      className="card"
    >
      <div
        style={{
          padding: isFeatured ? 18 : 14,
          background:
            "linear-gradient(180deg, rgba(17,24,39,0.95) 0%, rgba(11,18,32,0.95) 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.12)",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 0.4,
            marginBottom: 12,
          }}
        >
          {badge}
        </div>

        <div
          style={{
            fontSize: isFeatured ? 22 : 16,
            fontWeight: 900,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>
          {meta}
        </div>
      </div>
    </div>
  );
}

function ResultTile({ title, score, meta, motm }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
      }}
    >
      <div
        style={{
          padding: 14,
          background:
            "linear-gradient(180deg, rgba(17,24,39,0.95) 0%, rgba(11,18,32,0.95) 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 900, opacity: 0.95 }}>
          FINAL
        </div>

        <div style={{ marginTop: 8, fontSize: 16, fontWeight: 900 }}>
          {title}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 28,
            fontWeight: 1000,
            letterSpacing: 0.6,
          }}
        >
          {score}
        </div>

        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>{meta}</div>

        {motm ? (
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.95 }}>
            <span style={{ fontWeight: 900 }}>MOTM:</span> {motm}
          </div>
        ) : null}
      </div>
    </div>
  );
}