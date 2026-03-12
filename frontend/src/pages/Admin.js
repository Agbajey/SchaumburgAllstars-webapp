import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function Admin() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function loadNews() {
    try {
      const res = await fetch(`${API_BASE}/news`);
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load news error:", err);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function addNews() {
    if (!title.trim() || !body.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": "allstarsadmin123!",
        },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Add news failed: ${res.status} ${text}`);
      }

      setTitle("");
      setBody("");
      await loadNews();
    } catch (err) {
      console.error("Add news error:", err);
      alert("Failed to publish news.");
    }
  }

  async function deleteNews(id) {
    try {
      const res = await fetch(`${API_BASE}/news/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": "allstarsadmin123!",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Delete news failed: ${res.status} ${text}`);
      }

      await loadNews();
    } catch (err) {
      console.error("Delete news error:", err);
      alert("Failed to delete news.");
    }
  }

  return (
    <div>
      <h2>Admin Panel</h2>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Add News</h3>

        <input
          placeholder="News title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <textarea
          placeholder="News content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: "100%", height: 120, marginBottom: 10 }}
        />

        <button onClick={addNews}>Publish News</button>
      </div>

      <div>
        <h3>Existing News</h3>

        {news.map((n) => (
          <div
            key={n.id}
            className="card"
            style={{ marginBottom: 10, padding: 10 }}
          >
            <strong>{n.title}</strong>
            <div style={{ marginTop: 6 }}>{n.body}</div>

            <button
              onClick={() => deleteNews(n.id)}
              style={{ marginTop: 8 }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}