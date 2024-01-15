import React from "react";
import classes from "./Navbar.module.css";

import { HiBars3BottomRight } from "react-icons/hi2";
import { AiOutlineUser } from "react-icons/ai";
import { useSelector } from "react-redux/es/hooks/useSelector";

const Navbar = ({ sidebarHide, setSidebarHide }) => {
  const sidebarHideActive = sidebarHide ? classes.hide : "";
  const { picture, name } = useSelector((store) => store.user);
  return (
    <div className={classes.navbar}>
      <button
        onClick={() => setSidebarHide(!sidebarHide)}
        className={sidebarHideActive}
      >
        <HiBars3BottomRight />
      </button>
      <div className={classes.info}>
        <div className={classes.navImg}>
          {picture ? <img src={picture} alt="header" /> : <AiOutlineUser />}
        </div>
        <p>{name}</p>
      </div>
    </div>
  );
};

export default Navbar;
