const Stock = require("../models/stockModels");
const axios = require("axios");

let stockCache = {
  date: null,
  data: null,
};

async function getAllStock() {
  const today = new Date().toDateString();
  if (today === stockCache.date) {
    return stockCache.data;
  }

  const otcStocks = await axios(
    "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes"
  );
  const twsStock = await axios(
    "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL"
  );

  let formatData = [];
  otcStocks.data.forEach((item) => {
    formatData.push({
      Code: item.SecuritiesCompanyCode,
      Name: item.CompanyName,
      ClosingPrice: item.Close,
      MonthlyAveragePrice: "-",
    });
  });
  formatData = [...formatData, ...twsStock.data];
  stockCache = {
    date: today,
    data: formatData,
  };
  return formatData;
}

const getStock = async (req, res) => {
  const { search, assets, sort } = req.query;
  const { _id } = req.user;
  const queryObj = { creatorId: _id };
  const sortObj = {};

  if (!_id) {
    return res.status(401);
  }

  if (search) {
    if (isNaN(parseInt(search))) {
      const searchRegex = new RegExp(search, "i");
      queryObj.companyName = searchRegex;
    } else {
      queryObj.code = search;
    }
  }

  if (assets !== "all") {
    queryObj.buyingPrice = { $gt: 0 };
    if (assets === "realized") {
      queryObj.sellingPrice = { $gt: 0 };
    } else {
      queryObj.sellingPrice = null;
    }
  }

  if (sort === "-1") {
    sortObj.createdAt = -1;
  } else if (sort === "1") {
    sortObj.createdAt = 1;
  }

  try {
    let stock = await Stock.find(queryObj).sort(sortObj);
    const allStock = await getAllStock();

    for (let i = 0; i < stock.length; i++) {
      const index = allStock.findIndex((item) => item.Code === stock[i].code);
      if (index >= 0) {
        stock[i].closingPrice = allStock[index].ClosingPrice;
      }
    }
    res.status(200).json({ statusCode: "0000", stock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "發生錯誤請稍後再試" });
  }
};

const createStock = async (req, res) => {
  const { code, shares, buyingPrice, sellingPrice, imgs, note } = req.body;
  const { _id } = req.user;
  try {
    if (!_id) {
      return res.status(401);
    }

    if (!code || !shares || !buyingPrice) {
      return res
        .status(200)
        .json({ statusCode: "9999", msg: "請填寫代碼及股數、買入價格" });
    }

    const allStock = await getAllStock();
    const stockObj = allStock.filter((stock) => stock.Code == code);
    const createObj = { ...req.body, creatorId: _id, companyName: code };
    if (stockObj.length > 0) {
      createObj.companyName = stockObj[0].Name;
    }
    const stock = await Stock.create(createObj);
    return res.status(200).json({ statusCode: "0000", stock });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "發生錯誤請稍後再試" });
  }
};

const editStock = async (req, res) => {
  const {
    _id,
    code,
    shares,
    buyingPrice,
    sellingPrice,
    closingPrice,
    imgs,
    note,
  } = req.body;
  try {
    if (!code || !shares) {
      return res
        .status(200)
        .json({ statusCode: "9999", msg: "請填寫代碼及股數" });
    }
    const newStock = await Stock.findByIdAndUpdate({ _id }, req.body, {
      new: true,
    });

    return res
      .status(200)
      .json({ statusCode: "0000", msg: "編輯完成", stock: newStock });
  } catch (err) {
    return res.status(500).json({ msg: "發生錯誤請稍後再試" });
  }
};

const deleteStock = async (req, res) => {
  const { id } = req.params;
  await Stock.deleteOne({ _id: id });
  res.status(200).json({ statusCode: "0000", msg: "已刪除" });
};

module.exports = { getStock, createStock, editStock, deleteStock };
