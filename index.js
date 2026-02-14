require("dotenv").config();

express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT;

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

app.get("/", (req, res) => {
  res.send("Welcome to Micro Electronic home ");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
