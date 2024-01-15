import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#651fff"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "13px" }}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (payload.length > 0) {
    const { value, name } = payload[0];
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          fontSize: "13px",
          borderRadius: "7px",
        }}
      >
        <p className="label">{`${name} : $${value}`}</p>
      </div>
    );
  }
  return null;
};

const Chart = ({ noteData, parentSize }) => {
  const data = useMemo(
    () =>
      noteData
        .filter((item) => item.buyingPrice * item.shares > 1)
        .map((item) => ({
          name: item.companyName,
          value: item.buyingPrice * item.shares,
        })),
    [noteData]
  );

  return (
    <PieChart width={parentSize.width} height={parentSize.height}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={parentSize.height / 2.5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
};

export default Chart;
