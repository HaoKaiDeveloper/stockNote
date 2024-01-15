import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import classes from "./StockDetail.module.css";
import Card from "../layout/Card";
import Quill from "./Quill";

import { useDispatch } from "react-redux";
import {
  editStockNote,
  deleteStockNote,
  useEditNoteMutation,
  useDeleteNoteMutation,
} from "slices/stockSlice";
const protalElement = document.querySelector("#overlays");

function counteProfit(bPrice, sPrice, shares, commissionDiscount) {
  const result = {
    commission: "-",
    profit: "-",
    ROI: "-",
    tax: "-",
  };
  if (!bPrice || !sPrice || !shares || !commissionDiscount) {
    return result;
  }
  const buyTotal = bPrice * shares;
  const sellTotal = sPrice * shares;

  const commission_1 = Math.floor(buyTotal * 0.001425 * commissionDiscount);
  const commission_2 = Math.floor(sellTotal * 0.001425 * commissionDiscount);

  const taxPrice = Math.floor(sellTotal * 0.003);

  result.profit = sellTotal - buyTotal - commission_1 - commission_2 - taxPrice;

  result.ROI = ((result.profit / buyTotal) * 100).toFixed(2);

  result.tax = taxPrice;

  result.commission = `${commission_1} + ${commission_2}`;

  return result;
}

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

const StockDetail = (props) => {
  const {
    _id,
    code,
    buyingPrice,
    sellingPrice,
    note,
    shares,
    setDetailNote,
    companyName,
  } = props;

  const dispatch = useDispatch();
  const initObj = {
    _id,
    code,
    buyingPrice,
    sellingPrice,
    note,
    shares,
    companyName,
  };

  const [pResult, setPResult] = useState(
    counteProfit(buyingPrice, sellingPrice, shares, 0.28)
  );

  const [detailInfo, setDetailInfo] = useState(initObj);
  const [resultMsg, setResultMsg] = useState("");
  const [mutate] = useEditNoteMutation();
  const [deleteMutate] = useDeleteNoteMutation();

  function closeDetail() {
    setDetailNote(() => {
      return { _id: "" };
    });
  }

  function hadleChageInput(e) {
    const { id: name, type, className } = e.target;
    let value = e.target.value;
    if (type === "number" || className === "number") {
      var regex = /^[0-9]*(\.[0-9]*)?$/;
      if (!regex.test(value)) {
        return;
      } else {
        Number(value);
      }
    }
    setDetailInfo((prev) => {
      value = value ? value : null;
      const resulObj = { ...prev, [name]: value };

      setPResult(
        counteProfit(
          resulObj.buyingPrice,
          resulObj.sellingPrice,
          resulObj.shares,
          0.28
        )
      );
      return resulObj;
    });
  }

  function handleNoteChange(value) {
    setDetailInfo((prev) => {
      return { ...prev, note: value };
    });
  }

  async function handelupdate() {
    if (!detailInfo.buyingPrice) {
      return setResultMsg("請填寫買進價位");
    }
    setResultMsg("編輯中");
    const res = await mutate({ ...props, ...detailInfo });
    const { error, data } = res;
    if (error) {
      if (error.status === 401) {
        return console.log("編輯401");
      }
      return setResultMsg("編輯失敗請稍後再試");
    }
    if (data && data.statusCode === "0000") {
      setResultMsg(data.msg);
      dispatch(editStockNote(data.stock));
    }
  }

  async function handleDelete() {
    if (!_id) return;
    const res = await deleteMutate(_id);
    const { error, data } = res;
    if (error) {
      if (error.status === 401) {
        return console.log("刪除401");
      }
      return setResultMsg("刪除失敗請稍後再試");
    }
    if (data && data.statusCode === "0000") {
      setResultMsg("刪除完成");
      dispatch(deleteStockNote(_id));
      closeDetail();
    }
  }

  useEffect(() => {
    if (resultMsg) {
      setTimeout(() => {
        setResultMsg("");
      }, 2000);
    }
  }, [resultMsg]);

  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={closeDetail} />, protalElement)}
      {ReactDOM.createPortal(
        <Card childrenClass={classes.main}>
          <form className={classes.form}>
            <label>
              名稱
              <input type="text" disabled value={detailInfo.companyName} />
            </label>
            <label>
              代號
              <input type="text" disabled value={detailInfo.code} />
            </label>
            <label htmlFor="shares">
              股數
              <input
                type="number"
                onChange={hadleChageInput}
                id="shares"
                value={detailInfo.shares}
              />
            </label>
            <div className={classes.price}>
              <label>買進價/賣出價</label>
              <input
                type="text"
                className="number"
                id="buyingPrice"
                onChange={hadleChageInput}
                value={detailInfo.buyingPrice || ""}
                placeholder="買進價"
              />
              /
              <input
                type="text"
                className="number"
                id="sellingPrice"
                onChange={hadleChageInput}
                value={detailInfo.sellingPrice || ""}
                placeholder="賣出價"
              />
            </div>
            <Quill value={detailInfo.note} handleChange={handleNoteChange} />

            <div className={classes.profit}>
              <p>成本價金 {detailInfo.buyingPrice * shares || "-"}</p>
              <p>賣出價金 {detailInfo.sellingPrice * shares || "-"}</p>
              <p>手續費 {pResult.commission}</p>
              <p>稅金 {pResult.tax}</p>
              <p>損益 {pResult.profit} </p>
              <p>利潤率 {pResult.ROI}%</p>
            </div>
            <p className={classes.resultMsg}>{resultMsg}</p>
            <div className={classes.btns}>
              <button onClick={handelupdate} type="button">
                筆記更新
              </button>
              <button type="button" onClick={handleDelete}>
                刪除筆記
              </button>
            </div>
          </form>
        </Card>,
        protalElement
      )}
    </>
  );
};

export default StockDetail;
