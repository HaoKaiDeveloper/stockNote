import { useEffect, useState, memo } from "react";

import classes from "./CreateForm.module.css";
import Card from "components/layout/Card";
import Quill from "components/stock/Quill";
import { AiFillPlusCircle } from "react-icons/ai";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import { addNewStockNote, useCreateNoteMutation } from "slices/stockSlice";

const CreateForm = memo(() => {
  const dispatch = useDispatch();
  const [mutate] = useCreateNoteMutation();
  const [loading, setLoading] = useState(false);
  const [showForm, setShoewForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    shares: "",
    buyingPrice: "",
    sellingPrice: "",
    note: "",
  });
  const [msg, setMsg] = useState("");

  const show = showForm ? classes.show : "";

  function hadleChageInput(e) {
    const name = e.target.id;
    const value = e.target.value;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function handleNoteChange(value) {
    setFormData((prev) => {
      return { ...prev, note: value };
    });
  }

  async function handleSubmitForm(e) {
    e.preventDefault();

    const { code, shares, buyingPrice } = formData;
    if (!code || !shares || !buyingPrice) {
      return setMsg("代號、股數及買進價位請填寫完整");
    }
    setLoading(true);
    const res = await mutate(formData);
    const { error, data } = res;

    console.log(error, data);
    if (error) {
      if (error.status === 401) {
        return console.log("新增401");
      }
      return setMsg("發生錯誤請稍後再試");
    }
    if (data && data.statusCode === "0000") {
      setMsg("新增完成");
      setFormData({
        code: "",
        shares: "",
        buyingPrice: "",
        sellingPrice: "",
        note: "",
      });
      dispatch(addNewStockNote(data.stock));
    }
    setLoading(false);
  }
  useEffect(() => {
    if (msg.length > 0) {
      setTimeout(() => {
        setMsg("");
      }, 2000);
    }
  }, [msg]);

  return (
    <Card childrenClass={classes.createForm}>
      <h2>新增筆記</h2>
      <button
        type="button"
        className={classes.toggleBtn}
        onClick={() => setShoewForm(!showForm)}
      >
        <AiFillPlusCircle />
      </button>

      <form className={`${classes.form} ${show}`} onSubmit={handleSubmitForm}>
        <label htmlFor="code">
          *代號
          <input
            type="type"
            id="code"
            value={formData.code}
            onChange={hadleChageInput}
          />
        </label>
        <label htmlFor="shares">
          *股數
          <input
            type="number"
            id="shares"
            value={formData.shares}
            onChange={hadleChageInput}
          />
        </label>
        <label htmlFor="buyingPrice">
          *買進價位
          <input
            type="number"
            id="buyingPrice"
            value={formData.buyingPrice}
            onChange={hadleChageInput}
          />
        </label>
        <label htmlFor="sellingPrice">
          賣出價位
          <input
            type="number"
            id="sellingPrice"
            value={formData.sellingPrice}
            onChange={hadleChageInput}
          />
        </label>
        <article>
          <Quill value={formData.note} handleChange={handleNoteChange} />
        </article>
        <p className={classes.msg}>{msg}</p>
        {loading ? (
          <ReactLoading
            type={"spin"}
            color={"#6200ea"}
            height={"3%"}
            width={"3%"}
          />
        ) : (
          <button type="submit">新增</button>
        )}
      </form>
    </Card>
  );
});

export default CreateForm;
