import React from "react";

function Folder({ folder }) {
  return (
    <div className="folder">
      <div className="folderIconWrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d={folder.svgPath} />
        </svg>
      </div>
      <p>{folder.folderName}</p>
    </div>
  );
}

export default Folder;
