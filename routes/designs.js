const express = require("express");
const router = express();
const Design = require("../models/Design");
const User = require("../models/User");

// create a design
router.post("/:width/:height/:unit", async (req, res) => {
  // create design config
  // if the unit is in inches and needs to be converted to pixels
  const designConfig = {
    width: req.params.unit === "px" ? req.params.width : req.params.width * 96,
    height:
      req.params.unit === "px" ? req.params.height : req.params.height * 96,
    unit: "px",
    email: req.body.email,
    name: req.body.name,
    json: req.body.json,
    isDeleted: false,
  };

  const newDesign = new Design(designConfig);

  try {
    const savedDesign = await newDesign.save();
    res.json({
      ...savedDesign,
      id: savedDesign._id,
      status: 200,
    });
  } catch (err) {
    res.json({
      error: err,
      status: 500,
    });
  }
});

// get a design
router.get("/:id", async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    res.json({
      design: design,
      status: 200,
    });
  } catch (err) {
    res.json({
      error: err,
      status: 500,
    });
  }
});

// get all designs
router.get("/getDesigns/all", async (req, res) => {
  try {
    const designs = await Design.find();

    res.status(200).json(designs);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a design
router.put("/:id", async (req, res) => {
  /* console.log(JSON.stringify(req.body)); */
  try {
    const design = await Design.findById(req.params.id);
    await design.updateOne({ $set: { json: JSON.stringify(req.body) } });

    res.status(200).json("The design has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all designs of a user
router.get("/getDesigns/:email", async (req, res) => {
  try {
    const designs = await Design.find({ email: req.params.email });
    res.status(200).json(designs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a design (move it in trash)
router.put("/delete-design/:id", async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    await design.updateOne({ $set: { isDeleted: true } });

    res.status(200).json("The design has been moved to trash");
  } catch (err) {
    res.status(500).json(err);
  }
});

/* 

// delete a design
router.delete('/:id', async(req, res) =>{
    try {
        const design = await Design.findById(req.params.id);
        if(design.userId === req.body.userId) {
            await design.deleteOne();
            res.status(200).json('The design has been deleted');
        } else {
            res.status(403).json('You can only delete your design!');
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

// get all designs
router.get('/timeline/:userId', async(req, res) =>{
    try {
        const currentUser = await User.findById(req.params.userId);
        const userDesigns = await Design.find({ userId: currentUser._id });
        const friendDesigns = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Design.find({ userId: friendId });
            })
        );

        res.status(200).json(userDesigns.concat(...friendDesigns));
    } catch(err) {
        res.status(500).json(err);
    }
})

// get all designs of a user
router.get('/profile/:username', async(req, res) =>{
    try {
        const user = await User.findOne({username: req.params.username});
        const designs = await Design.find({userId: user._id});
        res.status(200).json(designs);
    } catch(err) {
        res.status(500).json(err);
    }
}) */

module.exports = router;
