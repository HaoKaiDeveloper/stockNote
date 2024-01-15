const axios = require("axios");

module.exports = function getIndex() {
  const twxFetch = axios.get(
    "https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw&json=1&delay=0"
  );
  const otcFetch = axios.get(
    "https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=otc_o00.tw&json=1&delay=0"
  );

  return Promise.all([twxFetch, otcFetch])
    .then(([data1, data2]) => {
      const payload = {
        twxObj: data1.data.msgArray[0],
        otcObj: data2.data.msgArray[0],
      };
      return payload;
    })
    .catch((err) => err);
};
