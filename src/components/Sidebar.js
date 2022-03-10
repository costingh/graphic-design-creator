import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";

const SIDEBAR_CONFIG = [
  {
    name: "Recommended for you",
    link: "",
    path: "M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h18v-10h3zm-5 8h-14v-10.26l7-6.912 7 6.99v10.182zm-5-1h-4v-6h4v6z",
  },
  {
    name: "Explore",
    link: "explore",
    path: "M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z",
  },
  {
    name: "Folders",
    link: "folders",
    path: "M6.083 4c1.38 1.612 2.578 3 4.917 3h11v13h-20v-16h4.083zm.917-2h-7v20h24v-17h-13c-1.629 0-2.305-1.058-4-3z",
  },
  {
    name: "Upload",
    link: "upload",
    path: "M12 5c3.453 0 5.891 2.797 5.567 6.78 1.745-.046 4.433.751 4.433 3.72 0 1.93-1.57 3.5-3.5 3.5h-13c-1.93 0-3.5-1.57-3.5-3.5 0-2.797 2.479-3.833 4.433-3.72-.167-4.218 2.208-6.78 5.567-6.78zm0-2c-4.006 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408-.212-3.951-3.473-7.092-7.479-7.092zm4 10h-3v4h-2v-4h-3l4-4 4 4z",
  },
  {
    name: "Trash",
    link: "trash",
    path: "M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-9 4c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm-2-7h-4v1h4v-1z",
  },
];

function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.location.href.split("/").includes("explore")) setActiveIndex(1);
    else if (window.location.href.split("/").includes("folders"))
      setActiveIndex(2);
    else if (window.location.href.split("/").includes("upload"))
      setActiveIndex(3);
    else if (window.location.href.split("/").includes("trash"))
      setActiveIndex(4);
    else setActiveIndex(0);
  }, []);

  const handleActiveRoute = (index) => {
    window.location.href = `/dashboard/${SIDEBAR_CONFIG[index].link}`;
  };

  return (
    <div className="Sidebar">
      {SIDEBAR_CONFIG.map((c, index) => (
        <div
          onClick={() => handleActiveRoute(index)}
          className={`sidebarListItem ${activeIndex === index && "active"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d={c.path} />
          </svg>
          <p>{c.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
