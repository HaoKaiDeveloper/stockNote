import { useState } from "react";

import classes from "./NoteTable.module.css";
import Card from "components/layout/Card";
import StockDetail from "components/stock/StockDetail";
import { countProfit } from "lib/countProfit";

const NoteTable = ({ stockNotes, isLoading }) => {
  const [detailNote, setDetailNote] = useState({ _id: "" });

  function handleShowDetailNote(info) {
    setDetailNote((prev) => {
      return { ...prev, ...info };
    });
  }

  if (isLoading) {
    return <p>isLoading...</p>;
  }
  return (
    <>
      <Card childrenClass={classes.noteTable}>
        <h2>交易筆記</h2>

        <table className={classes.table}>
          <thead>
            <tr>
              <th>名稱</th>
              <th>股數</th>
              <th>買/賣價</th>
              <th>損益</th>
              <th>報酬率</th>
              <th>詳細</th>
            </tr>
          </thead>
          {stockNotes &&
            stockNotes.map((note) => {
              const pResult = countProfit(
                note.buyingPrice,
                note.sellingPrice,
                note.shares,
                0.28
              );
              return (
                <tbody key={note._id}>
                  <tr>
                    <td>
                      {note.companyName} <span>{note.code}</span>
                    </td>
                    <td>{note.shares}</td>
                    <td>
                      {note.buyingPrice}/{note.sellingPrice}
                    </td>
                    <td>{pResult.profit}</td>
                    <td>{pResult.ROI}%</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleShowDetailNote(note)}
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                </tbody>
              );
            })}
        </table>
      </Card>
      {detailNote._id && (
        <StockDetail {...detailNote} setDetailNote={setDetailNote} />
      )}
    </>
  );
};

export default NoteTable;
