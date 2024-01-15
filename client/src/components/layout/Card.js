import React from "react";
import classes from "./Card.module.css";

const Card = ({ children, childrenClass }) => {
  return <div className={`${classes.card} ${childrenClass}`}>{children}</div>;
};

export default Card;
