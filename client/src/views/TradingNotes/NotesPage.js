import { useEffect, useState, useCallback, useRef } from "react";
import classes from "./NotesPage.module.css";
import CreateForm from "./components/CreateForm";
import Filter from "./components/Filter";
import NoteTable from "./components/NoteTable";
import IsLoadingComponent from "components/layout/IsLoadingComponent";

import { useDispatch, useSelector } from "react-redux";
import { setStockNote, useGetStockNoteQuery } from "slices/stockSlice";
import { userLogout } from "slices/userSlice";

const NotesPage = () => {
  const filterValue = useRef({
    search: "",
    assets: "all",
    sortValue: 0,
  });
  const [triggerQuery, setTriggerQuery] = useState({});
  const { data, isLoading, error } = useGetStockNoteQuery(filterValue.current);
  const { stockNotes } = useSelector((store) => store.stock);
  const dispatch = useDispatch();

  const handelSetFilter = useCallback((val) => {
    filterValue.current = { ...filterValue.current, ...val };
    setTriggerQuery({});
  }, []);

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
      <CreateForm />
      <Filter handelSetFilter={handelSetFilter} />
      <NoteTable stockNotes={stockNotes} isLoading={isLoading} />
    </section>
  );
};
export default NotesPage;
