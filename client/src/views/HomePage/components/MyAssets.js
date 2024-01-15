import { useEffect, useState, useRef, useMemo } from "react";
import Card from "components/layout/Card";
import PieChart from "components/chart/PieChart";
import classes from "./MyAssets.module.css";

import { useSelector } from "react-redux";

const MyAssets = () => {
  const { stockNotes } = useSelector((store) => store.stock);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const chartRef = useRef(null);
  const unrealizesNote = useMemo(
    () => stockNotes.filter((note) => !note.sellingPrice),
    [stockNotes]
  );
  const totalCapital = useMemo(
    () =>
      unrealizesNote.reduce(
        (acc, note) => (acc += note.buyingPrice * note.shares),
        0
      ),
    [unrealizesNote]
  );

  useEffect(() => {
    const resizeListener = () => {
      setSize({
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight,
      });
    };

    if (chartRef.current) {
      resizeListener();
      window.addEventListener("resize", resizeListener);
    }

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <Card childrenClass={classes.myAssets}>
      <h2>投入資金比例</h2>
      <main className={classes.main}>
        <div className={classes.chart} ref={chartRef}>
          <PieChart noteData={unrealizesNote} parentSize={size} />
        </div>

        <div className={classes.assetsTable}>
          <table>
            <thead>
              <tr>
                <th>名稱</th>
                <th>股數</th>
                <th>占比</th>
              </tr>
            </thead>
            {unrealizesNote.map((note) => {
              const assets = note.buyingPrice * note.shares;
              return (
                <tbody key={note._id}>
                  <tr>
                    <td>
                      {note.companyName} <span>{note.code}</span>
                    </td>
                    <td>{note.shares}</td>
                    <td>
                      {((assets / totalCapital) * 100).toFixed(1) || "-"}%
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </main>
    </Card>
  );
};

export default MyAssets;
