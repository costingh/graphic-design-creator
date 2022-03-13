import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

import Navbar from "../Navbar";
import NewDesign from "../NewDesign";

import "../../styles/EditorContainer.css";

const DRAWER_CONFIG = [
  {
    name: "Templates",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M19.5 10V5a.5.5 0 0 0-.5-.5h-4.5V10h5zm0 1.5h-5v8H19a.5.5 0 0 0 .5-.5v-7.5zm-6.5-7H5a.5.5 0 0 0-.5.5v14c0 .28.22.5.5.5h8v-15zM5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2z"
        ></path>
      </svg>
    ),
  },
  {
    name: "Photos",
    svg: (
      <svg
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ),
  },
  {
    name: "Elements",
    svg: (
      <svg
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
  },
  {
    name: "Text",
    svg: (
      <svg
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="4 7 4 4 20 4 20 7"></polyline>
        <line x1="9" y1="20" x2="15" y2="20"></line>
        <line x1="12" y1="4" x2="12" y2="20"></line>
      </svg>
    ),
  },
  {
    name: "Uploads",
    svg: (
      <svg
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="16 16 12 12 8 16"></polyline>
        <line x1="12" y1="12" x2="12" y2="21"></line>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
        <polyline points="16 16 12 12 8 16"></polyline>
      </svg>
    ),
  },
  {
    name: "Folders",
    svg: (
      <svg
        stroke="currentColor"
        fill="none"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
  },
];

let numberOfDrawings = 0;

function EditorContainer() {
  const [activeTab, setActiveTab] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [canvas, setCanvas] = useState("");
  const [customHeight, setCustomHeight] = useState(400);
  const [customWidth, setCustomWidth] = useState(400);

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  const handleOpenDrawer = (itemName) => {
    if (itemName) {
      setActiveTab(itemName);
      setOpenDrawer(true);
    } else {
      setActiveTab("");
      setOpenDrawer(false);
    }
  };

  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: customHeight,
      width: customWidth,
      backgroundColor: "#eee",
    });

  const addRectangle = (canvasRefference) => {
    const rect = new fabric.Rect({
      left: customWidth / 4,
      top: customHeight / 4,
      height: customHeight / 2,
      width: customWidth / 2,
      fill: "#c8d1d9",
    });
    canvasRefference.add(rect);

    canvas.item(numberOfDrawings).set({
      borderColor: "rgb(0, 166, 255)",
      cornerColor: "rgb(6, 137, 208)",
      cornerSize: 6,
      transparentCorners: false,
    });
    numberOfDrawings += 1;

    canvasRefference.renderAll();
  };

  const addCircle = (canvasRefference) => {
    const circle = new fabric.Circle({
      left: customWidth / 4,
      top: customHeight / 4,
      radius: Math.min(customHeight / 4, customWidth / 4),
      fill: "#c8d1d9",
    });
    canvasRefference.add(circle);
    canvas.item(numberOfDrawings).set({
      borderColor: "rgb(0, 166, 255)",
      cornerColor: "rgb(6, 137, 208)",
      cornerSize: 6,
      transparentCorners: false,
    });
    numberOfDrawings += 1;

    canvasRefference.renderAll();
  };

  const handleDelete = () => {
    if (canvas) {
      canvas.getActiveObjects().forEach((obj) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject().renderAll();
    }
  };

  const resize = (e) => {
    /* canvas.setWidth(500);
    canvas.setHeight(500);
    canvas.calcOffset();

    let canvasWrapper = document.querySelector(".canvasWrapper");
    console.log(e.clientX);
    canvasWrapper.style.width = e.clientX;

    let width;
    let height;
    if (canvas) {
      const newWidth = canvasWrapper.clientWidth;
      const newHeight = canvasWrapper.clientHeight;
      if (newWidth !== width || newHeight !== height) {
        width = newWidth;
        height = newHeight;
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
      }
    } */
  };

  return (
    <div className="editorContainer">
      <Navbar />
      <div className="editorContainerInnerFlex">
        <div style={{ display: "flex" }}>
          <div className="editorContainerDrawer">
            {DRAWER_CONFIG.map((item) => (
              <div
                className={`item ${item.name === activeTab && "active"}`}
                key={item.name}
                onClick={() => handleOpenDrawer(item.name)}
              >
                {item.svg}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <div className={`drawerContent ${openDrawer && "active"}`}>
            <div className="innerDrawer">
              {activeTab === "Elements" && (
                <div className="elements">
                  <h1>Lines and patterns</h1>
                  <div className="elementsContainer">
                    <div
                      className="element"
                      onClick={() => addRectangle(canvas)}
                    >
                      <div className="square"></div>
                    </div>
                    <div className="element" onClick={() => addCircle(canvas)}>
                      <div className="circle"></div>
                    </div>
                    <div
                      className="element"
                      onClick={() => addRectangle(canvas)}
                    >
                      <div className="roundedBorderSquare"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="closeDrawer" onClick={() => handleOpenDrawer("")}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                viewBox="199 149 104 404"
                width="20"
                height="80"
              >
                <defs>
                  <path
                    d="M200 550C200.3 533.74 216.97 517.07 250 500C283.03 482.93 299.7 466.26 300 450L300 250C299.67 233.13 283 216.46 250 200C217 183.54 200.33 166.87 200 150L200 550Z"
                    id="fEGO0r42v"
                  ></path>
                </defs>
                <g>
                  <g>
                    <use
                      xlinkHref="#fEGO0r42v"
                      opacity="1"
                      fill="#252627"
                      fillOpacity="1"
                    ></use>
                    <g>
                      <use
                        xlinkHref="#fEGO0r42v"
                        opacity="1"
                        fillOpacity="0"
                        stroke="#000000"
                        strokeWidth="0"
                        strokeOpacity="1"
                      ></use>
                    </g>
                  </g>
                </g>
              </svg>

              <svg
                className="closeDrawerSvg"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
        <div className="editorContainerInner">
          <div className="editorContainerInnerNav">
            <div className="deleteActiveObjButton" onClick={handleDelete}>
              Delete
            </div>
          </div>
          <div className="editorContainerInnerForeground">
            <div className="canvasWrapper" onMouseMove={resize}>
              <NewDesign canvas={canvas} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorContainer;
