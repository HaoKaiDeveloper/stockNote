import { useEffect, useState, useRef } from "react";
import IndexCard from "./IndexCard";
import classes from "./indexCtr.module.css";

const IndexCtr = () => {
  const socket = useRef(null);
  const [indexValue, setIndexValues] = useState({
    twxObj: { z: 0, y: 0 },
    otcObj: { z: 0, y: 0 },
  });

  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket("ws://localhost:8080/");

      socket.current.onopen = () => {
        console.log("websocket connect!");
      };

      socket.current.onmessage = (event) => {
        console.log(event.data);
        setIndexValues((prev) => ({ ...prev, ...JSON.parse(event.data) }));
      };

      socket.current.onclose = () => {
        setIndexValues({
          twxObj: { z: 0, y: 0 },
          otcObj: { z: 0, y: 0 },
        });
      };
    }
  }, []);

  return (
    <div className={classes.indexCtr}>
      <IndexCard h2="加權指數" data={indexValue.twxObj} />
      <IndexCard h2="櫃買指數" data={indexValue.otcObj} />
    </div>
  );
};

export default IndexCtr;
