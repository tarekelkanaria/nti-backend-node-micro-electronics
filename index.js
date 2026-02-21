require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productsRoutes");

const app = express();
const port = process.env.PORT || 3000;

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

app.use("/api", authRoutes);
app.use("/api", productRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
