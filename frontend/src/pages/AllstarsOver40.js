import React from "react";

import img1 from "../images/over40-1.jpg";
import img2 from "../images/over40-2.jpg";
import img3 from "../images/over40-3.jpg";
import img4 from "../images/over40-4.jpg";

export default function AllstarsOver40() {
  return (
    <div>
      <h2>Allstars Over40</h2>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Team Highlights</h3>
        <p>Veteran leadership. Experience. Still got it.</p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <img src={img1} alt="Over40 Match 1" style={imageStyle} />
        <img src={img2} alt="Over40 Match 2" style={imageStyle} />
        <img src={img3} alt="Over40 Match 3" style={imageStyle} />
        <img src={img4} alt="Over40 Match 4" style={imageStyle} />
      </div>
    </div>
  );
}

const imageStyle = {
  width: 300,
  borderRadius: 10,
  objectFit: "cover",
};