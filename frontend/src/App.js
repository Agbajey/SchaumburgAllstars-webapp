import NewsArticle from "./pages/NewsArticle";
import Highlights from "./pages/Highlights";
import AllstarsOver40 from "./pages/AllstarsOver40";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Fixtures from "./pages/Fixtures";
import News from "./pages/News";

export default function App() {
  return (
    <BrowserRouter>
      <div className="header">
        <div className="container header-inner">
          <div
            className="brand"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            {/* Club Crest */}
            <img
              src="/crest.png"
              alt="Schaumburg Allstars"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                objectFit: "cover",
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
              }}
              onError={(e) => {
                // If crest isn't found, hide it cleanly
                e.currentTarget.style.display = "none";
              }}
            />

            <div>
              <h1 style={{ margin: 0 }}>Schaumburg Allstars ⚽</h1>
              <small>Saturday Football Club</small>
            </div>
          </div>

          <div className="nav">
            <Link to="/">Home</Link>
            <Link to="/players">Players</Link>
            <Link to="/fixtures">Fixtures</Link>
            <Link to="/news">News</Link>
            <Link to="/over40">Allstars Over40</Link>
            <Link to="/highlights">Highlights</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20 }}>
        <Routes>
          <Route path="/over40" element={<AllstarsOver40 />} />
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/news" element={<News />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/news/:id" element={<NewsArticle />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}