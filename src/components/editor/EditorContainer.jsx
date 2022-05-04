import React, { useState, useEffect } from "react";

import { fabric } from "fabric";
import { createApi } from "unsplash-js";

import Navbar from "../Navbar";
import NewDesign from "../NewDesign";

import imagesFromUnsplashMockup from "../../utils/utils";

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
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

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
  const [images, setImages] = useState(imagesFromUnsplashMockup);
  const [inputValue, setInputvalue] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showUploadImage, setShowUploadImage] = useState(false);

  useEffect(() => {
    // setCanvas(initCanvas());

    const url = window.location.href.split("/");
    const designId = url[url.length - 1];
    setCurrentDesignID(designId);
    const getDesign = async () => {
      const res = await fetch(`/api/designs/${designId}`);
      const data = await res.json();
      setData(data);

      setCustomHeight(data?.design?.height);
      setCustomWidth(data?.design?.width);
    };

    getDesign();
  }, []);

  const saveFile = async (blob) => {
    const a = document.createElement("a");
    a.download = "my-file.txt";
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const fetchImages = () => {
    const unsplash = createApi({
      accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
    });

    unsplash.search
      .getPhotos({
        query: inputValue,
        page: 1,
        perPage: 10,
      })
      .then((result) => {
        if (result.errors) {
          // handle error here
          console.log("error occurred: ", result.errors[0]);
        } else {
          const feed = result.response;

          // extract total and results array from response
          const { total, results } = feed;
          setImages(results);
          /* const blob = new Blob([JSON.stringify(feed, null, 2)], {
            type: "application/json",
          });
          saveFile(blob); */
          // handle success here
          console.log(`received ${results.length} photos out of ${total}`);
          console.log("first photo: ", results[0]);
        }
      });
  };

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
      preserveObjectStacking: true,
      selectionLineWidth: 2,
      cornerColor: "#00d9e1",
      borderColor: "#00d9e1",
    });

  const addRectangle = (canvasRefference) => {
    const rect = new fabric.Rect({
      left: customWidth / 2,
      top: customHeight / 2,
      height: 150,
      width: 150,
      fill: "#c8d1d9",
      cornerColor: "#00d9e1",
      borderColor: "#00d9e1",
      borderScaleFactor: 2,
    });
    canvasRefference.add(rect);

    /* canvas.item(numberOfDrawings).set({
      borderColor: "rgb(0, 166, 255)",
      cornerColor: "rgb(6, 137, 208)",
      cornerSize: 6,
      transparentCorners: false,
    });
    numberOfDrawings += 1; */

    canvasRefference.renderAll();
  };

  const addRoundedRectangle = (canvasRefference) => {
    const rect = new fabric.Rect({
      fill: "#c8d1d9",
      left: customWidth / 2,
      top: customHeight / 2,
      width: 150,
      height: 150,
      rx: 15,
      ry: 15,
      objectCaching: false,
      cornerColor: "#00d9e1",
      borderColor: "#00d9e1",
      borderScaleFactor: 2,
    });
    canvasRefference.add(rect);
    canvasRefference.renderAll();
  };

  const addCircle = (canvasRefference) => {
    const circle = new fabric.Circle({
      left: customWidth / 2,
      top: customHeight / 2,
      radius: Math.min(customHeight / 2, customWidth / 2),
      fill: "#c8d1d9",
      cornerColor: "#00d9e1",
      borderColor: "#00d9e1",
      borderScaleFactor: 2,
    });
    canvasRefference.add(circle);
    /* canvas.item(numberOfDrawings).set({
      borderColor: "rgb(0, 166, 255)",
      cornerColor: "rgb(6, 137, 208)",
      cornerSize: 6,
      transparentCorners: false,
    });
    numberOfDrawings += 1; */

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
      cornerColor: "#00d9e1",
      borderColor: "#00d9e1",
      borderScaleFactor: 2,
    });
    canvasRefference.add(text).setActiveObject(text);
    setActiveObject(text);
    /* canvas.item(numberOfDrawings).set({
      borderColor: "rgb(0, 166, 255)",
      cornerColor: "rgb(6, 137, 208)",
      cornerSize: 6,
      transparentCorners: false,
    });
    numberOfDrawings += 1; */

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

  useEffect(() => {
    if (activeTab === "Uploads") {
      const getAllUploadedImagesOfAuthedUser = async () => {
        const res = await fetch(`/api/images/retrieve/${loginData.email}`);
        const data = await res.json();
        let images = [];

        data.images.map((img) => {
          let b64encoded = btoa(
            String.fromCharCode.apply(null, img.img.data.data)
          );
          let datajpg = "data:image/jpg;base64," + b64encoded;

          images.push({
            _id: img._id,
            url: datajpg,
          });
        });

        console.log(images);

        setUploadedImages(images);
      };

      if (loginData) getAllUploadedImagesOfAuthedUser();
    }
  }, [activeTab, loginData]);

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

  const handleImageQueryChange = (e) => {
    setInputvalue(e.target.value);
  };

  const handleAddImageOnCanvas = (item) => {
    console.log(item);
    addImage(item.urls.small);
  };

  const addImage = (url) => {
    fabric.Image.fromURL(url, function (oImg) {
      // scale image down, and flip it, before adding it onto canvas
      // oImg.scale(0.5).set("flipX", true);
      oImg.scale(0.5).set({
        cornerColor: "#00d9e1",
        borderColor: "#00d9e1",
        borderScaleFactor: 2,
      });

      /*  oImg.scale(0.5).set({
        clipPath: new fabric.Circle({
          radius: 300,
          originX: "center",
          originY: "center",
          cornerColor: "#00d9e1",
          borderColor: "#00d9e1",
        }),
      }); */
      canvas.add(oImg);
    });

    /* canvas.item(numberOfDrawings).set({
      borderColor: "rgb(0, 166, 255)",
      cornerColor: "rgb(6, 137, 208)",
      cornerSize: 6,
      transparentCorners: false,
    });
    numberOfDrawings += 1; */

    canvas.renderAll();
  };

  const handleBringToFront = () => {
    if (canvas && activeObject) {
      /* canvas.bringForward(activeObject); */
      canvas.bringToFront(activeObject);
    }
  };

  const handleBringToBottom = () => {
    if (canvas && activeObject) {
      canvas.sendToBack(activeObject);
    }
  };
  /* 
  useEffect(() => {
    console.log(activeObject);
  }, [activeObject]); */

  // highlight object on hover
  if (canvas) {
    canvas.on("mouse:over", function (e) {
      if (!e.target) return;
      e.target._renderControls(canvas.contextTop, {
        hasControls: false,
        borderColor: "#00d9e1",
      });
      canvas.renderAll();
    });

    canvas.on("mouse:out", function (e) {
      if (!e.target) return;
      canvas.clearContext(canvas.contextTop);
      canvas.renderAll();
    });

    canvas.on("mouse:down", function (e) {
      if (!e.target) return;
      canvas.clearContext(canvas.contextTop);
      canvas.renderAll();
    });
  }

  const handleImageDelete = (id) => {
    fetch("/api/images/delete/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json()) // or res.json()
      .then((res) => {
        if (res.message === "Image was deleted successfully!") {
          setUploadedImages(uploadedImages.filter((img) => img._id !== id));
        } else alert("Error when deleting this image!");
      });
  };

  const [downloadOpened, setDownloadOpened] = useState(false);

  const downloadDesign = (fileType) => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0,
        format: fileType === "PNG" ? "png" : "jpeg",
      });
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /* drawing shapes */
  const regularPolygonPoints = (sideCount, radius) => {
    let sweep = (Math.PI * 2) / sideCount;
    let cx = radius;
    let cy = radius;
    let points = [];
    for (let i = 0; i < sideCount; i++) {
      let x = cx + radius * Math.cos(i * sweep);
      let y = cy + radius * Math.sin(i * sweep);
      points.push({ x: x, y: y });
    }
    return points;
  };

  const starPolygonPoints = (spikeCount, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let cx = outerRadius;
    let cy = outerRadius;
    let sweep = Math.PI / spikeCount;
    let points = [];
    let angle = 0;

    for (let i = 0; i < spikeCount; i++) {
      let x = cx + Math.cos(angle) * outerRadius;
      let y = cy + Math.sin(angle) * outerRadius;
      points.push({ x: x, y: y });
      angle += sweep;

      x = cx + Math.cos(angle) * innerRadius;
      y = cy + Math.sin(angle) * innerRadius;
      points.push({ x: x, y: y });
      angle += sweep;
    }
    return points;
  };

  const drawGeometricShape = (shapeName) => {
    let svgPath = "";
    if (shapeName === "hexagon") {
      svgPath = "M366.3,0H122.1L0,211.5L122.1,423h244.2l122.1-211.5L366.3,0z";
    } else if (shapeName === "star") {
      svgPath =
        "M71.9 1.3l19.7 40c.3.7 1 1.2 1.8 1.3l44.1 6.4c1.9.3 2.7 2.7 1.3 4l-31.9 31.1c-.6.5-.8 1.3-.7 2.1l7.5 44c.3 1.9-1.7 3.4-3.4 2.5l-39.5-20.8c-.7-.4-1.5-.4-2.2 0l-39.5 20.8c-1.7.9-3.7-.6-3.4-2.5l7.5-44c.1-.8-.1-1.5-.7-2.1L.7 53C-.7 51.6.1 49.3 2 49l44.1-6.4c.8-.1 1.4-.6 1.8-1.3l19.7-40c.9-1.7 3.4-1.7 4.3 0z";
    } else if (shapeName === "pentagon") {
      svgPath = " m95.5 475.5l-95.5-293.9 250-181.6 250 181.6-95.5 293.9h-309z";
    } else if (shapeName === "triangle") {
      svgPath = "m0 433l250-433 250 433h-500z";
    } else if (shapeName === "heart") {
      svgPath =
        "m0 129.4c0 139.3 250 309.2 250 309.2s248.9-171.1 250-309.2c0-71.3-58.1-129.4-129.4-129.4-54.8 0-102 35.1-120.6 83.3-18.6-48.2-65.8-83.3-120.6-83.3-71.3 0-129.4 58.1-129.4 129.4";
    } else if (shapeName === "squaredTriangle")
      svgPath = "M500,499.2H0V0L500,499.2z";

    let svg = new fabric.Path(svgPath, {
      fill: "#c8d1d9",
      cornerColor: "#00d9e1",
      borderColor: "#00d9e1",
      borderScaleFactor: 2,
    });
    canvas?.add(svg);
  };

  const handleSaveDesignName = async (e) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };

    const res = await fetch(
      `/api/designs/name/${data.design._id}/${e.target.value}`,
      requestOptions
    );
    const d = await res.json();
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
                  <div
                    className="elementsContainer"
                    style={{
                      flexWrap: "wrap",
                      alignContent: "flex-start",
                      height: "100%",
                      justifyContent: "space-between",
                      rowGap: "30px",
                    }}
                  >
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
                      onClick={() => addRoundedRectangle(canvas)}
                    >
                      <div className="roundedBorderSquare"></div>
                    </div>

                    {/* Triangle */}
                    <div
                      className="element"
                      onClick={() => drawGeometricShape("triangle")}
                    >
                      <svg
                        id="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        viewBox="0 0 500 433"
                      >
                        <path d="m0 433l250-433 250 433h-500z"></path>
                      </svg>
                    </div>

                    {/* hexagon */}
                    <div
                      className="element"
                      onClick={() => drawGeometricShape("hexagon")}
                    >
                      <svg
                        id="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488.4 423"
                      >
                        <path d="M366.3,0H122.1L0,211.5L122.1,423h244.2l122.1-211.5L366.3,0z"></path>
                      </svg>
                    </div>

                    {/* pentagon */}
                    <div
                      className="element"
                      onClick={() => drawGeometricShape("pentagon")}
                    >
                      <svg
                        id="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 500 475.5"
                      >
                        <path d="m95.5 475.5l-95.5-293.9 250-181.6 250 181.6-95.5 293.9h-309z"></path>
                      </svg>
                    </div>

                    {/* heart */}
                    <div
                      className="element"
                      onClick={() => drawGeometricShape("heart")}
                    >
                      <svg
                        id="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 500 438.6"
                      >
                        <path d="m0 129.4c0 139.3 250 309.2 250 309.2s248.9-171.1 250-309.2c0-71.3-58.1-129.4-129.4-129.4-54.8 0-102 35.1-120.6 83.3-18.6-48.2-65.8-83.3-120.6-83.3-71.3 0-129.4 58.1-129.4 129.4"></path>
                      </svg>
                    </div>

                    {/* star */}
                    <div
                      className="element"
                      onClick={() => drawGeometricShape("star")}
                    >
                      <svg
                        id="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 139.6 133"
                      >
                        <path d="M71.9 1.3l19.7 40c.3.7 1 1.2 1.8 1.3l44.1 6.4c1.9.3 2.7 2.7 1.3 4l-31.9 31.1c-.6.5-.8 1.3-.7 2.1l7.5 44c.3 1.9-1.7 3.4-3.4 2.5l-39.5-20.8c-.7-.4-1.5-.4-2.2 0l-39.5 20.8c-1.7.9-3.7-.6-3.4-2.5l7.5-44c.1-.8-.1-1.5-.7-2.1L.7 53C-.7 51.6.1 49.3 2 49l44.1-6.4c.8-.1 1.4-.6 1.8-1.3l19.7-40c.9-1.7 3.4-1.7 4.3 0z"></path>
                      </svg>
                    </div>

                    {/* squared triangle */}
                    <div
                      className="element"
                      onClick={() => drawGeometricShape("squaredTriangle")}
                    >
                      <svg
                        id="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 500 499.2"
                      >
                        <path d="M500,499.2H0V0L500,499.2z"></path>
                      </svg>
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
              {activeTab === "Uploads" && (
                <div className="elements" style={{ position: "relative" }}>
                  <h1>Imaginile dumneavoastra</h1>
                  <div
                    className="uploadImageBtn"
                    onClick={() => setShowUploadImage(true)}
                  >
                    Incarcati o imagine
                  </div>
                  {showUploadImage ? (
                    <form
                      className="imageUploadArea"
                      action="/api/images/store"
                      method="POST"
                      enctype="multipart/form-data"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <input
                        style={{ display: "none" }}
                        type="text"
                        id="email"
                        placeholder="Email"
                        value={loginData?.email}
                        name="email"
                      />

                      <input
                        style={{ display: "none" }}
                        type="text"
                        id="redirect"
                        placeholder="redirect"
                        value={`/design/${currentDesignID}`}
                        name="redirect"
                      />

                      <label
                        for="image"
                        className="imageLabel"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: "50px",
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          style={{ margin: "0 auto", transform: "scale(3)" }}
                        >
                          <path d="M9 16h-8v6h22v-6h-8v-1h9v8h-24v-8h9v1zm11 2c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm-7.5 0h-1v-14.883l-4.735 5.732-.765-.644 6.021-7.205 5.979 7.195-.764.645-4.736-5.724v14.884z" />
                        </svg>

                        <input
                          type="file"
                          id="image"
                          name="image"
                          defaultValue=""
                          required
                        />
                      </label>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          columnGap: "30px",
                        }}
                      >
                        <button
                          type="submit"
                          style={{ background: "#ccc", color: "#222" }}
                        >
                          Submit
                        </button>
                        <div
                          style={{
                            border: "1px solid #ccc",
                            padding: "6px 25px",
                            borderRadius: "10px",
                            fontSize: "15px",
                            cursor: "pointer",
                            color: "#ccc",
                          }}
                          onClick={() => setShowUploadImage(false)}
                        >
                          Close
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div
                      className="hideScorllbar"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        columnGap: "20px",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        padding: "40px 0px",
                        overflowY: "auto",
                        height: "calc(100% - 23px - 35px)",
                        position: "relative",
                      }}
                    >
                      {uploadedImages.map((i) => (
                        <div
                          key={i._id}
                          style={{ position: "relative" }}
                          className="overlayImg"
                        >
                          <img
                            src={i.url}
                            alt=""
                            style={{ width: "150px", cursor: "pointer" }}
                            onClick={() => addImage(i.url)}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              background: "#aaa",
                              width: "30px",
                              height: "30px",
                              borderRadius: "5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              zIndex: -1,
                            }}
                            onClick={() => handleImageDelete(i._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="#222"
                              style={{ transform: "scale(0.8)" }}
                            >
                              <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === "Photos" && (
                <div className="elements" style={{ position: "relative" }}>
                  <h1>Imagini</h1>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: "5px",
                      border: "1px solid #000",
                      padding: "4px 15px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search Images"
                      style={{
                        width: "100%",
                        background: "transparent",
                        appearance: "none",
                        border: "none",
                        color: "#ccc",
                        fontSize: "15px",
                        outline: "none",
                      }}
                      onChange={(e) => handleImageQueryChange(e)}
                    />
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#ccc"
                        style={{ cursor: "pointer" }}
                        onClick={fetchImages}
                      >
                        <path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z" />
                      </svg>
                    </div>
                  </div>
                  <div
                    className="hideScorllbar"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      columnGap: "20px",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      padding: "40px 0px",
                      overflowY: "auto",
                      height: "calc(100% - 23px - 35px)",
                      position: "relative",
                    }}
                  >
                    {images &&
                      images.map((feedItem) => (
                        <div key={feedItem.id}>
                          <img
                            src={feedItem.urls.thumb}
                            alt={feedItem.alt_description}
                            style={{ width: "150px", cursor: "pointer" }}
                            onClick={() => handleAddImageOnCanvas(feedItem)}
                          />
                        </div>
                      ))}
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

              {activeObject &&
                (activeObject.get("type") === "rect" ||
                  activeObject.get("type") === "path") && (
                  <div
                    className="changeColor"
                    style={{
                      backgroundColor: `${currentObjectColor}`,
                    }}
                    onClick={() => {
                      setActiveTab("ColorPalette");
                      setOpenDrawer(true);
                    }}
                  ></div>
                )}
              {activeObject && activeObject.get("type") === "circle" && (
                <div
                  className="changeColor"
                  style={{
                    backgroundColor: `${currentObjectColor}`,
                  }}
                  onClick={() => {
                    setActiveTab("ColorPalette");
                    setOpenDrawer(true);
                  }}
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
              {activeObject && (
                <div className="ActiveObjIndexContainer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    onClick={handleBringToFront}
                  >
                    <path
                      fill="#222"
                      d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25zM15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8L9 10.49v1.67L4.4 14.4l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z"
                    ></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    onClick={handleBringToBottom}
                  >
                    <path
                      fill="#222"
                      d="M12.75 18.12V9.75a.75.75 0 1 0-1.5 0v8.37l-2.26-2.25a.75.75 0 0 0-1.06 1.06l2.83 2.82c.68.69 1.79.69 2.47 0l2.83-2.82A.75.75 0 0 0 15 15.87l-2.25 2.25zM15 11.85v1.67l6.18-3.04a1 1 0 0 0 0-1.79l-7.86-3.86a3 3 0 0 0-2.64 0L2.82 8.69a1 1 0 0 0 0 1.8L9 13.51v-1.67L4.4 9.6l6.94-3.42c.42-.2.9-.2 1.32 0L19.6 9.6 15 11.85z"
                    ></path>
                  </svg>
                </div>
              )}
              {/* <div className="deleteActiveObjButton" onClick={handleSaveDesign}>
                
              </div> */}
              <input
                type="text"
                defaultValue={data?.design.name}
                style={{
                  borderRadius: "5px",
                  border: "1px solid #222",
                  padding: "0px 10px",
                  fontWeight: 500,
                  fontSize: "15px",
                }}
                onChange={handleSaveDesignName}
              />
              <div className="deleteActiveObjButton" onClick={handleSaveDesign}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171zm-3 10.171h-14v1h14v-1zm0 2h-14v1h14v-1zm0 2h-14v1h14v-1z" />
                </svg>{" "}
                <p>Save</p>
              </div>
              <div className="deleteActiveObjButton" onClick={handleDelete}>
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M9 3h6v-1.75c0-.066-.026-.13-.073-.177-.047-.047-.111-.073-.177-.073h-5.5c-.066 0-.13.026-.177.073-.047.047-.073.111-.073.177v1.75zm11 1h-16v18c0 .552.448 1 1 1h14c.552 0 1-.448 1-1v-18zm-10 3.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm5 0c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm8-4.5v1h-2v18c0 1.105-.895 2-2 2h-14c-1.105 0-2-.895-2-2v-18h-2v-1h7v-2c0-.552.448-1 1-1h6c.552 0 1 .448 1 1v2h7z" />
                </svg>{" "}
                Delete
              </div>
              <div style={{ position: "relative" }}>
                <div
                  className="btn"
                  onClick={() => setDownloadOpened(!downloadOpened)}
                >
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M11.5 8h1v7.826l2.5-3.076.753.665-3.753 4.585-3.737-4.559.737-.677 2.5 3.064v-7.828zm7 12h-13c-2.481 0-4.5-2.019-4.5-4.5 0-2.178 1.555-4.038 3.698-4.424l.779-.14.043-.79c.185-3.447 3.031-6.146 6.48-6.146 3.449 0 6.295 2.699 6.479 6.146l.043.79.78.14c2.142.386 3.698 2.246 3.698 4.424 0 2.481-2.019 4.5-4.5 4.5m.979-9.908c-.212-3.951-3.473-7.092-7.479-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408" />
                  </svg>
                  <p>Download</p>
                </div>
                {downloadOpened && (
                  <div className="downloadOpened">
                    <p>Tip fisier</p>
                    <div
                      className="fileTypeOption"
                      onClick={() => downloadDesign("PNG")}
                    >
                      <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      >
                        <path d="M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-1 16h-19l4-7.492 3 3.048 5.013-7.556 6.987 12zm-11.848-2.865l-2.91-2.956-2.574 4.821h15.593l-5.303-9.108-4.806 7.243zm-4.652-11.135c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm0 1c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z" />
                      </svg>
                      <div>
                        <p>PNG</p>
                        <p>High quality image</p>
                      </div>
                    </div>
                    <div
                      className="fileTypeOption"
                      onClick={() => downloadDesign("JPG")}
                    >
                      <svg
                        width="24"
                        height="24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      >
                        <path d="M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-1 16h-19l4-7.492 3 3.048 5.013-7.556 6.987 12zm-11.848-2.865l-2.91-2.956-2.574 4.821h15.593l-5.303-9.108-4.806 7.243zm-4.652-11.135c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm0 1c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z" />
                      </svg>
                      <div>
                        <p>JPG</p>
                        <p>Image with low file size</p>
                      </div>
                    </div>
                  </div>
                )}
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
