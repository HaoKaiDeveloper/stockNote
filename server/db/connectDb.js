const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("connect DB seccess"))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
