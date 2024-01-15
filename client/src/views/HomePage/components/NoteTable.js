import { useState } from "react";
import StockDetail from "components/stock/StockDetail";

import Card from "components/layout/Card";

import classes from "./NoteTable.module.css";
import { useSelector } from "react-redux";
import { countProfit } from "lib/countProfit";

const NoteTable = () => {
  const { stockNotes } = useSelector((store) => store.stock);

  const [detailNote, setDetailNote] = useState({ _id: "" });

  function handleShowDetailNote(info) {
    setDetailNote((prev) => {
      return { ...prev, ...info };
    });
  }

  return (
    <>
      <Card childrenClass={classes.noteTable}>
        <h2>筆記</h2>
        <div className={classes.tableCtr}>
          <table>
            <thead>
              <tr>
                <th>名稱</th>
                <th>股數</th>
                <th>報酬率</th>
                <th>詳細</th>
              </tr>
            </thead>
            {stockNotes.map((note) => {
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
                    <td>{note.code}</td>
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
        </div>
      </Card>
      {detailNote._id && (
        <StockDetail {...detailNote} setDetailNote={setDetailNote} />
      )}
    </>
  );
};

export default NoteTable;
