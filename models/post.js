const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const postschema = new Schema({
  //user is defined because only that particular user can have his notes access isiliya using foreign key
  user: {
    type: mongoose.Schema.Types.ObjectId, //FOREIGN KEY
    ref: "user", //We can see this in User.js last line
  },

  image: {
    type: String,
  },
  title:{
    type:String,
  },
  profileimage: {
    type: String,
  },
  description: {
    type: String,
  },
  name: {
    type: String,
  },
  userName: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },
  
  retweets: {
    type: Array,
    default: [],
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("post", postschema);
