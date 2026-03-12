import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function Admin() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadNews() {
    try {
      const res = await fetch(`${API_BASE}/news`);
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load news error:", err);
      alert("Failed to load news.");
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function addNews() {
    if (!adminKey.trim()) {
      alert("Enter admin key first.");
      return;
    }

    if (!title.trim() || !body.trim()) {
      alert("Title and body are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || `Failed to publish news. Status: ${res.status}`
        );
      }

      setTitle("");
      setBody("");
      await loadNews();
      alert("News published successfully.");
    } catch (err) {
      console.error("Add news error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteNews(id) {
    if (!adminKey.trim()) {
      alert("Enter admin key first.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/news/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || `Failed to delete news. Status: ${res.status}`
        );
      }

      await loadNews();
      alert("News deleted successfully.");
    } catch (err) {
      console.error("Delete news error:", err);
      alert(err.message);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>

      <div className="card" style={{ marginBottom: 20, padding: 15 }}>
        <h3>Admin Access</h3>

        <input
          type="password"
          placeholder="Enter admin key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 15 }}>
        <h3>Add News</h3>

        <input
          type="text"
          placeholder="News title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            boxSizing: "border-box",
          }}
        />

        <textarea
          placeholder="News content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            width: "100%",
            height: 120,
            marginBottom: 10,
            padding: 10,
            boxSizing: "border-box",
          }}
        />

        <button onClick={addNews} disabled={loading}>
          {loading ? "Publishing..." : "Publish News"}
        </button>
      </div>

      <div>
        <h3>Existing News</h3>

        {news.length === 0 ? (
          <p>No news available.</p>
        ) : (
          news.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{ marginBottom: 10, padding: 10 }}
            >
              <strong>{n.title}</strong>
              <div style={{ marginTop: 6 }}>{n.body}</div>

              {n.date && (
                <div style={{ marginTop: 6, fontSize: "0.9rem", opacity: 0.7 }}>
                  {n.date}
                </div>
              )}

              <button
                onClick={() => deleteNews(n.id)}
                style={{ marginTop: 10 }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}