import { memo, useEffect, useRef, useState } from "react";
import classes from "./Filter.module.css";
import Card from "components/layout/Card";
import { BsSearch } from "react-icons/bs";

const Filter = memo(({ handelSetFilter }) => {
  const [filterValue, setFilterValue] = useState({
    search: "",
    assets: "all",
    sortValue: 0,
  });
  const timer = useRef(null);
  const debounce = useRef(false);

  function handleChangeInpu(e) {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "assets") {
      value = e.target.id;
    }
    setFilterValue((prev) => {
      return { ...prev, [name]: value };
    });

    if (name === "search") {
      debounce.current = true;
    } else {
      debounce.current = false;
      handelSetFilter({ ...filterValue, [name]: value });
    }
  }
  function resetFilter() {
    const initVal = {
      search: "",
      assets: "all",
      sortValue: 0,
    };
    setFilterValue(initVal);
    handelSetFilter(initVal);
    const radioInputs = document.querySelectorAll(
      'input[type="radio"][name="assets"]'
    );
    radioInputs.forEach((input) => {
      if (input.id === "all") {
        input.checked = true;
      } else {
        input.checked = false;
      }
    });
  }

  useEffect(() => {
    if (!debounce.current) {
      return;
    }
    // if (timer.current) {
    //   clearTimeout(timer.current);
    // }
    timer.current = setTimeout(() => {
      handelSetFilter({ ...filterValue });
    }, 1000);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [handelSetFilter, filterValue]);

  return (
    <Card childrenClass={classes.filter}>
      <label htmlFor="search" className={classes.searchInput}>
        <input
          id="search"
          value={filterValue.search}
          name="search"
          onChange={handleChangeInpu}
          type="text"
          placeholder="代號、名稱"
        />
        <BsSearch />
      </label>

      <div className={classes.radios}>
        <label htmlFor="all">
          全部
          <input
            type="radio"
            defaultChecked
            value={filterValue.assets}
            onClick={handleChangeInpu}
            name="assets"
            id="all"
          />
        </label>
        <label htmlFor="realized">
          已實現
          <input
            type="radio"
            value={filterValue.assets}
            onClick={handleChangeInpu}
            name="assets"
            id="realized"
          />
        </label>{" "}
        <label htmlFor="unrealized">
          未實現
          <input
            type="radio"
            value={filterValue.assets}
            onClick={handleChangeInpu}
            name="assets"
            id="unrealized"
          />
        </label>
      </div>

      <select
        className={classes.sort}
        name="sortValue"
        onChange={handleChangeInpu}
        value={filterValue.sortValue}
      >
        <option value={0}>時期</option>
        <option value={-1}>近期到早期</option>
        <option value={1}>早期到近期</option>
      </select>

      <button onClick={resetFilter}>清除</button>
    </Card>
  );
});

export default Filter;
