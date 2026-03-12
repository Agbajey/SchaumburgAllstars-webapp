require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

/* ========================
   CORS + BODY PARSER
======================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-admin-key"],
  })
);

app.use(express.json());

/* ========================
   ADMIN MIDDLEWARE
======================== */
function requireAdmin(req, res, next) {
  const serverKey = process.env.ADMIN_KEY;

  if (!serverKey) {
    return res.status(500).json({ error: "ADMIN_KEY is not set on the server" });
  }

  const clientKey = req.header("x-admin-key");

  if (!clientKey || clientKey !== serverKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

/* ========================
   ROOT
======================== */
app.get("/", (req, res) => {
  res.send("Welcome to Schaumburg Allstars API ⚽");
});

/* ========================
   PLAYERS
======================== */
app.get("/players", (req, res) => {
  res.json([
    { id: 1, name: "Mayowa", position: "Midfielder" },
    { id: 2, name: "Ola", position: "Midfielder" },
    { id: 3, name: "Bishop", position: "Defender" },
    { id: 4, name: "Nedu", position: "Midfielder" },
    { id: 5, name: "Evans", position: "Forward" },
    { id: 6, name: "Owen", position: "Goalkeeper" },
    { id: 7, name: "Wole", position: "Defender" },
    { id: 8, name: "Okenla", position: "Defender" },
    { id: 9, name: "Oja", position: "Defender" },
    { id: 10, name: "Demolee", position: "Midfielder" },
    { id: 11, name: "Tayo", position: "Forward" },
    { id: 12, name: "Simpa", position: "Forward" },
    { id: 13, name: "Bj", position: "Midfielder" },
    { id: 14, name: "Ayo", position: "Forward" },
  ]);
});

/* ========================
   FIXTURES
======================== */
app.get("/fixtures", (req, res) => {
  res.json([
    {
      id: 1,
      date: "Saturday 10:00 AM",
      opponent: "United FC",
      venue: "Olympic Park",
      status: "upcoming",
    },
    {
      id: 2,
      date: "Last Saturday",
      opponent: "Rivals FC",
      venue: "Olympic Park",
      status: "played",
      score: "3 - 2",
      motm: "Ola",
    },
  ]);
});

/* ========================
   NEWS (IN MEMORY)
======================== */
let news = [
  {
    id: 1,
    tag: "TEAM NEWS",
    title: "Hachi Papa Back From Injury",
    date: "2026-03-03",
    body:
      "Hachi Papa returns from injury and vows to come back with a banger next weekend. " +
      "After missing three matches due to a hamstring strain, he says he feels stronger than ever and ready to make an impact. " +
      "The squad welcomed him back in training with high intensity, and fans are expecting fireworks this Saturday.",
    image: "hachi.jpg",
  },
  {
    id: 2,
    tag: "INJURY UPDATE",
    title: "Balogun Sidelined For Six Weeks",
    date: "2026-03-03",
    body:
      "Balogun is out for six weeks with an ankle injury sustained while trying to dribble past Lukaku.",
    image: "balogun.jpg",
  },
  {
    id: 3,
    tag: "FORM WATCH",
    title: "Ola Hits A Rough Patch",
    date: "2026-03-03",
    body: `Ola has experienced a slight dip in form during the ongoing fasting period.

The midfielder, known for his energy and sharp decision-making, has found it challenging to maintain his usual intensity levels throughout the full 90 minutes.

Despite this, teammates and coaching staff remain confident in his professionalism and believe he will bounce back stronger once the fasting period concludes.`,
    image: "ola.jpg",
  },
];

/* ========================
   GET ALL NEWS
======================== */
app.get("/news", (req, res) => {
  const sortedNews = [...news].sort((a, b) => b.id - a.id);
  res.json(sortedNews);
});

/* ========================
   GET SINGLE NEWS
======================== */
app.get("/news/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = news.find((n) => n.id === id);

  if (!item) {
    return res.status(404).json({ error: "News not found" });
  }

  res.json(item);
});

/* ========================
   POST NEW NEWS (PROTECTED)
======================== */
app.post("/news", requireAdmin, (req, res) => {
  const { title, body, image, tag } = req.body;

  if (!title || !body) {
    return res.status(400).json({
      error: "Title and body are required",
    });
  }

  const maxId = news.length ? Math.max(...news.map((n) => n.id)) : 0;

  const newItem = {
    id: maxId + 1,
    title: String(title).trim(),
    body: String(body).trim(),
    image: image ? String(image).trim() : "default.jpg",
    tag: tag ? String(tag).trim() : "NEWS",
    date: new Date().toISOString().split("T")[0],
  };

  news.unshift(newItem);

  res.status(201).json(newItem);
});

/* ========================
   DELETE NEWS (PROTECTED)
======================== */
app.delete("/news/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);

  const index = news.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "News not found" });
  }

  const deleted = news.splice(index, 1)[0];

  res.json({
    message: "News deleted successfully",
    deleted,
  });
});

/* ========================
   START SERVER
======================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});