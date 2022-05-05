import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";

const designOptions = [
  {
    label: "Poster",
    width: 18,
    height: 24,
    unit: "in",
    svg: "M24 22h-24v-20h24v20zm-1-19h-22v18h22v-18zm-1 16h-19l4-7.492 3 3.048 5.013-7.556 6.987 12zm-11.848-2.865l-2.91-2.956-2.574 4.821h15.593l-5.303-9.108-4.806 7.243zm-4.652-11.135c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5zm0 1c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z",
  },
  {
    label: "Facebook Post",
    width: 940,
    height: 788,
    unit: "px",
    svg: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
  },
  {
    label: "Facebook Cover",
    width: 820,
    height: 312,
    unit: "px",
    svg: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
  },
  {
    label: "Instagram Post",
    width: 1080,
    height: 1080,
    unit: "px",
    svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Presentation",
    width: 1920,
    height: 1080,
    unit: "px",
    svg: "M16.488 20l3.414 4h-2.627l-3.42-4h2.633zm-5.488 4h2v-4h-2v4zm-6.918 0h2.627l3.42-4h-2.633l-3.414 4zm4.918-18v7l7-3.398-7-3.602zm13-3v13h1v2h-22v-2h1v-13h-1v-3h22v3h-1zm-2 0h-16v13h16v-13z",
  },
  {
    label: "Business Card",
    width: 3.5,
    height: 2,
    unit: "in",
    svg: "M22 3c.53 0 1.039.211 1.414.586s.586.884.586 1.414v14c0 .53-.211 1.039-.586 1.414s-.884.586-1.414.586h-20c-.53 0-1.039-.211-1.414-.586s-.586-.884-.586-1.414v-14c0-.53.211-1.039.586-1.414s.884-.586 1.414-.586h20zm1 8h-22v8c0 .552.448 1 1 1h20c.552 0 1-.448 1-1v-8zm-15 5v1h-5v-1h5zm13-2v1h-3v-1h3zm-10 0v1h-8v-1h8zm-10-6v2h22v-2h-22zm22-1v-2c0-.552-.448-1-1-1h-20c-.552 0-1 .448-1 1v2h22z",
  },
  {
    label: "Logo",
    width: 500,
    height: 500,
    unit: "px",
    svg: "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.707 14.605l-.441-1.196s-.715.798-1.785.798c-.949 0-1.623-.825-1.623-2.145 0-1.691.852-2.296 1.691-2.296 1.209 0 1.594.784 1.924 1.787l.44 1.375c.439 1.333 1.265 2.405 3.642 2.405 1.705 0 2.859-.522 2.859-1.896 0-1.114-.633-1.691-1.814-1.966l-.879-.193c-.605-.137-.784-.384-.784-.797 0-.467.37-.742.976-.742.66 0 1.018.247 1.072.839l1.374-.165c-.11-1.237-.961-1.746-2.364-1.746-1.236 0-2.446.467-2.446 1.965 0 .935.454 1.526 1.595 1.801l.936.22c.699.165.934.453.934.852 0 .509-.494.715-1.43.715-1.389 0-1.965-.728-2.295-1.732l-.454-1.374c-.577-1.787-1.499-2.447-3.327-2.447-2.022 0-3.094 1.278-3.094 3.45 0 2.09 1.072 3.216 2.997 3.216 1.553 0 2.296-.728 2.296-.728z",
  },
];

function Navbar() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );
  const [opened1, setOpened1] = useState(false);
  const [opened2, setOpened2] = useState(false);
  const [designCreated, setDesignCreated] = useState(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  const handleOpenMenu = () => {
    setOpened1(!opened1);
  };

  const handleCustomDesign = () => {
    setOpened1(false);
    setOpened2(true);
  };

  const createDesign = async (newDesign) => {
    const res = await fetch(
      `/api/designs/${newDesign.width}/${newDesign.height}/${newDesign.unit}`,
      {
        method: "POST",
        body: JSON.stringify({
          email: loginData?.email,
          name: "Untitled",
          json: null,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    setDesignCreated(data);
  };

  const handleLogout = () => {
    if (localStorage.getItem("loginData")) {
      localStorage.removeItem("loginData");
      window.location.href = "/";
    }
  };

  if (!loginData) {
    return (window.location.href = "/");
  }

  if (designCreated?.status === 200) {
    return (window.location.href = `/design/${designCreated?.id}`);
  }

  return (
    <div className="Navbar">
      <div
        onClick={() => {
          window.location.href = "/dashboard";
        }}
        style={{
          cursor: "pointer",
          fontSize: "20px",
          color: "#fff",
          fontWeight: "600",
        }}
      >
        Home
      </div>
      <div className="right">
        <div className="button" onClick={handleOpenMenu}>
          Create Design
        </div>
        <img
          className="profileImage"
          src={loginData.picture}
          alt=""
          onClick={() => setIsDropdownOpened(!isDropdownOpened)}
        />

        <div
          className="profileDropdown"
          style={{ display: `${isDropdownOpened ? "block" : "none"}` }}
        >
          <p>{loginData.email}</p>
          <p onClick={handleLogout}>Logout</p>
        </div>
      </div>
      <div className={`absolute ${opened2 && "opened"}`}>
        <div
          onClick={() => {
            setOpened2(false);
            setOpened1(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
              transform: `${opened2 ? "rotate(45deg)" : "rotate(0deg)"}`,
            }}
          >
            <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" />
          </svg>
          <p>Custom Dimensions</p>
        </div>
        <div
          style={{
            display: "flex",
            columnGap: "20px",
            width: "100%",
            alignItems: "center",
          }}
        >
          <input
            type="number"
            id="width"
            name="width"
            step="1"
            placeholder="Width"
            style={{
              width: "40%",
              padding: "9px 7px",
              borderRadius: "5px",
              appearance: "none",
              border: "1px solid #ccc",

              focus: "1px solid red",
            }}
          />
          <input
            type="number"
            id="height"
            name="height"
            step="1"
            placeholder="Width"
            style={{
              width: "40%",
              padding: "9px 7px",
              borderRadius: "5px",
              appearance: "none",
              border: "1px solid #ccc",

              focus: "1px solid red",
            }}
          />
          <span>px</span>
        </div>
        <div className="createDesignButton">
          <p style={{ margin: "0px auto" }}>Create Design</p>
        </div>
      </div>
      <div className={`absolute ${opened1 && "opened"}`}>
        <div onClick={handleCustomDesign}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" />
          </svg>
          <p>Custom Dimensions</p>
        </div>
        {designOptions.map((option) => (
          <div onClick={() => createDesign(option)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d={option.svg} />
            </svg>
            <p>
              {option.label}{" "}
              <span>{`${option.width} x ${option.height} ${option.unit}`}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
