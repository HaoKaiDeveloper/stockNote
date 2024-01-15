const router = require("express").Router();
const {
  googleLogin,
  login,
  register,
  verifyEmail,
  getUserInfo,
  editUserInfo,
  userLogout,
} = require("../controllers/userController");

const authMiddleWare = require("../middleware/authMiddle");

router.post("/googleLogin", googleLogin);

router.post("/login", login);

router.post("/register", register);

router.post("/verifyEmail", verifyEmail);

router.get("/getUserInfo", authMiddleWare, getUserInfo);

router.put("/editUserInfo", authMiddleWare, editUserInfo);

router.post("/userLogout", userLogout);
module.exports = router;
