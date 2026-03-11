import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE } from "../config";

export default function News() {
  const location = useLocation();
  const isAdmin = new URLSearchParams(location.search).get("admin") === "true";

  const [news, setNews] = useState([]);

  // admin key (stored for this browser session)
  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("ADMIN_KEY") || ""
  );

  // form fields
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("NEWS");
  const [image, setImage] = useState(""); // e.g. "balogun.jpg"
  const [error, setError] = useState("");

  const fetchNews = () => {
    fetch(`${API_BASE}/news`)
      .then((res) => res.json())
      .then((data) => setNews(Array.isArray(data) ? data : data?.news || []))
      .catch((err) => console.error("News fetch error:", err));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const { featured, sideCards, rest } = useMemo(() => {
    const featured = news[0];
    const sideCards = news.slice(1, 3);
    const rest = news.slice(3);
    return { featured, sideCards, rest };
  }, [news]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title || !body) {
      setError("Title and body are required.");
      return;
    }

    if (!adminKey) {
      setError("Admin key is required to post news.");
      return;
    }

    fetch(`${API_BASE}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({
        title,
        body,
        tag,
        image, // must exist in frontend/public/news
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `Failed to post news (${res.status})`);
        }
        return res.json();
      })
      .then(() => {
        setTitle("");
        setBody("");
        setTag("NEWS");
        setImage("");
        fetchNews();
      })
      .catch((err) => setError(err.message || "Failed to post."));
  };

  const handleDelete = (id) => {
    setError("");

    if (!adminKey) {
      setError("Admin key is required to delete news.");
      return;
    }

    const ok = window.confirm("Delete this news item?");
    if (!ok) return;

    fetch(`${API_BASE}/news/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-key": adminKey,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `Failed to delete (${res.status})`);
        }
        return res.json();
      })
      .then(() => {
        fetchNews();
      })
      .catch((err) => setError(err.message || "Failed to delete."));
  };

  return (
    <div>
      <h2 style={{ marginBottom: 14 }}>News</h2>

      {/* ADMIN PANEL (ONLY IN ADMIN MODE) */}
      {isAdmin && (
        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ marginTop: 0 }}>Admin</h3>

          <input
            placeholder="Enter admin key"
            value={adminKey}
            onChange={(e) => {
              setAdminKey(e.target.value);
              sessionStorage.setItem("ADMIN_KEY", e.target.value);
            }}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <p style={{ margin: 0, opacity: 0.7 }}>
            Admin mode is ON. Posting & deleting require the key.
          </p>
        </div>
      )}

      {/* Add News Form (ADMIN ONLY) */}
      {isAdmin && (
        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ marginTop: 0 }}>Add News</h3>

          {error && <p style={{ color: "red", marginTop: 0 }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <textarea
              placeholder="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                placeholder='Tag (e.g. "TEAM NEWS")'
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                style={{ flex: 1, minWidth: 220, padding: 10 }}
              />

              <input
                placeholder='Image filename (e.g. "ola.jpg")'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{ flex: 1, minWidth: 220, padding: 10 }}
              />

              <button type="submit" style={{ padding: "10px 16px" }}>
                Post
              </button>
            </div>

            <p style={{ marginBottom: 0, marginTop: 10, opacity: 0.7 }}>
              Tip: Put images in <b>frontend/public/news</b> and type the filename
              here (example: <b>hachi.jpg</b>).
            </p>
          </form>
        </div>
      )}

      {/* Liverpool-style red section */}
      <section
        style={{
          background: "#c8102e",
          borderRadius: 14,
          padding: 18,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 18,
          }}
        >
          {/* Featured */}
          {featured && (
            <Link
              to={`/news/${featured.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ArticleCard
                size="featured"
                tag={featured.tag || "NEWS"}
                title={featured.title}
                body={featured.body}
                date={featured.date}
                imageSrc={`/news/${featured.image}`}
                isAdmin={isAdmin}
                onDelete={() => handleDelete(featured.id)}
              />
            </Link>
          )}

          {/* Side cards */}
          <div style={{ display: "grid", gap: 18 }}>
            {sideCards.map((n) => (
              <Link
                key={n.id}
                to={`/news/${n.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ArticleCard
                  size="side"
                  tag={n.tag || "NEWS"}
                  title={n.title}
                  body={n.body}
                  date={n.date}
                  imageSrc={`/news/${n.image}`}
                  isAdmin={isAdmin}
                  onDelete={() => handleDelete(n.id)}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* More cards */}
        {rest.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 18,
              }}
            >
              {rest.map((n) => (
                <Link
                  key={n.id}
                  to={`/news/${n.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ArticleCard
                    size="small"
                    tag={n.tag || "NEWS"}
                    title={n.title}
                    body={n.body}
                    date={n.date}
                    imageSrc={`/news/${n.image}`}
                    isAdmin={isAdmin}
                    onDelete={() => handleDelete(n.id)}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ArticleCard({
  size,
  tag,
  title,
  body,
  date,
  imageSrc,
  isAdmin,
  onDelete,
}) {
  const isFeatured = size === "featured";
  const isSide = size === "side";
  const height = isFeatured ? 360 : isSide ? 171 : 190;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.16)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Delete button (ADMIN ONLY) */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault(); // don't navigate
            e.stopPropagation();
            onDelete?.();
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            background: "rgba(0,0,0,0.75)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.35)",
            padding: "6px 10px",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Delete
        </button>
      )}

      <div
        style={{
          height,
          overflow: "hidden",
          position: "relative",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <img
          src={imageSrc}
          alt={title}
          className="newsZoom"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: "scale(1)",
            transition: "transform 250ms ease",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.55)",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.4,
          }}
        >
          {tag}
        </div>
      </div>

      <div style={{ padding: isFeatured ? 16 : 14, color: "white" }}>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: isFeatured ? 22 : 16,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>

        <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.45 }}>
          {body?.length > (isFeatured ? 170 : 90)
            ? body.slice(0, isFeatured ? 170 : 90) + "..."
            : body}
        </p>

        <p style={{ margin: "10px 0 0 0", fontSize: 12, opacity: 0.8 }}>
          {date}
        </p>
      </div>
    </div>
  );
}