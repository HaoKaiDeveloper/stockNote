const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    creatorId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    companyName: {
      type: String,
    },
    shares: {
      type: Number,
    },
    buyingPrice: {
      type: Number,
    },
    sellingPrice: {
      type: Number,
    },
    closingPrice: {
      type: Number,
      default: null,
    },
    imgs: {
      type: [{}],
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("stock", stockSchema);
