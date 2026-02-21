const Product = require("../models/Product");
const User = require("../models/auth");

const createProduct = async (req, res) => {
  try {
    const { title, price, stock, userId } = req.body;
    const user = await User.findById(userId);

    if (user.role !== "admin") {
      return res.status(401).json({ msg: "Unauthorized action!" });
    }
    if (!title || !price || !stock)
      return res.status(400).json({ msg: "Missing Data" });

    const product = await Product.create({ title, price, stock });
    res.status(201).json({ msg: "Created Done", data: product });
  } catch (error) {
    console.log(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await Product.find(req.query);
    res.status(200).json({ msg: "Read Done", data: products });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createProduct, getProduct };
