const mongoose = require("mongoose");

const productItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    min: 1,
  },
});
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [productItemSchema],
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
