import { useState, useEffect } from "react";
import classes from "./LoginPage.module.css";
import Card from "components/layout/Card";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { setGoogleLogin } from "slices/userSlice";
import { useDispatch } from "react-redux";
import { setUserInfo } from "slices/userSlice";
import {
  userLoginRoute,
  userRegisterRoute,
  verifyEmailRoute,
} from "../../slices/api";

import axios from "axios";

async function userLogin(info) {
  try {
    const res = await axios.post(userLoginRoute, info, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
  }
}

async function userRegister(info) {
  try {
    const res = await axios.post(userRegisterRoute, info, {
      withCredentials: true,
    });
    console.log(res);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
  }
}

async function userVerifyCode(info) {
  try {
    const res = await axios.post(verifyEmailRoute, info, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
  }
}

const AuthForm = ({ status, handelSetFormStatus }) => {
  const dispatch = useDispatch();
  const toggleBtnText = status === "login" ? "會員註冊" : "會員登入";
  const toggleBtnSetStatus = status === "login" ? "register" : "login";
  const [msg, setMsg] = useState("");
  const [info, setInfo] = useState({
    email: "",
    password: "",
    code: "",
  });

  function handleInputChage(e) {
    const neme = e.target.id;
    const value = e.target.value;
    setInfo((prev) => {
      return { ...prev, [neme]: value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!info.email || !info.password) {
      setMsg("請輸入完整資訊");
    }
    if (status === "login") {
      userLogin(info)
        .then((res) => {
          const { statusCode } = res;
          if (statusCode === "0000") {
            dispatch(setUserInfo(res.user));
          } else if (statusCode === "8888") {
            handelSetFormStatus("verify");
          }
          setMsg(res.msg);
        })
        .catch((err) => {
          setMsg("發生錯誤請稍後再試");
        });
    } else if (status === "register") {
      userRegister(info)
        .then((res) => {
          const { statusCode, msg } = res;
          if (statusCode === "8888") {
            handelSetFormStatus("verify");
          }
          setMsg(msg);
        })
        .catch((err) => {
          setMsg("發生錯誤請稍後再試");
        });
    } else if (status === "verify") {
      userVerifyCode(info).then((res) => {
        const { statusCode, msg } = res;
        setMsg(msg);
        if (statusCode === "0000") {
          dispatch(setUserInfo(res.user));
        }
      });
    }
  }

  useEffect(() => {
    if (msg) {
      setTimeout(() => {
        setMsg("");
      }, 5000);
    }
  });

  if (status === "login" || status === "register") {
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            value={info.email}
            onChange={handleInputChage}
          />
        </label>
        <label htmlFor="password">
          密碼 :
          <input
            type="password"
            id="password"
            value={info.password}
            onChange={handleInputChage}
          />
        </label>
        <p>{msg}</p>
        <button type="submit">{status === "login" ? "登入" : "註冊"}</button>
        <button
          type="button"
          onClick={() => {
            handelSetFormStatus(toggleBtnSetStatus);
          }}
        >
          {toggleBtnText}
        </button>
      </form>
    );
  } else if (status === "verify") {
    return (
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="code">
          驗證碼:
          <input
            type="text"
            id="code"
            value={info.code}
            onChange={handleInputChage}
          />
        </label>
        <p>{msg}</p>
        <button type="submit">確定註冊</button>
      </form>
    );
  }
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const [formStatus, setFormStatus] = useState("login");

  function handelSetFormStatus(val) {
    setFormStatus(val);
  }

  return (
    <section className={classes.section}>
      <Card childrenClass={classes.main}>
        <AuthForm
          status={formStatus}
          handelSetFormStatus={handelSetFormStatus}
        />
        <div className={classes.googleBtn}>
          <GoogleOAuthProvider clientId="473126897616-cp77fri7msamdddjip8jcf72n15o099j.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const decoded = jwt_decode(credentialResponse.credential);
                dispatch(setGoogleLogin(decoded));
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </GoogleOAuthProvider>
        </div>
      </Card>
    </section>
  );
};

export default LoginPage;
