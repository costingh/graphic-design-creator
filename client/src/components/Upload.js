import React, { useState, useEffect } from "react";

import "../styles/Upload.css";

function Upload() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );
  const [uploadedImages, setUploadedImages] = useState([]);
  const [openImageUploader, setOpenImageUploader] = useState(false);

  useEffect(() => {
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
  }, [loginData]);

  return (
    <div className="upload-container">
      <div className="upload-navbar">
        <h1>Your images</h1>
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "10px",
            padding: "10px 25px",
          }}
          onClick={() => setOpenImageUploader(true)}
        >
          Upload image{" "}
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path d="M11.492 10.172l-2.5 3.064-.737-.677 3.737-4.559 3.753 4.585-.753.665-2.5-3.076v7.826h-1v-7.828zm7.008 9.828h-13c-2.481 0-4.5-2.018-4.5-4.5 0-2.178 1.555-4.038 3.698-4.424l.779-.14.043-.789c.185-3.448 3.031-6.147 6.48-6.147 3.449 0 6.295 2.699 6.478 6.147l.044.789.78.14c2.142.386 3.698 2.246 3.698 4.424 0 2.482-2.019 4.5-4.5 4.5m.978-9.908c-.212-3.951-3.472-7.092-7.478-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.522-5.408" />
          </svg>
        </div>
      </div>
      {openImageUploader ? (
        <form
          className="imageUploadArea"
          action="/api/images/store"
          method="POST"
          enctype="multipart/form-data"
        >
          <input
            style={{ display: "none" }}
            type="text"
            id="email"
            placeholder="Email"
            value={loginData?.email}
            name="email"
          />
          <label
            for="image"
            className="imageLabel"
            style={{ display: "flex", flexDirection: "column", rowGap: "50px" }}
          >
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
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
            <button type="submit">Submit</button>
            <div
              style={{
                border: "1px solid #222",
                padding: "6px 25px",
                borderRadius: "10px",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => setOpenImageUploader(false)}
            >
              Close
            </div>
          </div>
        </form>
      ) : (
        <div className="uploaded-images">
          {uploadedImages.length === 0
            ? "No images yet..."
            : uploadedImages.map((i) => (
                <div className="imageWrapper" key={i._id}>
                  <img src={i.url} alt="" style={{ height: "300px" }} />
                  <div className="imageDeleteOverlay">
                    <div>Delete Image</div>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}

export default Upload;
