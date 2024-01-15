const User = require("../models/userModels");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "haokai@intella.co",
    pass: "micchjjwgoaxexgg",
  },
});

const cookieSetting = {
  maxAge: 86400000,
  // httpOnly: true,
  // sameSite: "none",
  // secure: true,
};
const { createToken } = require("../lib/jwtHelpers");

async function googleLogin(req, res) {
  const { email, name } = req.body;

  try {
    if (!email || !name) {
      return res.status(200).json({ msgCode: "9999", msg: "登入資料不齊全" });
    }
    let result = {};
    const existedUser = await User.find({ email });
    result = existedUser[0];

    if (existedUser.length < 1) {
      const newUser = await User.create({
        ...req.body,
        googleLogin: true,
        emailVerify: true,
      });
      result = newUser;
    }

    const token = createToken({ _id: result._id });

    res.cookie("token", token, cookieSetting);
    res.status(200).json({
      statusCode: "0000",
      user: { picture: result.picture, name: result.name, token },
    });
  } catch (err) {
    console.log(err);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(200).json({ statusCode: "9999", msg: "請輸入完整資訊" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ statusCode: "9999", msg: "帳號或密碼錯誤" });
  }

  if (!user.googleLogin && !user.emailVerify) {
    return res.status(200).json({ statusCode: "8888", msg: "帳號未經驗證" });
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res.status(200).json({ statusCode: "9999", msg: "帳號或密碼錯誤" });
  }
  const token = createToken({ _id: user._id.toString() });

  res.cookie("token", token, cookieSetting);
  res.status(200).json({
    statusCode: "0000",
    user: { picture: user.picture || "", name: user.name, token },
  });
}

async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(200).json({ statusCode: "9999", msg: "請輸入完整資訊" });
  }

  const userExisted = await User.findOne({ email });

  if (userExisted) {
    const match = bcrypt.compareSync(password, userExisted.password);

    if (match) {
      if (!userExisted.emailVerify) {
        return res
          .status(200)
          .json({ statusCode: "8888", msg: "請至email查看驗證碼" });
      }
    }
    return res.status(200).json({ statusCode: "9999", msg: "已經存在此email" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const verificationCode = new Date().getTime();
  await User.create({ email, verificationCode, password: hash });

  const mailOptions = {
    from: "haokai@intella.co",
    to: email,
    subject: "驗證碼",
    text: `您的驗證碼是：${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("郵件發送失敗：", error);
      return res.status(500);
    } else {
      console.log("郵件已成功發送：", info.response);
    }
  });

  res.status(200).json({ statusCode: "8888", msg: "請至email查看驗證碼" });
}

async function verifyEmail(req, res) {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (user.verificationCode === code) {
    const token = createToken({ _id: user._id.toString() });

    user.emailVerify = true;
    await user.save();

    res.cookie("token", token, cookieSetting);
    return res.status(200).json({
      statusCode: "0000",
      user: { picture: "", name: user.name, token },
      msg: "認證完成",
    });
  } else {
    return res.status(200).json({ statusCode: "9999", msg: "認證失敗" });
  }
}

async function getUserInfo(req, res) {
  const { name, email, picture, googleLogin } = req.user;

  res.status(200).json({ user: { name, email, picture, googleLogin } });
}

async function editUserInfo(req, res) {
  const { name, email, picture } = req.body;
  const { _id, googleLogin } = req.user;

  try {
    if (!name || !email) {
      return res
        .status(200)
        .json({ statusCode: "9999", msg: "資料請填寫齊全" });
    }

    const newUser = await User.findByIdAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    );

    res.status(200).json({
      statusCode: "0000",
      user: {
        name: newUser.name,
        picture: newUser.picture,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function userLogout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ statusCode: "0000", msg: "logout" });
}

module.exports = {
  googleLogin,
  editUserInfo,
  login,
  register,
  verifyEmail,
  getUserInfo,
  userLogout,
};
