const express = require("express");

const router = express.Router();

const {
  addCartController,
  getCartController,
  removeItemCartController,
} = require("../controllers/cartControlller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/cart", authMiddleware, addCartController);
router.get("/cart", authMiddleware, getCartController);
router.delete("/cart", removeItemCartController);

module.exports = router;
