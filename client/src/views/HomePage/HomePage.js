import { useEffect } from "react";
import classes from "./HomePage.module.css";
import IndexCtr from "./components/IndexCtr";
import Profit from "./components/Profit";
import MyAssets from "./components/MyAssets";
import NoteTable from "./components/NoteTable";
import IsLoadingComponent from "components/layout/IsLoadingComponent";

import { useDispatch } from "react-redux";
import { userLogout } from "slices/userSlice";
import { setStockNote, useGetStockNoteQuery } from "slices/stockSlice";

const HomePage = () => {
  const { data, error, isLoading } = useGetStockNoteQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(setStockNote(data.stock));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <IsLoadingComponent />;
  }

  if (error) {
    return dispatch(userLogout());
  }

  return (
    <section className={classes.main}>
      <h1>股市概況</h1>
      <div className={classes.sec_1}>
        <div>
          <IndexCtr />
        </div>
        <div>
          <Profit />
        </div>
        <div>
          <MyAssets />
        </div>
      </div>
      <NoteTable />
    </section>
  );
};

export default HomePage;
