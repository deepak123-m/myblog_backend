const express = require("express");
const router = express.Router();
const User = require("../models/user");
const comment = require("../models/comment");
const Posts = require("../models/post");
const axios = require("axios");
router.get("/getpost", async (req, res) => {
  try {
    const resp = await Posts.find({});

    res.json(resp);
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.post("/addpost", async (req, res) => {
  try {
    const post = await new Posts({
      user: req.body.user,
      name: req.body.name,
      userName: req.body.userName,
      image: req.body.image,
      description: req.body.description,
      profileimage: req.body.profileimage,
      title: req.body.title,
    });

    let hookUser = await User.findById(req.body.user);
    if (!hookUser) {
      console.log("No User Found ...");
    }
    console.log("hookUserrrrrrrrrrrrr............");
    console.log(hookUser);
    if (hookUser.followers.length !== 0) {
      for (let a of hookUser.followers) {
        let findHook = await User.findById(a);
        if (findHook.hook !== "") {
          console.log("Hokkk User Founddddddddd");
          console.log(findHook.hook);
          axios
            .post(findHook.hook, {
              text: `New Blog Posted By ${req.body.name}`,
            })
            .then(() => {
              console.log("lucid-success");
            })
            .catch(() => {
              console.log("failed lucid");
            });
        }
      }
    }

    const savepost = await post.save();
    res.json(savepost);
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.put("/updatepostlike/:id", async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.body.user;

    const post = await Posts.findById(postID);
    if (post.likes.includes(userID)) {
      const finalPost = await Posts.findByIdAndUpdate(postID, {
        $pull: { likes: userID },
      });
      res.json(finalPost);
    } else {
      const finalPost = await Posts.findByIdAndUpdate(postID, {
        $push: { likes: userID },
      });
      res.json(finalPost);
    }
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.post("/comment/new", async (req, res) => {
  try {
    console.log("nameee");
    console.log(req.body);
    const commentdata = await new comment({
      name: req.body.name,
      postId: req.body.postId,
      comments: req.body.comments,
    });
    commentdata.save();
    const hookUser = await User.findById(req.body.userid);
    if (hookUser.hook !== "") {
      axios.post(hookUser.hook, {
        text: `New Comment was added to your Blog "${req.body.title}" by Author: ${req.body.name}`,
      });
    }
    res.status(200).json("Comment saved successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/comments", async (req, res) => {
  try {
    const comments = await comment.find({});

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/updatepostretweet/:id", async (req, res) => {
  try {
    const postID = req.params.id;
    const userID = req.body.user;

    const post = await Posts.findById(postID);
    if (post.retweets.includes(userID)) {
      const finalPost = await Posts.findByIdAndUpdate(postID, {
        $pull: { retweets: userID },
      });
      res.json(finalPost);
    } else {
      const finalPost = await Posts.findByIdAndUpdate(postID, {
        $push: { retweets: userID },
      });
      res.json(finalPost);
    }
  } catch (error) {
    res.status(500).send("Internal Server error occured");
  }
});

router.delete("/deletepost/:id", async (req, res) => {
  try {
    let post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Not Found");
    }

    post = await Posts.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", post: post });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
