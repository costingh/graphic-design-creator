const express = require("express");
const router = express();
const Design = require("../models/Design");

// create a design
router.post("/:width/:height", async (req, res) => {
  const newDesign = new Design(req.body);

  try {
    const savedDesign = await newDesign.save();
    res.status(200).json(savedDesign);
  } catch (err) {
    res.status(500).json(err);
  }
});
/* 
//update a design
router.put('/:id', async(req, res) =>{
    try {
        const design = await Design.findById(req.params.id);
        if(design.userId === req.body.userId) {
            await design.updateOne({$set:req.body});
            res.status(200).json('The design has been updated');
        } else {
            res.status(403).json('You can only update your design!');
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

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

// like a design
router.put('/:id/like', async(req, res) =>{
    try {
        // Like a design
        const design = await Design.findById(req.params.id);
        if(!design.likes.includes(req.body.userId)) {
            await design.updateOne({$push: { likes: req.body.userId } });
            res.status(200).json('The design has been liked');
        } else {
            // Dislike a design
            await design.updateOne({$pull: { likes: req.body.userId } });
            res.status(403).json('Design disliked!');
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

// get a design
router.get('/:id', async(req, res) =>{
    try {
        const design = await Design.findById(req.params.id);
        res.status(200).json(design);
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
