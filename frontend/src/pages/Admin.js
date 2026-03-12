import { useEffect, useState } from "react";
import { API_BASE } from "../config";

export default function Admin() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function loadNews() {
    const res = await fetch(`${API_BASE}/news`);
    const data = await res.json();
    setNews(data);
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function addNews() {
    if (!title || !body) return;

    await fetch(`${API_BASE}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });

    setTitle("");
    setBody("");
    loadNews();
  }

  async function deleteNews(id) {
    await fetch(`${API_BASE}/news/${id}`, {
      method: "DELETE",
    });

    loadNews();
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