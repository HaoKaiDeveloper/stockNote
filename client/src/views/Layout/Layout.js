import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import classes from "./Layout.module.css";
import { useSelector } from "react-redux";

import Sidebar from "./Sidebar";
import SmallSidebar from "./SmallSidebar";
import Navbar from "./Navbar";
import LogoutPop from "components/layout/LogoutPop";

const Layout = () => {
  const [sidebarHide, setSidebarHide] = useState(false);
  const { logOutPop } = useSelector((store) => store.user);
  return (
    <section className={classes.main}>
      <div
        className={`${classes.tempSidebar} ${
          sidebarHide && classes.sidebarHide
        }`}
      ></div>
      <Sidebar sidebarHide={sidebarHide} />
      <SmallSidebar sidebarHide={sidebarHide} setSidebarHide={setSidebarHide} />
      <div className={classes.view}>
        <Navbar sidebarHide={sidebarHide} setSidebarHide={setSidebarHide} />
        <Outlet />
      </div>
      {logOutPop && <LogoutPop />}
    </section>
  );
};

export default Layout;
