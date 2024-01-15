import { useState, useEffect } from "react";
import Card from "components/layout/Card";
import classes from "./IndexCard.module.css";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

const IndexCard = ({ h2, data }) => {
  const [prevIndex, setPrevIndex] = useState(data.z);
  const dev = data.z - data.y;
  let indexClass = dev >= 0 ? `${classes.index_P}` : `${classes.index_N}`;

  useEffect(() => {
    if (data.z !== prevIndex) {
      setPrevIndex(data.z);
    }
  }, [data.z, prevIndex]);

  const p_dev = dev ? dev.toFixed(2) : 0;
  const p_devClass = dev > 0 ? classes.dev_P : classes.dev_N;
  return (
    <Card childrenClass={classes.indexCard}>
      <h2>{h2}</h2>
      <p
        className={`${indexClass} ${
          prevIndex !== data.z ? classes.animate : ""
        }`}
      >
        {data.z}
      </p>
      <p className={p_devClass}>
        {p_dev >= 0 ? <GoTriangleUp /> : <GoTriangleDown />}
        {p_dev}
      </p>
    </Card>
  );
};

export default IndexCard;
