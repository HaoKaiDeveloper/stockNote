const jwt = require("jsonwebtoken");

function createToken(value) {
  return jwt.sign(value, process.env.TOKEN_KEY);
}

function verifyJWT(token) {
  let result = { _id: "" };
  const res = jwt.verify(token, process.env.TOKEN_KEY);
  if (res._id) {
    result = { ...result, ...res };
  }
  return result;
}

module.exports = { createToken, verifyJWT };
