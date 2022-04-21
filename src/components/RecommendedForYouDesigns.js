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
  const [openMenu, setOpenMenu] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [currentId, setCurrentId] = useState(null);

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

  const handleDelete = (id) => {
    setOpenMenu(true);
    setCurrentId(id);
  };

  const handleDesignDelete = async (currentId) => {
    // update design in Database
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };

    const res = await fetch(
      `/api/designs/delete-design/${currentId}`,
      requestOptions
    );
    const data = await res.json();
    window.location.href = "/dashboard";
    console.log(data);
  };

  useEffect(() => {
    if (confirm && currentId) {
      handleDesignDelete(currentId);
    }
  }, [confirm, currentId]);

  return (
    <div style={{ width: "100%" }}>
      {openMenu && (
        <div className="confirmModalBoxWrapper">
          <div className="confirmModalBox">
            <p>Are you sure you want to delete this design?</p>
            <div>
              <div
                onClick={() => {
                  setConfirm(true);
                  setOpenMenu(false);
                }}
              >
                Yes
              </div>
              <div
                onClick={() => {
                  setConfirm(false);
                  setOpenMenu(false);
                }}
              >
                No
              </div>
            </div>
          </div>
        </div>
      )}
      <h1 style={{ marginBottom: "35px" }}>Your designs</h1>
      <div className="designsContainer">
        {designs.map(
          (design, index) =>
            !design.isDeleted && (
              <div
                className="designContainerWrapper"
                style={{ width: "238px", cursor: "pointer" }}
              >
                <div
                  className="designContainer"
                  onClick={() => gotToDesign(design._id)}
                >
                  <canvas
                    id={`canvas-${index}`}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="bottomText">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "15px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 5c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm0-2c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z" />
                    </svg>
                    <p onClick={() => gotToDesign(design._id)}>{design.name}</p>
                  </div>

                  <svg
                    onClick={() => handleDelete(design._id)}
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z" />
                  </svg>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default RecommendedForYouDesigns;
