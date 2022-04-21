import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

function Explore() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  const [designCreated, setDesignCreated] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllDesigns = async () => {
      const res = await fetch("/api/designs/getDesigns/all");
      const data = await res.json();
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

    getAllDesigns();
  }, []);

  const createDesign = async (newDesign) => {
    setLoading(true);
    const res = await fetch(
      `/api/designs/${newDesign.width}/${newDesign.height}/${newDesign.unit}`,
      {
        method: "POST",
        body: JSON.stringify({
          email: loginData?.email,
          name: "Untitled",
          json: newDesign.json,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    setDesignCreated(data);
  };

  if (designCreated?.status === 200) {
    return (window.location.href = `/design/${designCreated?.id}`);
  }

  return (
    <div className="Explore">
      {loading && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            height: "100vh",
            width: "100%",
            background: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="74"
            height="74"
            viewBox="0 0 24 24"
            fill="#ccc"
            className="loading"
          >
            <path d="M11.501 4.025v-4.025h1v4.025l-.5-.025-.5.025zm-7.079 5.428l-3.884-1.041-.26.966 3.881 1.04c.067-.331.157-.651.263-.965zm5.995-5.295l-1.039-3.878-.967.259 1.041 3.883c.315-.106.635-.197.965-.264zm-6.416 7.842l.025-.499h-4.026v1h4.026l-.025-.501zm2.713-5.993l-2.846-2.845-.707.707 2.846 2.846c.221-.251.457-.487.707-.708zm-1.377 1.569l-3.48-2.009-.5.866 3.484 2.012c.15-.299.312-.591.496-.869zm13.696.607l3.465-2-.207-.36-3.474 2.005.216.355zm.751 1.993l3.873-1.038-.129-.483-3.869 1.037.125.484zm-3.677-5.032l2.005-3.472-.217-.125-2.002 3.467.214.13zm-1.955-.843l1.037-3.871-.16-.043-1.038 3.873.161.041zm3.619 2.168l2.835-2.834-.236-.236-2.834 2.833.235.237zm-9.327-1.627l-2.011-3.484-.865.5 2.009 3.479c.276-.184.568-.346.867-.495zm-4.285 8.743l-3.88 1.04.26.966 3.884-1.041c-.106-.314-.197-.634-.264-.965zm11.435 5.556l2.01 3.481.793-.458-2.008-3.478c-.255.167-.522.316-.795.455zm3.135-2.823l3.477 2.007.375-.649-3.476-2.007c-.116.224-.242.439-.376.649zm-1.38 1.62l2.842 2.842.59-.589-2.843-2.842c-.187.207-.383.403-.589.589zm2.288-3.546l3.869 1.037.172-.644-3.874-1.038c-.049.218-.102.434-.167.645zm.349-2.682l.015.29-.015.293h4.014v-.583h-4.014zm-6.402 8.132l1.039 3.879.967-.259-1.041-3.884c-.315.106-.635.197-.965.264zm-1.583.158l-.5-.025v4.025h1v-4.025l-.5.025zm-5.992-2.712l-2.847 2.846.707.707 2.847-2.847c-.25-.22-.487-.456-.707-.706zm-1.165-1.73l-3.485 2.012.5.866 3.48-2.009c-.185-.278-.347-.57-.495-.869zm2.734 3.106l-2.01 3.481.865.5 2.013-3.486c-.299-.149-.591-.311-.868-.495zm1.876.915l-1.042 3.886.967.259 1.04-3.881c-.33-.067-.65-.158-.965-.264z" />
          </svg>
        </div>
      )}
      <h1 style={{ marginBottom: "35px" }}>All public designs</h1>
      <div className="designsContainer">
        {designs &&
          designs.length > 0 &&
          designs.map(
            (design, index) =>
              !design.isDeleted && (
                <div
                  className="designContainerWrapper"
                  style={{ width: "238px", cursor: "pointer" }}
                >
                  <div
                    className="designContainer"
                    /*  onClick={() => gotToDesign(design._id)} */
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
                      <p /* onClick={() => gotToDesign(design._id)} */>
                        {design.name}
                      </p>
                    </div>

                    <svg
                      onClick={() => createDesign(design)}
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    >
                      <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
                    </svg>
                  </div>
                </div>
              )
          )}
      </div>
    </div>
  );
}

export default Explore;
