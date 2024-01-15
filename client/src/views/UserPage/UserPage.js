import { useState, useEffect, useRef } from "react";

import classes from "./UserPage.module.css";
import Card from "../../components/layout/Card";

import { useDispatch } from "react-redux";
import { setUserInfo } from "../../slices/userSlice";
import { getUserInfoRoute, editUserInfoRoute } from "../../slices/api";
import axios from "axios";
import { AiOutlineUser, AiOutlineCamera } from "react-icons/ai";

async function getUserInfo() {
  try {
    const res = await axios.get(getUserInfoRoute, {
      withCredentials: true,
    });
    const data = await res.data;

    return data;
  } catch (err) {
    console.log(err);
  }
}

async function editUserInfo(value, setResultMsg) {
  const { email, name, picture } = value;

  if (!email || !name) {
    return setResultMsg("資料請輸入齊全");
  }

  try {
    const res = await axios.put(editUserInfoRoute, value, {
      withCredentials: true,
    });
    if (res.status === 200 && res.data.statusCode === "0000") {
      return res.data.user;
    } else {
      throw new Error("發生錯誤請稍後再試");
    }
  } catch (err) {
    setResultMsg("發生錯誤請稍後再試");
    console.log(err);
  }
}

const UserPage = () => {
  const dispatch = useDispatch();
  const imgRef = useRef(null);
  const [info, setInfo] = useState({
    name: "",
    picture: "",
    email: "",
    googleLogin: null,
  });
  const [resultMsg, setResultMsg] = useState("");

  function handleInputChange(e) {
    const name = e.target.id;
    const value = e.target.value;
    setInfo((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function cliclFileInput() {
    imgRef.current.click();
  }

  function handleFileInputChange(e) {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = function () {
      const base64String = reader.result;
      setInfo((prev) => {
        return { ...prev, picture: base64String };
      });
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const newUser = await editUserInfo(info, setResultMsg);
      dispatch(setUserInfo(newUser));
      setResultMsg("資料修改完成");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUserInfo().then((res) => {
      setInfo((prev) => {
        return { ...prev, ...res.user };
      });
    });
  }, []);

  useEffect(() => {
    if (resultMsg) {
      setTimeout(() => {
        setResultMsg("");
      }, 2000);
    }
  }, [resultMsg]);

  return (
    <section className={classes.section}>
      <Card childrenClass={classes.main}>
        <div className={classes.picture}>
          <div className={classes.header}>
            {info.picture ? (
              <img src={info.picture} alt="header" />
            ) : (
              <AiOutlineUser />
            )}
          </div>
          <button type="button" onClick={cliclFileInput}>
            <AiOutlineCamera />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={imgRef}
            onChange={handleFileInputChange}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Email
            <br />
            <input
              type="email"
              id="email"
              value={info.email}
              onChange={handleInputChange}
              disabled={info.googleLogin ? true : false}
            />
          </label>

          <label htmlFor="name">
            名稱
            <br />
            <input
              type="text"
              id="name"
              value={info.name}
              onChange={handleInputChange}
            />
          </label>

          {info.googleLogin ? <p>(Google註冊)</p> : <p>(普通註冊)</p>}

          <button type="submit">確定修改</button>
          <p className={classes.msg}>{resultMsg}</p>
        </form>
      </Card>
    </section>
  );
};

export default UserPage;
