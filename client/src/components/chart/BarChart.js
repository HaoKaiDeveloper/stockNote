import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useMemo } from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (payload.length) {
    const { buyCost, name, profit, totalReturn, ROI } = payload[0].payload;
    const buyCostColor = payload[0].fill;
    const totalReturnColor = payload[1].fill;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          fontSize: "14px",
          borderRadius: "7px",
          letterSpacing: "2px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <p>{name}</p>
        <p style={{ color: buyCostColor }}>成本:{buyCost}</p>
        <p style={{ color: totalReturnColor }}>回收價金:{totalReturn}</p>
        <p style={{ color: profit > 0 ? "red" : "green" }}>損益:{profit}</p>
        <p>報酬率:{ROI}%</p>
      </div>
    );
  }
  return null;
};

const Chart = ({ noteData, parentSize, countProfit }) => {
  const data = useMemo(() => {
    return noteData
      .filter((item) => item.sellingPrice || item.closingPrice)
      .map((item) => {
        const profitNum = item.sellingPrice || item.closingPrice;
        const profit = countProfit(
          item.buyingPrice,
          profitNum,
          item.shares,
          0.28
        );
        const [buyCommission, sellCommission] = profit.commission
          .split("+")
          .map(Number);
        const buyCost = item.buyingPrice * item.shares + buyCommission;
        const totalReturn =
          profitNum * item.shares - sellCommission - profit.tax;

        return {
          name: item.companyName,
          profit: profit.profit,
          ROI: profit.ROI,
          buyCost,
          totalReturn,
        };
      });
  }, [noteData, countProfit]);

  if (data.length < 1) return null;

  return (
    <BarChart
      width={parentSize.width}
      height={parentSize.height}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="buyCost" fill="#8884d8" />
      <Bar dataKey="totalReturn" fill="#82ca9d" />
    </BarChart>
  );
};

export default Chart;
