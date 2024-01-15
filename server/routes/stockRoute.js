const router = require("express").Router();
const {
  getStock,
  createStock,
  editStock,
  deleteStock,
} = require("../controllers/stockController");
const authMiddleWare = require("../middleware/authMiddle");

router.get("/getStockNote", authMiddleWare, getStock);

router.post("/createStockNote", authMiddleWare, createStock);

router.put("/editStockNote", authMiddleWare, editStock);

router.delete(`/deleteStockNote/:id`, authMiddleWare, deleteStock);

module.exports = router;
