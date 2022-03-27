import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

import "../styles/RecommendedForYouDesigns.css";
import { Link } from "react-router-dom";

function RecommendedForYouDesigns() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    const getAllDesignsOfAuthedUser = async () => {
      const res = await fetch(`/api/designs/getDesigns/${loginData.email}`);
      const data = await res.json();
      console.log(data);
      setDesigns(data);

      data.map((d, idx) => {
        let canvas = new fabric.StaticCanvas(`canvas-${idx}`, {
          height: 238,
          width: 238,
          backgroundColor: "#ccc",
        });
        let zoom = 238 / Math.min(d.width, d.height);
        canvas.setZoom(zoom);

        if (d.json) {
          canvas.loadFromJSON(
            d.json,
            function () {
              canvas.renderAll();
            },
            function (o, object) {
              console.log(o, object);
            }
          );
        }
      });
    };

    if (loginData) getAllDesignsOfAuthedUser();
  }, [loginData]);

  const gotToDesign = (id) => {
    window.location.href = `/design/${id}`;
  };

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ marginBottom: "35px" }}>All public designs</h1>
      <div className="designsContainer">
        {designs.map((design, index) => (
          <div
            className="designContainerWrapper"
            style={{ width: "238px", cursor: "pointer" }}
          >
            <div className="designActions">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
              </svg>
            </div>
            <div
              className="designContainer"
              onClick={() => gotToDesign(design._id)}
            >
              <canvas
                id={`canvas-${index}`}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="bottomText" onClick={() => gotToDesign(design._id)}>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 5c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm0-2c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z" />
              </svg>
              <p>{design.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedForYouDesigns;
