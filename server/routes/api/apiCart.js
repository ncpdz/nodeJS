const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const CartController = require("../../controllers/api/cart_controller");

router.use(authMiddleware);

router.post("/add", CartController.addToCart);

router.get("/", CartController.getCart);

router.post("/remove", CartController.removeFromCart);

router.post("/clear", CartController.clearCart);

module.exports = router;
