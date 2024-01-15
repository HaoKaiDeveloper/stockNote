import React from "react";

import classes from "./SmallSidebar.module.css";
import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineStock, AiOutlineUser } from "react-icons/ai";
import { MdOutlineNoteAlt } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { userLogout } from "../../slices/userSlice";

const pageLink = [
  {
    href: "/",
    name: " 股市概況",
    icon: <AiOutlineStock />,
  },
  {
    href: "/tradingNotes",
    name: "我的筆記",
    icon: <MdOutlineNoteAlt />,
  },
  {
    href: "/user",
    name: "會員資訊",
    icon: <AiOutlineUser />,
  },
];

const SmallSidebar = ({ sidebarHide, setSidebarHide }) => {
  const sidebarHideActive = sidebarHide ? classes.hide : "";
  const dispatch = useDispatch();

  return (
    <div className={`${classes.smallSidebar} ${sidebarHideActive}`}>
      <div className={classes.main}>
        <button
          type="button"
          onClick={() => setSidebarHide(false)}
          className={classes.closeBtn}
        >
          <AiOutlineClose />
        </button>

        <button
          type="button"
          className={classes.logoutBtn}
          onClick={() => dispatch(userLogout())}
        >
          <BiLogOut />
          登出
        </button>

        <ul>
          {pageLink.map((item) => {
            return (
              <li key={item.name} onClick={() => setSidebarHide(false)}>
                <Link to={item.href}>
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
          {/* <li>
            <Link to="/">
              <AiOutlineStock />
              股市概況
            </Link>
          </li>
          <li>
            <Link to="/tradingNotes">
              <MdOutlineNoteAlt />
              我的筆記
            </Link>
          </li>
          <li>
            <Link to="/user">
              <AiOutlineUser />
              會員資訊
            </Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default SmallSidebar;
