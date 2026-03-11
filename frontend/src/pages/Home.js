import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setErrMsg("");

      try {
        const [fxRes, newsRes] = await Promise.all([
          fetch(`${API_BASE}/fixtures`, { signal: controller.signal }),
          fetch(`${API_BASE}/news`, { signal: controller.signal }),
        ]);

        if (!fxRes.ok) throw new Error(`Fixtures failed (${fxRes.status})`);
        if (!newsRes.ok) throw new Error(`News failed (${newsRes.status})`);

        const fxData = await fxRes.json();
        const newsData = await newsRes.json();

        const fxList = Array.isArray(fxData) ? fxData : fxData?.fixtures || [];
        const newsList = Array.isArray(newsData)
          ? newsData
          : newsData?.news || [];

        if (mounted) {
          setFixtures(fxList);
          setNews(newsList);
        }
      } catch (e) {
        if (e.name === "AbortError") return;
        console.error("Home fetch error:", e);
        if (mounted) setErrMsg(e.message || "Failed to load home data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const { nextMatch, latestResult, featuredNews, sideNews } = useMemo(() => {
    const upcoming = fixtures.filter(
      (f) => String(f?.status || "").toLowerCase() !== "played"
    );
    const played = fixtures.filter(
      (f) => String(f?.status || "").toLowerCase() === "played"
    );

    return {
      nextMatch: upcoming[0] || null,
      latestResult: played[0] || null,
      featuredNews: news[0] || null,
      sideNews: news.slice(1, 3),
    };
  }, [fixtures, news]);

  return (
    <div>
      <h2 style={{ marginBottom: 14 }}>Schaumburg Allstars</h2>

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
        <h3 style={{ marginTop: 0, marginBottom: 6 }}>Club Hub</h3>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Match updates, fixtures, team news, and highlights — all in one place.
        </p>
      </div>

      {/* ✅ SKELETON LOADING */}
      {loading && (
        <>
          <div
            className="home-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr",
              gap: 18,
              alignItems: "start",
              marginBottom: 18,
            }}
          >
            {/* Featured Skeleton */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
                <Skeleton height="100%" radius={0} style={{ width: "100%" }} />
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 12,
                  }}
                >
                  <Skeleton height={16} style={{ width: "40%", marginBottom: 10 }} />
                  <Skeleton height={22} style={{ width: "70%", marginBottom: 10 }} />
                  <Skeleton height={12} style={{ width: "85%", marginBottom: 6 }} />
                  <Skeleton height={12} style={{ width: "60%" }} />
                </div>
              </div>
            </div>

            {/* Right Column Skeletons */}
            <div style={{ display: "grid", gap: 18 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card" style={{ padding: 14 }}>
                  <Skeleton height={14} style={{ width: "35%", marginBottom: 12 }} />
                  <Skeleton height={18} style={{ width: "80%", marginBottom: 10 }} />
                  <Skeleton height={12} style={{ width: "90%" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile responsiveness */}
          <style>{`
            @media (max-width: 900px) {
              .home-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </>
      )}

      {/* ERROR */}
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
          <strong>Couldn’t load:</strong> {errMsg}
          <div style={{ marginTop: 6, fontSize: 12 }}>
            Tried: <code>{API_BASE}/fixtures</code> and <code>{API_BASE}/news</code>
          </div>
        </div>
      )}

      {/* REAL CONTENT */}
      {!loading && !errMsg && (
        <>
          {/* Top layout */}
          <div
            className="home-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr",
              gap: 18,
              alignItems: "start",
              marginBottom: 18,
            }}
          >
            {/* Featured news */}
            <div>
              {featuredNews ? (
                <Link
                  to={`/news/${featuredNews.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <HeroTile
                    badge={featuredNews.tag || "NEWS"}
                    title={featuredNews.title}
                    subtitle={truncate(featuredNews.body, 140)}
                    imageSrc={featuredNews.image ? `/news/${featuredNews.image}` : ""}
                  />
                </Link>
              ) : (
                <HeroTile
                  badge="NEWS"
                  title="No news yet"
                  subtitle="Check back for team updates."
                  imageSrc=""
                />
              )}
            </div>

            {/* Right column */}
            <div style={{ display: "grid", gap: 18 }}>
              <MiniTile
                badge="NEXT MATCH"
                title={
                  nextMatch
                    ? `Allstars vs ${nextMatch.opponent || "TBA"}`
                    : "Next match TBA"
                }
                meta={
                  nextMatch
                    ? `${nextMatch.date || "Date TBA"} • ${nextMatch.venue || "Venue TBA"}`
                    : "Upcoming fixtures will appear here."
                }
                ctaText="View Fixtures"
                ctaTo="/fixtures"
              />

              <MiniTile
                badge="LATEST RESULT"
                title={
                  latestResult
                    ? `Allstars vs ${latestResult.opponent || "TBA"}`
                    : "No result yet"
                }
                meta={
                  latestResult
                    ? `${latestResult.score || "—"} • ${latestResult.date || "Date"}`
                    : "Results will appear here."
                }
                ctaText="See Results"
                ctaTo="/fixtures"
              />

              <MiniTile
                badge="HIGHLIGHTS"
                title="Watch the latest clips"
                meta="Training, goals, and top moments."
                ctaText="View Highlights"
                ctaTo="/highlights"
              />
            </div>
          </div>

          {/* More news */}
          {sideNews.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>More News</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 18,
                }}
              >
                {sideNews.map((n) => (
                  <Link
                    key={n.id}
                    to={`/news/${n.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardTile
                      badge={n.tag || "NEWS"}
                      title={n.title}
                      subtitle={truncate(n.body, 95)}
                      imageSrc={n.image ? `/news/${n.image}` : ""}
                      footer={n.date || ""}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            <QuickLink to="/players" title="Players" desc="Squad list & positions" />
            <QuickLink to="/fixtures" title="Fixtures" desc="Upcoming & results" />
            <QuickLink to="/news" title="News" desc="Latest club updates" />
            <QuickLink to="/highlights" title="Highlights" desc="Watch the clips" />
          </div>

          {/* Mobile responsiveness */}
          <style>{`
            @media (max-width: 900px) {
              .home-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

function HeroTile({ badge, title, subtitle, imageSrc }) {
  return (
    <div
      className="card"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(0,0,0,0.65)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 999,
            padding: "6px 10px",
            color: "white",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 0.4,
          }}
        >
          {badge}
        </div>

        <div
          style={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: 12,
            color: "white",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.15 }}>
            {title}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.92 }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniTile({ badge, title, meta, ctaText, ctaTo }) {
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
            marginBottom: 10,
          }}
        >
          {badge}
        </div>

        <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1.2 }}>
          {title}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>{meta}</div>

        <div style={{ marginTop: 12 }}>
          <Link
            to={ctaTo}
            style={{
              display: "inline-block",
              textDecoration: "none",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 0.3,
              color: "white",
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.16)",
              padding: "8px 12px",
              borderRadius: 999,
            }}
          >
            {ctaText} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function CardTile({ badge, title, subtitle, imageSrc, footer }) {
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
      <div style={{ position: "relative", aspectRatio: "16 / 10" }}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.78) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.65)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 999,
            padding: "6px 10px",
            color: "white",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 0.4,
          }}
        >
          {badge}
        </div>

        <div style={{ position: "absolute", left: 12, right: 12, bottom: 10 }}>
          <div style={{ color: "white", fontWeight: 900, fontSize: 16 }}>
            {title}
          </div>
          <div style={{ color: "white", opacity: 0.92, marginTop: 6, fontSize: 13 }}>
            {subtitle}
          </div>
        </div>
      </div>

      {footer ? (
        <div style={{ padding: 12, fontSize: 12, opacity: 0.75 }}>{footer}</div>
      ) : null}
    </div>
  );
}

function QuickLink({ to, title, desc }) {
  return (
    <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        className="card"
        style={{
          borderRadius: 16,
          padding: 14,
          background:
            "linear-gradient(180deg, rgba(17,24,39,0.95) 0%, rgba(11,18,32,0.95) 100%)",
          color: "white",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{desc}</div>
        <div style={{ marginTop: 10, fontWeight: 900, fontSize: 12, opacity: 0.9 }}>
          Open →
        </div>
      </div>
    </Link>
  );
}

function truncate(text, max) {
  if (!text) return "";
  const t = String(text);
  return t.length > max ? t.slice(0, max) + "…" : t;
}