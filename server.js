const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const MongoClient = require("mongodb").MongoClient;
const User = require("./models/User");
const mongoose = require("mongoose");
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// routes
const designRoutes = require("./routes/designs");
const imageRoutes = require("./routes/images");

dotenv.config();
const app = express();
app.use(express.json());

const users = [];

mongoose.connect(
  "mongodb+srv://costin:parola@cluster0.mdcxp.mongodb.net/graphic-design-creator?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to Mongo");
  }
);

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });

  try {
    // see if user exists
    const user2 = await User.findOne({ email: email });
    console.log(email);

    console.log(user2);
    if (!user2) {
      // if user doesnt exisst, create new user
      const newUser = new User({
        username: name,
        email: email,
        profilePicture: picture,
      });

      // save user and send response
      const user = await newUser.save();
    }
  } catch (err) {
    console.log(err);
  }

  res.status(201);
  res.json({ name, email, picture });
});

// routes
app.use("/api/designs", designRoutes);
app.use("/api/images", imageRoutes);

/* app.use(express.static(path.join(__dirname, "/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/build/index.html"))
); */

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is ready at http://localhost:${process.env.PORT || 5000}`
  );
});
