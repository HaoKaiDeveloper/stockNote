require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const connectDB = require("./db/connectDb");
const StockRouter = require("./routes/stockRoute");
const UserRouter = require("./routes/userRoute");
const getIndex = require("./lib/indexData");

// const server = app.listen(8080, () => {
//   console.log("server is running on port 8080");
// });

const PORT = 8080;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/stock", StockRouter);
app.use("/auth", UserRouter);

wss.on("connection", async (ws) => {
  // getIndex()
  //   .then((data) => {
  //     ws.send(JSON.stringify(data));
  //   })
  //   .catch((err) => {
  //     ws.send(JSON.stringify({ error: "Error fetching data" }));
  //   });

  let twxIndex = 17400;
  let otcIndex = 220;

  ws.send(
    JSON.stringify({
      twxObj: { z: (twxIndex + Math.random() * 10).toFixed(2), y: 17400 },
      otcObj: { z: (otcIndex + Math.random() * 10).toFixed(2), y: 220 },
    })
  );
  const timer = setInterval(() => {
    const rendomNum = Math.random() * 10;
    const rendomNum2 = Math.random() * 5;
    const math = Math.random() * 10;
    if (math > 5) {
      twxIndex += rendomNum;
      otcIndex += rendomNum2;
    } else {
      twxIndex -= rendomNum;
      otcIndex -= rendomNum2;
    }
    ws.send(
      JSON.stringify({
        twxObj: { z: twxIndex.toFixed(2), y: 17400 },
        otcObj: { z: otcIndex.toFixed(2), y: 220 },
      })
    );
  }, 3000);

  ws.on("close", () => {
    console.log("client disconnect");
    clearInterval(timer);
  });
});

connectDB(process.env.MONGO_URL);
server.listen(PORT, () => console.log(`Server started on ${PORT}`));
