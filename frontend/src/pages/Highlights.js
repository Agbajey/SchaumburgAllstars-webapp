import React, { useRef } from "react";

export default function Highlights() {
  const v1Ref = useRef(null);
  const v2Ref = useRef(null);
  const v3Ref = useRef(null);

  const pauseAllExcept = (current) => {
    [v1Ref.current, v2Ref.current, v3Ref.current].forEach((v) => {
      if (v && v !== current) {
        v.pause();
        v.currentTime = 0;
        v.muted = true;
      }
    });
  };

  const handleEnter = async (video) => {
    if (!video) return;
    pauseAllExcept(video);
    video.muted = true;

    try {
      await video.play();
    } catch (e) {
      console.log("Autoplay blocked:", e);
    }
  };

  const handleLeave = (video) => {
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.muted = true;
  };

  const handleClick = async (video) => {
    if (!video) return;
    pauseAllExcept(video);

    video.muted = false;
    try {
      await video.play();
    } catch (e) {
      console.log("Click play failed:", e);
    }
  };

  const VideoTile = ({ title, subtitle, src, vRef, variant = "small" }) => {
    const isFeatured = variant === "featured";

    return (
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: isFeatured ? "16 / 9" : "16 / 10",
            background: "rgba(0,0,0,0.35)",
          }}
          onMouseEnter={() => handleEnter(vRef.current)}
          onMouseLeave={() => handleLeave(vRef.current)}
          onClick={() => handleClick(vRef.current)}
        >
          <video
            ref={vRef}
            src={src}
            playsInline
            preload="metadata"
            controls={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              cursor: "pointer",
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.00) 40%, rgba(0,0,0,0.80) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Play badge */}
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
              fontWeight: 800,
              letterSpacing: 0.4,
              pointerEvents: "none",
            }}
          >
            ▶ HIGHLIGHT
          </div>

          {/* Title overlay */}
          <div
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              bottom: 12,
              color: "white",
            }}
          >
            <div
              style={{
                fontSize: isFeatured ? 20 : 16,
                fontWeight: 900,
                lineHeight: 1.15,
                textShadow: "0 6px 16px rgba(0,0,0,0.55)",
              }}
            >
              {title}
            </div>

            {subtitle ? (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  opacity: 0.9,
                  lineHeight: 1.25,
                  maxWidth: 720,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            Hover to play (muted) • Click for sound
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              opacity: 0.9,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "6px 10px",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            Schaumburg Allstars
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: 14 }}>Match Highlights</h2>

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
        <h3 style={{ marginTop: 0, marginBottom: 6 }}>Latest Videos</h3>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Goals, skills, and top moments from Schaumburg Allstars.
        </p>
      </div>

      {/* Layout: featured left, two stacked right (responsive) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* FEATURED */}
        <div>
          <VideoTile
            variant="featured"
            title="Training Session Highlights"
            subtitle="Top moments from training — quick passing, sharp finishes, and intensity."
            src="/videos/highlight1.mp4"
            vRef={v1Ref}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "grid", gap: 18 }}>
          <VideoTile
            title="Training Session Highlights"
            subtitle="More drills, more goals — hover to preview."
            src="/videos/highlight2.mp4"
            vRef={v2Ref}
          />

          <VideoTile
            title="Ola's Goal at Dallas '25"
            subtitle="One touch, compose, finish. Big moment."
            src="/videos/highlight3.mp4"
            vRef={v3Ref}
          />
        </div>
      </div>

      {/* Mobile responsiveness (simple) */}
      <style>{`
        @media (max-width: 900px) {
          .highlights-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}