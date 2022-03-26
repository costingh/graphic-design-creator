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
// Define an array with all fonts
let fonts = [
  "Times New Roman",
  "Pacifico",
  "VT323",
  "Quicksand",
  "Inconsolata",
];

function EditorContainer() {
  const [activeTab, setActiveTab] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [canvas, setCanvas] = useState("");
  const [customHeight, setCustomHeight] = useState(0);
  const [customWidth, setCustomWidth] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseUp, setMouseUp] = useState(false);
  const [activeObject, setActiveObject] = useState(null);
  const [currentObjectColor, setCurrentObjectColor] = useState("");
  const [currentObjectFontSize, setCurrentObjectFontSize] = useState(21);
  const [currentObjectFontFamily, setCurrentObjectFontFamily] =
    useState("Times New Roman");
  const [currentObjectAlign, setCurrentObjectAlign] = useState("left");
  const [currentDesignID, setCurrentDesignID] = useState(null);
  const [canvasContent, setCanvasContent] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // setCanvas(initCanvas());

    const url = window.location.href.split("/");
    const designId = url[url.length - 1];

    const getDesign = async () => {
      const res = await fetch(`/api/designs/${designId}`);
      const data = await res.json();
      setData(data);

      setCustomHeight(data.design.height);
      setCustomWidth(data.design.width);

      /* 
      _id: "623f3cba2a57ee816a4beb4c"​​
      createdAt: "2022-03-26T16:18:02.708Z"
      email: "gheorghecostin221@gmail.com"
      height: 2304
      json: null
      name: "Untitled"
      unit: "px"
      updatedAt: "2022-03-26T16:18:02.708Z"
      width: 1728
      */
    };

    getDesign();
  }, []);

  useEffect(() => {
    if (data) {
      // initialize canvas
      if (!canvas) setCanvas(initCanvas(data.design.height, data.design.width));
      else {
        if (data.design.json) {
          canvas.loadFromJSON(
            data.design.json,
            function () {
              canvas.renderAll();
            },
            function (o, object) {
              console.log(o, object);
            }
          );
        }
      }
    }
  }, [data, canvas]);

  const handleOpenDrawer = (itemName) => {
    if (itemName) {
      setActiveTab(itemName);
      setOpenDrawer(true);
    } else {
      setActiveTab("");
      setOpenDrawer(false);
    }
  };

  const initCanvas = (height, width) =>
    new fabric.Canvas("canvas", {
      height: height,
      width: width,
      backgroundColor: "#eee",
    });

  const addRectangle = (canvasRefference) => {
    const rect = new fabric.Rect({
      left: customWidth / 2,
      top: customHeight / 2,
      height: customHeight / 4,
      width: customWidth / 4,
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
      left: customWidth / 2,
      top: customHeight / 2,
      radius: Math.min(customHeight / 2, customWidth / 2),
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

  const addText = (canvasRefference, textToAdd, fontSize) => {
    const text = new fabric.Textbox(textToAdd, {
      left: customWidth / 2,
      top: customHeight / 2,
      width: 200,
      fontSize: fontSize,
      fill: "#000000",
      hiddenTextarea: null,
      textAlign: "left",
    });
    canvasRefference.add(text).setActiveObject(text);
    setActiveObject(text);
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
        numberOfDrawings -= 1;
      });
      canvas.discardActiveObject().renderAll();
    }
  };

  const resize = (e) => {
    if (mouseDown && !mouseUp) {
      if (e.target.className === "canvasWrapper") {
        e.target.style.cursor = "e-resize";
      }
    }
  };

  useEffect(() => {
    if (canvas) {
      setActiveObject(canvas.getActiveObject());
    }
  });

  useEffect(() => {
    if (activeObject) {
      if (activeObject?.get("type") === "textbox") {
        setCurrentObjectFontSize(activeObject.fontSize);
        setCurrentObjectColor(activeObject.fill);
        setCurrentObjectFontFamily(activeObject.fontFamily);
        setCurrentObjectAlign(activeObject.textAlign);
        setCurrentObjectFontFamily(activeObject.fontFamily);
      } else {
        setCurrentObjectColor(activeObject.fill);
      }
    }
  }, [activeObject]);

  const setNewColor = (newColor) => {
    setCurrentObjectColor(newColor);
    if (activeObject) {
      activeObject.fill = newColor;
      activeObject.dirty = true;
    }

    if (canvas) canvas.renderAll();
  };

  useEffect(() => {
    if (activeObject && activeObject.get("type") === "textbox") {
      activeObject.fontSize = currentObjectFontSize;
      activeObject.fontFamily = currentObjectFontFamily;
      activeObject.textAlign = currentObjectAlign;
      activeObject.dirty = true;
    }

    if (canvas) canvas.renderAll();
  }, [currentObjectFontSize, currentObjectAlign, currentObjectFontFamily]);

  const alignText = () => {
    if (currentObjectAlign === "left") setCurrentObjectAlign("center");
    if (currentObjectAlign === "center") setCurrentObjectAlign("right");
    if (currentObjectAlign === "right") setCurrentObjectAlign("left");
  };

  const zoomCanvas = (zoom) => {
    if (canvas) {
      canvas.setZoom(zoom);
      canvas.setWidth(customWidth * canvas.getZoom());
      canvas.setHeight(customHeight * canvas.getZoom());
    }
  };

  const handleSaveDesign = async () => {
    if (canvas) {
      let json = JSON.stringify(canvas.toJSON());
      console.log(json);

      // update design in Database
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: json,
      };

      const url = window.location.href.split("/");
      const designId = url[url.length - 1];

      const res = await fetch(`/api/designs/${designId}`, requestOptions);

      console.log(res.status);
      if (res.status === 200) alert("Design saved successfully");
      else alert("Design can' t be saved");

      /* let x = {
        version: "5.2.1",
        objects: [
          {
            type: "rect",
            version: "5.2.1",
            originX: "left",
            originY: "top",
            left: 606,
            top: 47,
            width: 235,
            height: 197,
            fill: "#cb6ce6",
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeDashOffset: 0,
            strokeLineJoin: "miter",
            strokeUniform: false,
            strokeMiterLimit: 4,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
            opacity: 1,
            shadow: null,
            visible: true,
            backgroundColor: "",
            fillRule: "nonzero",
            paintFirst: "fill",
            globalCompositeOperation: "source-over",
            skewX: 0,
            skewY: 0,
            rx: 0,
            ry: 0,
          },
          {
            type: "textbox",
            version: "5.2.1",
            originX: "left",
            originY: "top",
            left: 352,
            top: 66,
            width: 200,
            height: 23.73,
            fill: "#000000",
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeDashOffset: 0,
            strokeLineJoin: "miter",
            strokeUniform: false,
            strokeMiterLimit: 4,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
            opacity: 1,
            shadow: null,
            visible: true,
            backgroundColor: "",
            fillRule: "nonzero",
            paintFirst: "fill",
            globalCompositeOperation: "source-over",
            skewX: 0,
            skewY: 0,
            fontFamily: "Times New Roman",
            fontWeight: "normal",
            fontSize: 21,
            text: "Adauga un subtitlu",
            underline: false,
            overline: false,
            linethrough: false,
            textAlign: "left",
            fontStyle: "normal",
            lineHeight: 1.16,
            textBackgroundColor: "",
            charSpacing: 0,
            styles: {},
            direction: "ltr",
            path: null,
            pathStartOffset: 0,
            pathSide: "left",
            pathAlign: "baseline",
            minWidth: 20,
            splitByGrapheme: false,
          },
        ],
        background: "#eee",
      }; */
      // send json to database
    }
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
              {activeTab === "Text" && (
                <div className="elements">
                  <h1>Adaugati text</h1>
                  <div
                    className="elementsContainer text bold"
                    onClick={() => addText(canvas, "Adauga un titlu", 25)}
                  >
                    Adauga un titlu
                  </div>
                  <div
                    className="elementsContainer text semi-bold"
                    onClick={() => addText(canvas, "Adauga un subtitlu", 21)}
                  >
                    Adauga un subtitlu
                  </div>
                  <div
                    className="elementsContainer text normal"
                    onClick={() => addText(canvas, "Adauga un comentariu", 15)}
                  >
                    Adauga un comentariu
                  </div>
                </div>
              )}
              {activeTab === "ColorPalette" && (
                <div className="elements">
                  <h1>Selectati o culoare</h1>
                  <div className="colorGrid">
                    <div className="colorRow">
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#000000" }}
                        onClick={() => setNewColor("#000")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#545454" }}
                        onClick={() => setNewColor("#545454")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#737373" }}
                        onClick={() => setNewColor("#737373")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#a6a6a6" }}
                        onClick={() => setNewColor("#a6a6a6")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#d9d9d9" }}
                        onClick={() => setNewColor("#d9d9d9")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#ffffff" }}
                        onClick={() => setNewColor("#ffffff")}
                      ></div>
                    </div>
                    <div className="colorRow">
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#ff1616" }}
                        onClick={() => setNewColor("#ff1616")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#ff5757" }}
                        onClick={() => setNewColor("#ff5757")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#ff66c4" }}
                        onClick={() => setNewColor("#ff66c4")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#cb6ce6" }}
                        onClick={() => setNewColor("#cb6ce6")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#8c52ff" }}
                        onClick={() => setNewColor("#8c52ff")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#5e17eb" }}
                        onClick={() => setNewColor("#5e17eb")}
                      ></div>
                    </div>
                    <div className="colorRow">
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#03989e" }}
                        onClick={() => setNewColor("#03989e")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#00c2cb" }}
                        onClick={() => setNewColor("#00c2cb")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#5ce1e6" }}
                        onClick={() => setNewColor("#5ce1e6")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#38b6ff" }}
                        onClick={() => setNewColor("#38b6ff")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#5271ff" }}
                        onClick={() => setNewColor("#5271ff")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#004aad" }}
                        onClick={() => setNewColor("#004aad")}
                      ></div>
                    </div>
                    <div className="colorRow">
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#008037" }}
                        onClick={() => setNewColor("#008037")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#7ed957" }}
                        onClick={() => setNewColor("#7ed957")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#c9e265" }}
                        onClick={() => setNewColor("#c9e265")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#ffde59" }}
                        onClick={() => setNewColor("#ffde59")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#ffbd59" }}
                        onClick={() => setNewColor("#ffbd59")}
                      ></div>
                      <div
                        className="colorCell"
                        style={{ backgroundColor: "#ff914d" }}
                        onClick={() => setNewColor("#ff914d")}
                      ></div>
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
            <div className="activeObjectSettings">
              <div className="color"></div>

              {activeObject && activeObject.get("type") === "rect" && (
                <div
                  className="changeColor"
                  style={{
                    backgroundColor: `${currentObjectColor}`,
                  }}
                  onClick={() => setActiveTab("ColorPalette")}
                ></div>
              )}
              {activeObject && activeObject.get("type") === "circle" && (
                <div
                  className="changeColor"
                  style={{
                    backgroundColor: `${currentObjectColor}`,
                  }}
                  onClick={() => setActiveTab("ColorPalette")}
                ></div>
              )}
              {activeObject && activeObject.get("type") === "textbox" && (
                <div className="fontDetails">
                  <div className="box">
                    <div
                      className="left"
                      onClick={() =>
                        setCurrentObjectFontSize(currentObjectFontSize - 1)
                      }
                    >
                      -
                    </div>
                    <div className="size">{currentObjectFontSize}</div>
                    <div
                      className="right"
                      onClick={() =>
                        setCurrentObjectFontSize(currentObjectFontSize + 1)
                      }
                    >
                      +
                    </div>
                  </div>

                  <div
                    className="changeColor"
                    style={{
                      backgroundColor: `${currentObjectColor}`,
                    }}
                    onClick={() => setActiveTab("ColorPalette")}
                  ></div>

                  <div></div>

                  <select name="cars" id="cars" className="fontFamily">
                    {fonts.map((f) => (
                      <option
                        key={f}
                        value={f}
                        onClick={() => setCurrentObjectFontFamily(f)}
                        selected={f === currentObjectFontFamily ? true : ""}
                      >
                        {f}
                      </option>
                    ))}
                  </select>

                  <div className="divider"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="alignText"
                    onClick={alignText}
                  >
                    <defs>
                      <path
                        id="_310417673__a"
                        d="M3.75 5.25h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5zm0 4h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5z"
                      ></path>
                    </defs>
                    <use
                      fill="currentColor"
                      xlinkHref="#_310417673__a"
                      fillRule="evenodd"
                    ></use>
                  </svg>
                </div>
              )}
            </div>
            <div style={{ display: "flex", columnGap: "20px" }}>
              <div className="deleteActiveObjButton" onClick={handleSaveDesign}>
                Save
              </div>
              <div className="deleteActiveObjButton" onClick={handleDelete}>
                Delete
              </div>
            </div>
          </div>
          <div className="editorContainerInnerForeground">
            <div
              className="canvasWrapper"
              onMouseMove={resize}
              onMouseDown={() => setMouseDown(!mouseDown)}
              onMouseUp={() => setMouseUp(!mouseUp)}
            >
              <NewDesign canvas={canvas} />
            </div>
            <div className="zoomContainer">
              <div onClick={() => zoomCanvas(0.25)}>25%</div>
              <div onClick={() => zoomCanvas(0.5)}>50%</div>
              <div onClick={() => zoomCanvas(0.75)}>75%</div>
              <div onClick={() => zoomCanvas(1)}>100%</div>
              <div onClick={() => zoomCanvas(2)}>200%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorContainer;
