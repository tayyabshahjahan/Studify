const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userScheme = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "User must have a first name"],
  },
  lastName: {
    type: String,
    required: [true, "User must have a last name"],
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
  },
  docsUploaded: {
    type: Number,
    default: 0,
  },
  totalQuizesCompleted: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

userScheme.plugin(passportLocalMongoose);
const User = mongoose.model("User", userScheme);

module.exports = User;
