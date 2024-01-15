import { useEffect, useState, useRef, useMemo } from "react";
import Card from "components/layout/Card";
import classes from "./Profit.module.css";
import BarChart from "components/chart/BarChart";
import { useSelector } from "react-redux";
import { countProfit } from "lib/countProfit";

const Note = ({ realizedNote, unrealizedNote, realized }) => {
  let notes = realized ? realizedNote : unrealizedNote;

  return notes.map((item) => {
    const countProfitNum = realized
      ? item.sellingPrice
      : item.closingPrice
      ? item.closingPrice
      : "";
    let profitResult;
    if (countProfitNum) {
      profitResult = countProfit(
        item.buyingPrice,
        countProfitNum,
        item.shares,
        0.28
      );
    }
    return (
      <tbody key={item._id}>
        <tr>
          <td className={classes.stockName}>
            {item.companyName}
            <span>{item.code}</span>
          </td>
          <td>{item.shares}</td>
          <td>
            {item.buyingPrice}/{" "}
            {realized
              ? item.sellingPrice
              : item.closingPrice
              ? `(${item.closingPrice})`
              : "-"}
          </td>

          <td>{profitResult ? profitResult.profit : "-"}</td>
        </tr>
      </tbody>
    );
  });
};

const Profit = () => {
  const { stockNotes } = useSelector((store) => store.stock);
  const [realized, setReslzed] = useState(false);
  const chartRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const realizedNote = useMemo(
    () => stockNotes.filter((item) => item.buyingPrice && item.sellingPrice),
    [stockNotes]
  );
  const unrealizedNote = useMemo(
    () => stockNotes.filter((item) => !item.buyingPrice || !item.sellingPrice),
    [stockNotes]
  );

  useEffect(() => {
    const observeTarget = chartRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].target === observeTarget) {
        const { width, height } = entries[0].contentRect;
        console.log(width, height);
        setSize({ width, height: height + 2 });
      }
    });

    const resizeListener = () => {
      setSize({
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight,
      });
    };

    if (chartRef.current) {
      resizeListener();
      window.addEventListener("resize", resizeListener);
      resizeObserver.observe(observeTarget);
    }

    return () => {
      window.removeEventListener("resize", resizeListener);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Card childrenClass={classes.main}>
      <h2>損益</h2>
      <div className={classes.btns}>
        <button
          type="button"
          className={realized ? classes.active : ""}
          onClick={() => setReslzed(true)}
        >
          已實現
        </button>
        <span>/</span>
        <button
          type="button"
          className={!realized ? classes.active : ""}
          onClick={() => setReslzed(false)}
        >
          未實現
        </button>
      </div>

      <div className={classes.chart} ref={chartRef}>
        <BarChart
          noteData={realized ? realizedNote : unrealizedNote}
          parentSize={size}
          countProfit={countProfit}
        />
      </div>

      <h3>{realized ? "已實現" : "未實現"}</h3>
      <div className={classes.profitTable}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>名稱</th>
              <th>股數</th>
              <th>買/{realized ? "賣價" : "(收盤價)"}</th>
              <th>損益</th>
            </tr>
          </thead>
          <Note
            realizedNote={realizedNote}
            unrealizedNote={unrealizedNote}
            realized={realized}
          />
        </table>
      </div>
    </Card>
  );
};

export default Profit;
