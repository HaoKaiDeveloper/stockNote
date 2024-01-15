import React from "react";
import classes from "./LogoutPop.module.css";
import { useDispatch } from "react-redux";
import { userLogout } from "../../slices/userSlice";

const LogoutPop = () => {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(userLogout());
  }

  return (
    <main className={classes.main}>
      <div className={classes.info}>
        <p>超過登入時間上限，請重新登入</p>
        <button type="button" onClick={handleLogout}>
          確認
        </button>
      </div>
    </main>
  );
};

export default LogoutPop;
