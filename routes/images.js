const express = require("express");
const router = express();
const Image = require("../models/Image");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

router.get("/retrieve/:email", (req, res) => {
  Image.find({ email: req.params.email }, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.status(200).json({
        images: items,
      });
    }
  });
});

router.post("/store", upload.single("image"), (req, res, next) => {
  const obj = {
    name: "imageName",
    desc: "description",
    email: req.body.email,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  Image.create(obj, (err, item) => {
    if (err) {
      res.status(500).json({
        message: "Image wasn't uploaded successfully!",
      });
    } else {
      item.save();
      res.redirect(req.body.redirect ? req.body.redirect : "/dashboard/upload");
    }
  });
});
router.post("/store", upload.single("image"), (req, res, next) => {
  const obj = {
    name: "imageName",
    desc: "description",
    email: req.body.email,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  Image.create(obj, (err, item) => {
    if (err) {
      res.status(500).json({
        message: "Image wasn't uploaded successfully!",
      });
    } else {
      item.save();
      res.redirect(req.body.redirect ? req.body.redirect : "/dashboard/upload");
    }
  });
});

router.delete("/delete/:id", (req, res, next) => {
  Image.deleteOne({ _id: req.params.id }, function (err) {
    if (err)
      res.status(500).json({
        message: "Error when deleting image!",
      });
    else
      res.status(200).json({
        message: "Image was deleted successfully!",
      });
  });
});

module.exports = router;
