const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/auth");
const jwt = require("jsonwebtoken");

const addCartController = async (req, res) => {
  try {
    // Get data
    const { productId, quantity } = req.body;
    // Validate data
    if (!productId || !quantity)
      return res.status(400).json({ msg: "Missing Data" });

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User Not Found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product Not Found" });

    if (quantity > product.stock)
      return res.json({ msg: "quantity larger than stock" });

    const cart = await Cart.find({ user: userId });

    if (!cart) await Cart.create({ user, items: [] });

    const itemIndex = cart.items.findIndex((item) => {
      item.product.equals(productId);
    });

    if (itemIndex > -1) cart.items[itemIndex].quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    product.stock -= quantity;
    await product.save();
    res.status(201).json({ msg: "Done Add product in cart", data: product });
  } catch (error) {
    res.status(500).json({ msg: "Error has occured" });
  }
};

const getCartController = async (req, res) => {
  try {
    const user = req.user.id;

    const cart = await Cart.findOne({ user });

    res.status(200).json({
      msg: "Reading Done",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const removeItemCartController = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
