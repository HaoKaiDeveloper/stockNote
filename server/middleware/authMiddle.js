const User = require("../models/userModels");
const { verifyJWT } = require("../lib/jwtHelpers");

async function authMiddleWare(req, res, next) {
  const cookieToken = req.cookies.token;
  let userId;
  if (!cookieToken) {
    return res.status(401).json({ msg: "token失效" });
  }

  userId = verifyJWT(cookieToken)._id;

  if (!userId) {
    return res.status(401).json({ msg: "token失效" });
  }
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(401).json({ msg: "token失效" });
  }

  req.user = user;
  next();
}

module.exports = authMiddleWare;
