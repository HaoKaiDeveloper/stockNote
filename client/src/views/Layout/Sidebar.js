import React from "react";
import { AiOutlineStock, AiOutlineUser } from "react-icons/ai";
import { MdOutlineNoteAlt } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import classes from "./Sidebar.module.css";
import { useDispatch } from "react-redux";
import { userLogout } from "../../slices/userSlice";

const Sidebar = ({ sidebarHide }) => {
  const sidebarHideActive = sidebarHide ? classes.hide : "";
  const dispatch = useDispatch();

  return (
    <div className={`${classes.sidebar} ${sidebarHideActive}`}>
      <ul>
        <li>
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
        </li>
      </ul>
      <button type="button" onClick={() => dispatch(userLogout())}>
        <BiLogOut />
        登出
      </button>
    </div>
  );
};

export default Sidebar;
