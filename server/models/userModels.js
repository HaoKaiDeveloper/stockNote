const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "new user",
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  picture: {
    type: String,
  },
  password: {
    type: String,
  },
  googleLogin: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailVerify: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationCode: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
