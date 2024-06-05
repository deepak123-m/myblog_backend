const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

router.post("/createuser", async (req, res) => {
  let success = false;
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email alredy exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      userName: req.body.userName,
      password: secPass,
      image: req.body.image,
    });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, "DEEPAKSTWITTERCLONE$");
    success = true;

    res.json({ success, authtoken });
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.post("/login", async (req, res) => {
  let success = false;

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res
        .status(400)
        .json({
          success,
          error: "Please try to login with correct credentials",
        });
    }
    const data = {
      user: {
        id: user.id,
      },
    };

    const authtoken = jwt.sign(data, "DEEPAKSTWITTERCLONE$");
    success = true;
    res.json({ success, authtoken, user });
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.get("/getalluser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.post("/follow/:id", async (req, res) => {
  try {
    const userid = req.params.id;
    const flwrsUser = req.body.id;
    await User.findByIdAndUpdate(
      userid,
      { $push: { following: req.body.id } },
      { upsert: true, new: true }
    );
    await User.findByIdAndUpdate(
      flwrsUser,
      { $push: { followers: userid } },
      { upsert: true, new: true }
    );
    const result = await User.findById(userid);
    res.send(result.following);
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

module.exports = router;
