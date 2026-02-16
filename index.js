require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = parseInt(process.env.SALTROUNDS) || 10;

app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

const User = require("./models/User");
const Product = require("./models/Product");

app.get("/", (req, res) => {
  res.send("Welcome to Micro Electronic home ");
});

app.post("/register", async (req, res) => {
  try {
    // get user data
    const { username, email, password, role } = req.body;
    // validate data
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Invalid Data" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ msg: "Account Already Exist" });
    }
    if (password.length < 6)
      return res.status(400).json({ msg: "Password is too small" });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    // Response
    res.status(201).json({ msg: "Created Done!", data: user });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Missing Data" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "User Not Found" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).json({ msg: "Invalid Password" });

    res.status(200).json({ msg: "Login successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/products", async (req, res) => {
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
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find(req.query);
    res.status(200).json({ msg: "Read Done", data: products });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
